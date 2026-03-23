import { produce } from "solid-js/store";
import { dataFileWrite } from "../data/storage/fileStorage";
import { copyImageIntoBin } from "../data/storage/imageStroage";
import { pickExecutable, pickImage } from "../data/system/locateDialog";
import { libraryData, setLibraryData } from "../stores/libraryStore";
import { generateId } from "../utils/generateId";
import { gameAssetResults } from "../data/api/sgdbAssets";
import { triggerToast } from "../Globals";

export async function processImage({ gridImage, heroImage, logoImage, iconImage }) {
  // implement downloading if downloaded image
  if (gridImage) copyImageIntoBin({ type: "grid", origin: gridImage });
  if (heroImage) copyImageIntoBin({ type: "hero", origin: heroImage });
  if (logoImage) copyImageIntoBin({ type: "logo", origin: logoImage });
  if (iconImage) copyImageIntoBin({ type: "icon", origin: iconImage });
}

export async function addGame({ name, favourite, gameLocation, gridImage, heroImage, logoImage, iconImage }) {
  if (!name) {
    throw new Error("no game name");
  }

  processImage({ gridImage, heroImage, logoImage, iconImage });

  // for (const name of Object.keys(globalContext.libraryData.games)) {
  //   if (gameName() === name) {
  //     gameNameAlreadyExists = true;
  //   }
  // }
  //
  // if (gameNameAlreadyExists) {
  //   triggerToast(`${gameName()} ${translateText("is already in your library")}`);
  //   return;
  // }

  setLibraryData(
    produce((data) => {
      data.games[generateId()] = {
        name,
        gameLocation,
        favourite,
        gridImage,
        heroImage,
        logoImage,
        iconImage,
      };

      return data;
    }),
  );

  dataFileWrite(libraryData);
}

export async function selectGameLocation(setter) {
  const path = await pickExecutable();
  if (path) setter(path);
}

export async function selectImageFileLocation(setter) {
  const path = await pickImage();
  if (path) setter({ type: "local", path });
}

export async function selectImageRemoteLocation({ paths, index, setter }) {
  if (paths) setter({ type: "remote", paths, index });
}

export function changeImageRemoteLocationIndex({ setter, changeBy }) {
  setter((prev) => {
    console.log(prev);
    const maxIndex = prev.paths.length - 1;

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

    selectImageRemoteLocation({ paths: images.grids, index: 0, setter: setters.grid });
    selectImageRemoteLocation({ paths: images.heroes, index: 0, setter: setters.hero });
    selectImageRemoteLocation({ paths: images.logos, index: 0, setter: setters.logo });
    selectImageRemoteLocation({ paths: images.icons, index: 0, setter: setters.icon });

    if (warning) {
      triggerToast(warning);
    }
  } catch (err) {
    triggerToast(err);
  }
}
