import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { logError } from "@/utils/errorHandling";

const defaultData = {
  games: {},
  folders: [],
  notepad: "",
  userSettings: {
    roundedBorders: true,
    showSideBar: true,
    gameTitle: true,
    folderTitle: true,
    quitAfterOpen: true,
    fontName: "sans serif",
    language: "en",
    currentTheme: "dark",
    zoomLevel: 1,
  },
};

async function dataFileExists() {
  try {
    const result = await exists("data.json", { baseDir: BaseDirectory.AppData });
    return result;
  } catch (err) {
    await logError("fileStorage.dataFileExists", err);
    return false;
  }
}

export async function dataFileWrite(json) {
  await writeTextFile("data.json", JSON.stringify(json, null, 4), {
    baseDir: BaseDirectory.AppData,
  });
}

export async function dataFileRead() {
  try {
    if (!(await dataFileExists())) {
      await dataFileWrite(defaultData);
    }

    const content = await readTextFile("data.json", {
      baseDir: BaseDirectory.AppData,
    });

    if (!content) {
      await logError(
        "fileStorage.dataFileRead.emptyFile",
        new Error("data file was empty, replaced with default data"),
      );
      await dataFileWrite(defaultData);
      return defaultData;
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("invalid json in data file");
    }

    // basic structure validation
    if (!parsed.games || !parsed.folders) {
      throw new Error("invalid data structure");
    }

    return parsed;
  } catch (err) {
    await logError("fileStorage.dataFileRead", err);
    return defaultData;
  }
}

export async function folderInBaseDirExists(folderName) {
  try {
    return await exists(folderName, { baseDir: BaseDirectory.AppData });
  } catch (err) {
    await logError("fileStorage.folderInBaseDirExists", err);
    return false;
  }
}
