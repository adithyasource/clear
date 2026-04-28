import { invoke } from "@tauri-apps/api/core";
import { produce } from "solid-js/store";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";
import { gameAssetResults, steamGameSearchResults } from "../data/api/sgdbAssets";
import { downloadImageIntoBin } from "../data/storage/imageStroage";
import { setLibraryData } from "../stores/libraryStore";
import { setTotalImportedSteamGames, setTotalSteamGames } from "../stores/steamStore";
import { getErrorMessage, logError } from "../utils/errorHandling";
import { generateId } from "../utils/generateId";
import { parseVDF } from "../utils/parseVDF";
import { writeUpdateData } from "./libraryService";

function extractSteamIds(steamData) {
  return Object.values(steamData.libraryfolders)
    .flatMap((folder) => Object.keys(folder.apps || {}))
    .filter((id) => id !== "228980"); // exclude redistributables
}

async function safeDownload(type, arr) {
  try {
    if (!arr?.[0]) return undefined;
    return await downloadImageIntoBin({ type, origin: arr[0] });
  } catch {
    return undefined; // fail silently for assets
  }
}

export async function importSteamGames() {
  try {
    await Promise.all([checkIfConnectedToInternet(), checkIfConnectedToServer()]);

    const steamVDFData = await invoke("read_steam_vdf");

    if (!steamVDFData || steamVDFData === "error") {
      throw new Error("failed to read Steam library");
    }

    const steamData = parseVDF(steamVDFData);
    const steamGameIds = extractSteamIds(steamData);

    setTotalSteamGames(steamGameIds.length);

    // reset steam folder cleanly
    setLibraryData(
      produce((data) => {
        data.folders = data.folders.filter((f) => f.name !== "imported from steam");
      }),
    );

    const allGameIds = [];

    for (const steamId of steamGameIds) {
      try {
        const gameData = await steamGameSearchResults(steamId);

        if (!gameData?.success) {
          continue;
        }

        const { id: sgdbId, name } = gameData.data;

        const { images } = await gameAssetResults(sgdbId, 1);

        const [grid, hero, logo, icon] = await Promise.all([
          safeDownload("grid", images.grids),
          safeDownload("hero", images.heroes),
          safeDownload("logo", images.logos),
          safeDownload("icon", images.icons),
        ]);

        const gameId = generateId();

        setLibraryData(
          produce((data) => {
            data.games[gameId] = {
              gameLocation: `steam://rungameid/${steamId}`,
              name,
              gridImagePath: grid,
              heroImagePath: hero,
              logoImagePath: logo,
              iconImagePath: icon,
            };
          }),
        );

        allGameIds.push(gameId);
      } catch (err) {
        await logError(`steamService.importSteamGames.import.${steamId}`, err);
      } finally {
        setTotalImportedSteamGames((x) => x + 1);
      }
    }

    // add folder once
    setLibraryData(
      produce((data) => {
        data.folders.push({
          name: "imported from steam",
          hide: false,
          games: allGameIds,
        });
      }),
    );

    await writeUpdateData();
  } catch (err) {
    await logError("steamService.importSteamGames", err);
    throw new Error(`steam import failed: ${getErrorMessage(err)}`, { cause: err });
  } finally {
    setTotalImportedSteamGames(0);
    setTotalSteamGames(0);
  }
}
