import {
  BaseDirectory,
  exists,
  mkdir,
  readDir,
  readTextFile,
  remove,
  rename,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { logError } from "@/utils/errorHandling";
import { generateId } from "@/utils/generateId.js";

const DATA_VERSION = 2;

const defaultData = {
  dataVersion: DATA_VERSION,
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

async function migrateLegacyAssetFolders() {
  const folderRenames = [
    ["grids", "grid"],
    ["heroes", "hero"],
    ["icons", "icon"],
    ["logos", "logo"],
  ];

  for (const [oldName, newName] of folderRenames) {
    const oldExists = await exists(oldName, { baseDir: BaseDirectory.AppData });
    if (!oldExists) continue;

    const newExists = await exists(newName, { baseDir: BaseDirectory.AppData });

    if (!newExists) {
      await rename(oldName, newName, {
        oldPathBaseDir: BaseDirectory.AppData,
        newPathBaseDir: BaseDirectory.AppData,
      });
      continue;
    }

    await mkdir(newName, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });

    const legacyEntries = await readDir(oldName, {
      baseDir: BaseDirectory.AppData,
    });

    for (const entry of legacyEntries) {
      if (!entry.name) continue;

      await rename(`${oldName}/${entry.name}`, `${newName}/${entry.name}`, {
        oldPathBaseDir: BaseDirectory.AppData,
        newPathBaseDir: BaseDirectory.AppData,
      });
    }

    await remove(oldName, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
  }
}

function migrateV1ToV2(data) {
  const oldGameIdToNewGameId = {};
  const originalGameEntries = Object.entries(data.games || {});
  const usedGameIds = new Set();

  function createUniqueGameId() {
    let newGameId = generateId();

    while (usedGameIds.has(newGameId)) {
      newGameId = generateId();
    }

    usedGameIds.add(newGameId);
    return newGameId;
  }

  const games = Object.fromEntries(
    originalGameEntries.map(([gameId, game]) => {
      const safeGame = game && typeof game === "object" ? game : {};
      const normalizedGameId = createUniqueGameId();

      oldGameIdToNewGameId[gameId] = normalizedGameId;

      return [
        normalizedGameId,
        {
          name: safeGame.name || gameId,
          gameLocation: safeGame.location ?? "",
          favourite: safeGame.favourite ?? false,
          gridImagePath: safeGame.gridImage ?? null,
          heroImagePath: safeGame.heroImage ?? null,
          logoImagePath: safeGame.logo ?? null,
          iconImagePath: safeGame.icon ?? null,
        },
      ];
    }),
  );

  const folders = Object.values(data.folders || {})
    .sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
    .map((folder) => ({
      name: folder?.name || "",
      hide: folder?.hide ?? false,
      games: Array.isArray(folder?.games)
        ? folder.games.map((gameId) => oldGameIdToNewGameId[gameId]).filter(Boolean)
        : [],
    }));

  return {
    ...defaultData,
    ...data,
    dataVersion: DATA_VERSION,
    games,
    folders,
    notepad: data.notepad ?? defaultData.notepad,
    userSettings: {
      ...defaultData.userSettings,
      ...(data.userSettings || {}),
    },
  };
}

function normalizeV2Data(data) {
  if (!data || typeof data !== "object") {
    return defaultData;
  }

  const games = Object.fromEntries(
    Object.entries(data.games || {}).map(([gameId, game]) => {
      const safeGame = game && typeof game === "object" ? game : {};

      return [
        gameId,
        {
          name: safeGame.name || gameId,
          gameLocation: safeGame.gameLocation ?? "",
          favourite: safeGame.favourite ?? false,
          gridImagePath: safeGame.gridImagePath ?? null,
          heroImagePath: safeGame.heroImagePath ?? null,
          logoImagePath: safeGame.logoImagePath ?? null,
          iconImagePath: safeGame.iconImagePath ?? null,
        },
      ];
    }),
  );

  const folders = Array.isArray(data.folders)
    ? data.folders.map((folder) => ({
        name: folder?.name || "",
        hide: folder?.hide ?? false,
        games: Array.isArray(folder?.games) ? folder.games : [],
      }))
    : [];

  return {
    ...defaultData,
    ...data,
    dataVersion: DATA_VERSION,
    games,
    folders,
    notepad: data.notepad ?? defaultData.notepad,
    userSettings: {
      ...defaultData.userSettings,
      ...(data.userSettings || {}),
    },
  };
}

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

    let migratedData;

    if (parsed.dataVersion == null) {
      await migrateLegacyAssetFolders();
      migratedData = migrateV1ToV2(parsed);
    } else {
      migratedData = normalizeV2Data(parsed);
    }

    if (JSON.stringify(parsed) !== JSON.stringify(migratedData)) {
      await dataFileWrite(migratedData);
    }

    return migratedData;
  } catch (err) {
    await logError("fileStorage.dataFileRead", err);
    return defaultData;
  }
}
