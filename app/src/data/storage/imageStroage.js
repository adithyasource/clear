import { generateId } from "../../utils/generateId.js";
import { folderInBaseDirExists } from "./fileStorage.js";
import { appDataDir } from "@tauri-apps/api/path";
import { BaseDirectory, copyFile, mkdir } from "@tauri-apps/plugin-fs";
import { locationJoin } from "../../Globals.jsx";

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
  console.log(origin);
  const originImageFileType = origin.split(".")[origin.split(".").length - 1];

  const gridImageFileName = `${generateId()}.${originImageFileType}`;

  await copyFile(origin, locationJoin([await getImageBinPath(type), gridImageFileName]));
}
