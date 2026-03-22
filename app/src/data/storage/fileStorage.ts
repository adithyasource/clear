import { exists } from "@tauri-apps/plugin-fs";
import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { locationJoin } from "../../Globals";

const defaultData = {
  games: {},
  folders: {},
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
    return await exists("data.json", { baseDir: BaseDirectory.AppData });
  } catch (err) {
    console.error("error checking datafile existence:", err);
    return false;
  }
}

async function dataFileWrite(json) {
  if (!dataFileExists()) {
    throw new Error("data file doesnt exist");
  }

  await writeTextFile("data.json", JSON.stringify(json, null, 4), {
    baseDir: BaseDirectory.AppData,
  });
}

async function dataFileRead() {
  try {
    if (!dataFileExists()) {
      // setup data file

      dataFileWrite(defaultData);
    }

    const content = await readTextFile("data.json", {
      baseDir: BaseDirectory.AppData,
    });

    if (!content) {
      console.error("data file was empty, replaced with default data");
      dataFileWrite(defaultData);
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
    console.error("error reading datafile:", err);
    return defaultData;
  }
}

async function folderInBaseDirExists(folderName) {
  try {
    return await exists(folderName, { baseDir: BaseDirectory.AppData });
  } catch (err) {
    console.error("error checking folder existence:", err);
    return false;
  }
}

async function getImageBinPaths() {
  try {
    const appDataDirPath = await appDataDir();

    let folders = ["heroes", "grids", "logos", "icons"];

    let paths = { heroes: undefined, grids: undefined, logos: undefined, icons: undefined };

    for (let x of folders) {
      if (await folderInBaseDirExists(x)) {
        paths[x] = locationJoin([appDataDirPath, x]);
      } else {
        await mkdir(x, {
          baseDir: BaseDirectory.AppData,
          recursive: true,
        });
      }
    }

    return paths;
  } catch (err) {
    throw new Error(`could not find / create paths for images bins: ${err}`);
  }
}

export { dataFileExists, dataFileRead };
