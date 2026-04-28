import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { produce } from "solid-js/store";
import { gameAssetResults } from "@/data/api/sgdbAssets";
import { copyImageIntoBin, downloadImageIntoBin } from "@/data/storage/imageStroage";
import { pickExecutable, pickImage } from "@/data/system/locateDialog";
import { setLibraryData } from "@/stores/libraryStore";
import { getErrorMessage, logError } from "@/utils/errorHandling";
import { generateId } from "@/utils/generateId";
import { translateText } from "@/utils/translateText";
import { deleteImage, getImagePath } from "../data/storage/imageStroage";
import { libraryData } from "../stores/libraryStore";
import { writeUpdateData } from "./libraryService";

export async function processImage({ imageType, imageData }) {
  if (!imageData.data) return;

  let fileName;

  if (imageData.type === "local") {
    fileName = await copyImageIntoBin({ type: imageType, origin: imageData.data });
  } else if (imageData.type === "remote") {
    fileName = await downloadImageIntoBin({ type: imageType, origin: imageData.data[imageData.index] });
  }

  return fileName;
}

export async function addGame({ name, favourite, gameLocation, gridImage, heroImage, logoImage, iconImage }) {
  if (!name) {
    throw new Error("no game name");
  }

  const gridImagePath = await processImage({ imageType: "grid", imageData: gridImage });
  const heroImagePath = await processImage({ imageType: "hero", imageData: heroImage });
  const logoImagePath = await processImage({ imageType: "logo", imageData: logoImage });
  const iconImagePath = await processImage({ imageType: "icon", imageData: iconImage });

  setLibraryData(
    produce((data) => {
      data.games[generateId()] = {
        name,
        gameLocation,
        favourite,
        gridImagePath,
        heroImagePath,
        logoImagePath,
        iconImagePath,
      };

      return data;
    }),
  );

  await writeUpdateData();
}

export async function deleteGame({ gameId }) {
  const game = libraryData.games[gameId];

  for (const key of ["grid", "hero", "logo", "icon"]) {
    const pathField = `${key}ImagePath`;
    if (game[pathField]) {
      await deleteImage({ type: key, fileName: game[pathField] });
    }
  }

  setLibraryData(
    produce((data) => {
      // deleting game obj
      delete data.games[gameId];

      // removing from folder
      for (const folder of data.folders) {
        folder.games = folder.games.filter((id) => id !== gameId);
      }

      return data;
    }),
  );

  await writeUpdateData();
}

export async function updateGame(gameId, newData) {
  console.log(gameId);
  console.log(newData);
  const game = libraryData.games[gameId];

  const deletionList = [];

  const updatedGame = JSON.parse(JSON.stringify(game));

  for (const key of ["grid", "hero", "logo", "icon"]) {
    const field = `${key}Image`;
    const pathField = `${key}ImagePath`;

    const newValue = newData[field];
    const newValueData = newValue.data;

    const oldValueFile = game[pathField];

    if (!newValueData) {
      if (oldValueFile) {
        await deleteImage({ type: key, fileName: oldValueFile });
        updatedGame[pathField] = null;
      }
      continue;
    }

    if (newValue.type === "remote") {
      // will have to download new and delete old
      updatedGame[pathField] = await downloadImageIntoBin({ type: key, origin: newValueData[newValue.index] });

      if (oldValueFile) {
        deletionList.push({ type: key, fileName: oldValueFile });
      }
      continue;
    }

    let oldValueData;
    if (oldValueFile) {
      oldValueData = await getImagePath({ type: key, fileName: oldValueFile });
    }

    if (oldValueData !== newValueData) {
      // need to delete ${oldValue} and move in ${newValue}

      updatedGame[pathField] = await copyImageIntoBin({ type: key, origin: newValueData });

      deletionList.push({ type: key, fileName: oldValueFile });
    }
  }

  for (const file of deletionList) {
    await deleteImage({ type: file.type, fileName: file.fileName });
  }

  Object.assign(updatedGame, {
    name: newData.name,
    favourite: newData.favourite,
    gameLocation: newData.gameLocation,
  });

  setLibraryData(
    "games",
    gameId,
    produce((game) => {
      Object.assign(game, updatedGame);
    }),
  );

  await writeUpdateData();
}

export async function selectGameLocation(setter) {
  const path = await pickExecutable();
  if (path) setter(path);
}

export async function selectImageFileLocation(setter) {
  const path = await pickImage();
  if (path) setter({ type: "local", data: path });
}

export async function selectImageRemoteLocation({ data, index, setter }) {
  if (data) setter({ type: "remote", data, index });
}

export function changeImageRemoteLocationIndex({ setter, changeBy }) {
  setter((prev) => {
    console.log(prev);
    const maxIndex = prev.data.length - 1;

    let newIndex = prev.index + changeBy;

    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    return {
      ...prev,
      index: newIndex,
    };
  });
}

export async function fetchGameAssets({ gameId, setters }) {
  try {
    const { images, warning } = await gameAssetResults(gameId);

    console.log(images, warning);

    selectImageRemoteLocation({ data: images.grids, index: 0, setter: setters.grid });
    selectImageRemoteLocation({ data: images.heroes, index: 0, setter: setters.hero });
    selectImageRemoteLocation({ data: images.logos, index: 0, setter: setters.logo });
    selectImageRemoteLocation({ data: images.icons, index: 0, setter: setters.icon });

    return { warning };
  } catch (err) {
    await logError("gameService.fetchGameAssets", err);
    throw new Error(getErrorMessage(err), { cause: err });
  }
}

export async function openGame(gameLocation) {
  if (!gameLocation) {
    throw new Error(translateText("no game file provided!"));
  }

  try {
    await invoke("open_location", {
      location: gameLocation,
    });

    console.log(libraryData.userSettings.quitAfterOpen);
    if (libraryData.userSettings.quitAfterOpen) {
      getCurrentWindow().close();
    } else {
      return {
        ok: true,
        message: translateText("game launched! enjoy your session!"),
      };
    }
  } catch (err) {
    await logError("gameService.openGame", err);
    throw new Error(getErrorMessage(err), { cause: err });
  }
}
