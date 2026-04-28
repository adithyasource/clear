import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { BaseDirectory, copyFile, mkdir } from "@tauri-apps/plugin-fs";
import { folderInBaseDirExists } from "@/data/storage/fileStorage.js";
import { getErrorMessage, logError } from "@/utils/errorHandling";
import { generateId } from "@/utils/generateId.js";
import { locationJoin } from "@/utils/paths.js";

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
    await logError(`imageStorage.getImageBinPath.${type}`, err);
    throw new Error(`could not find / create path for image bin: ${getErrorMessage(err)}`, { cause: err });
  }
}

export async function getImagePath({ type, fileName }) {
  try {
    const binPath = await getImageBinPath(type);

    return locationJoin([binPath, fileName]);
  } catch (err) {
    await logError(`imageStorage.getImagePath.${type}`, err);
    throw new Error(`could not find image path: ${getErrorMessage(err)}`, { cause: err });
  }
}

export async function copyImageIntoBin({ type, origin }) {
  try {
    const originImageFileType = origin.split(".")[origin.split(".").length - 1];

    const fileName = `${generateId()}.${originImageFileType}`;

    const finalPath = locationJoin([await getImageBinPath(type), fileName]);

    await copyFile(origin, finalPath);

    return fileName;
  } catch (err) {
    await logError(`imageStorage.copyImageIntoBin.${type}`, err);
    throw new Error(`image could not be copied: ${getErrorMessage(err)}`, { cause: err });
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

    return fileName;
  } catch (err) {
    await logError(`imageStorage.downloadImageIntoBin.${type}`, err);
    throw new Error(`image could not be downloaded: ${getErrorMessage(err)}`, { cause: err });
  }
}

export async function deleteImage({ type, fileName }) {
  try {
    const finalPath = await getImagePath({ type, fileName });

    console.log(finalPath);

    await invoke("delete_asset", {
      path: finalPath,
    });
  } catch (err) {
    await logError(`imageStorage.deleteImage.${type}`, err);
    throw new Error(`image could not be deleted: ${getErrorMessage(err)}`, { cause: err });
  }
}
