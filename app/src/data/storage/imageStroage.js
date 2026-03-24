import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { BaseDirectory, copyFile, mkdir } from "@tauri-apps/plugin-fs";
import { locationJoin } from "@/Globals.jsx";
import { generateId } from "@/utils/generateId.js";
import { folderInBaseDirExists } from "@/data/storage/fileStorage.js";

export async function getImageBinPath(type) {
  const appDataDirPath = await appDataDir();

  try {
    if (await folderInBaseDirExists(type)) {
      return locationJoin([appDataDirPath, type]);
    }

    await mkdir(type, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });

    return locationJoin([appDataDirPath, type]);
  } catch (err) {
    throw new Error(`could not find / create path for image bin: ${err}`);
  }
}

export async function copyImageIntoBin({ type, origin }) {
  try {
    const originImageFileType = origin.split(".")[origin.split(".").length - 1];

    const fileName = `${generateId()}.${originImageFileType}`;

    const finalPath = locationJoin([await getImageBinPath(type), fileName]);

    await copyFile(origin, finalPath);

    return finalPath;
  } catch (err) {
    throw new Error("image could not be downloaded: ", err);
  }
}

export async function downloadImageIntoBin({ type, origin }) {
  try {
    const fileName = `${generateId()}.png`;

    const finalPath = locationJoin([await getImageBinPath(type), fileName]);

    await invoke("download_image", {
      link: origin,
      location: finalPath,
    });

    return finalPath;
  } catch (err) {
    throw new Error("image could not be downloaded: ", err);
  }
}
