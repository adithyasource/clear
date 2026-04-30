import { invoke } from "@tauri-apps/api/core";
import { produce } from "solid-js/store";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";
import { gameAssetResults, steamGameSearchResults } from "../data/api/sgdbAssets";
import { downloadImageIntoBin } from "../data/storage/imageStroage";
import { setLibraryData } from "../stores/libraryStore";
import { setTotalImportedSteamGames, setTotalSteamGames } from "../stores/steamStore";
import { getErrorMessage, logError } from "../utils/errorHandling";
import { generateId } from "../utils/generateId";
import { writeUpdateData } from "./libraryService";

async function safeDownload(type, arr) {
  try {
    if (!arr?.[0]) return undefined;
    return await downloadImageIntoBin({ type, origin: arr[0] });
  } catch {
    return undefined; // fail silently for assets
  }
}

const BATCH_SIZE = 5;

export async function importSteamGames(signal) {
  try {
    await Promise.all([checkIfConnectedToInternet(), checkIfConnectedToServer()]);

    const steamGameIds = await invoke("read_steam_vdf");

    setTotalSteamGames(steamGameIds.length);

    const newGames = {};
    const allGameIds = [];

    let processed = 0;

    for (let i = 0; i < steamGameIds.length; i += BATCH_SIZE) {
      if (signal?.aborted) throw new Error("import cancelled");

      const batch = steamGameIds.slice(i, i + BATCH_SIZE);

      const results = await Promise.all(
        batch.map(async (steamId) => {
          try {
            const gameData = await steamGameSearchResults(steamId);
            if (!gameData?.success) return null;

            const { id: sgdbId, name } = gameData.data;

            const { images } = await gameAssetResults(sgdbId, 1);

            const [grid, hero, logo, icon] = await Promise.all([
              safeDownload("grid", images.grids),
              safeDownload("hero", images.heroes),
              safeDownload("logo", images.logos),
              safeDownload("icon", images.icons),
            ]);

            const gameId = generateId();

            return {
              gameId,
              steamId,
              game: {
                gameLocation: `steam://rungameid/${steamId}`,
                name,
                gridImagePath: grid,
                heroImagePath: hero,
                logoImagePath: logo,
                iconImagePath: icon,
              },
            };
          } catch (err) {
            await logError(`steamService.importSteamGames.import.${steamId}`, err);
            return null;
          } finally {
            processed++;
            setTotalImportedSteamGames(processed);
          }
        }),
      );

      for (const result of results) {
        if (!result) continue;

        newGames[result.gameId] = result.game;
        allGameIds.push(result.gameId);
      }
    }

    allGameIds.sort();

    setLibraryData(
      produce((data) => {
        data.folders = data.folders.filter((f) => f.name !== "imported from steam");

        data.games = { ...data.games, ...newGames };

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

    throw new Error(`steam import failed: ${getErrorMessage(err)}`, {
      cause: err,
    });
  } finally {
    setTotalImportedSteamGames(0);
    setTotalSteamGames(0);
  }
}
