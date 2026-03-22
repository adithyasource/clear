import { produce } from "solid-js/store";
import { dataFileWrite } from "../data/storage/fileStorage";
import { copyImageIntoBin } from "../data/storage/imageStroage";
import { pickExecutable, pickImage } from "../data/system/locateDialog";
import { libraryData, setLibraryData } from "../stores/libraryStore";
import { generateId } from "../utils/generateId";

export async function prepareImageFiles({ gridImage, heroImage, logoImage, iconImage }) {
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

  prepareImageFiles({ gridImage, heroImage, logoImage, iconImage });

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

export async function selectImageLocation(setter) {
  const path = await pickImage();
  if (path) setter(path);
}
