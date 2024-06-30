import { createContext, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { invoke } from "@tauri-apps/api/tauri";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { textLanguages } from "./Text";
import { parseVDF } from "./libraries/parseVDF";

export const GlobalContext = createContext();
export const UIContext = createContext();
export const SelectedDataContext = createContext();
export const ApplicationStateContext = createContext();
export const SteamDataContext = createContext();

// * Global Store
export const [libraryData, setLibraryData] = createStore({
  // Default Values
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
    zoomLevel: 1
  }
});

// * UI
const [showSettingsLanguageSelector, setShowSettingsLanguageSelector] =
  createSignal(false);
const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
const [showCloseConfirm, setShowCloseConfirm] = createSignal(false);
const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] =
  createSignal(false);
const [showNewVersionAvailable, setShowNewVersionAvailable] =
  createSignal(false);
const [showNewGameModal, setShowNewGameModal] = createSignal(false);
const [showEditGameModal, setShowEditGameModal] = createSignal(false);
const [showNewFolderModal, setShowNewFolderModal] = createSignal(false);
const [showEditFolderModal, setShowEditFolderModal] = createSignal(false);
const [showGamePopUpModal, setShowGamePopUpModal] = createSignal(false);
const [showNotepadModal, setShowNotepadModal] = createSignal(false);
const [showSettingsModal, setShowSettingsModal] = createSignal(false);
const [showLoadingModal, setShowLoadingModal] = createSignal(false);

// * Selected Data Signals
const [selectedGame, setSelectedGame] = createSignal({});
const [selectedFolder, setSelectedFolder] = createSignal([]);
const [selectedGameId, setSelectedGameId] = createSignal();

// * Application State Signals
const [currentGames, setCurrentGames] = createSignal([]);
const [currentFolders, setCurrentFolders] = createSignal([]);

const [searchValue, setSearchValue] = createSignal();
const [toastMessage, setToastMessage] = createSignal("");
const [appVersion, setAppVersion] = createSignal("1.1.0");
const [latestVersion, setLatestVersion] = createSignal("");
const [appDataDirPath, setAppDataDirPath] = createSignal({});
const [windowWidth, setWindowWidth] = createSignal(window.innerWidth);

// * Steam Data Signals
const [totalSteamGames, setTotalSteamGames] = createSignal(0);
const [totalImportedSteamGames, setTotalImportedSteamGames] = createSignal(0);

// * Exporting Context Providers

export function GlobalContextProvider(props) {
  const context = {
    libraryData,
    setLibraryData
  };

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export function UIContextProvider(props) {
  const context = {
    showSettingsLanguageSelector,
    setShowSettingsLanguageSelector,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showCloseConfirm,
    setShowCloseConfirm,
    showImportAndOverwriteConfirm,
    setShowImportAndOverwriteConfirm,
    showNewVersionAvailable,
    setShowNewVersionAvailable,
    showNewGameModal,
    setShowNewGameModal,
    showEditGameModal,
    setShowEditGameModal,
    showNewFolderModal,
    setShowNewFolderModal,
    showEditFolderModal,
    setShowEditFolderModal,
    showGamePopUpModal,
    setShowGamePopUpModal,
    showNotepadModal,
    setShowNotepadModal,
    showSettingsModal,
    setShowSettingsModal,
    showLoadingModal,
    setShowLoadingModal
  };

  return (
    <UIContext.Provider value={context}>{props.children}</UIContext.Provider>
  );
}

export function SelectedDataContextProvider(props) {
  const context = {
    selectedGame,
    setSelectedGame,
    selectedFolder,
    setSelectedFolder,
    selectedGameId,
    setSelectedGameId
  };

  return (
    <SelectedDataContext.Provider value={context}>
      {props.children}
    </SelectedDataContext.Provider>
  );
}

export function ApplicationStateContextProvider(props) {
  const context = {
    currentGames,
    setCurrentGames,
    currentFolders,
    setCurrentFolders,
    searchValue,
    setSearchValue,
    toastMessage,
    setToastMessage,
    appVersion,
    setAppVersion,
    latestVersion,
    setLatestVersion,
    appDataDirPath,
    setAppDataDirPath,
    windowWidth,
    setWindowWidth
  };

  return (
    <ApplicationStateContext.Provider value={context}>
      {props.children}
    </ApplicationStateContext.Provider>
  );
}

export function SteamDataContextProvider(props) {
  const context = {
    totalSteamGames,
    setTotalSteamGames,
    totalImportedSteamGames,
    setTotalImportedSteamGames
  };

  return (
    <SteamDataContext.Provider value={context}>
      {props.children}
    </SteamDataContext.Provider>
  );
}

// * Global Functions

export async function createEmptyLibrary() {
  await createDir("heroes", {
    dir: BaseDirectory.AppData,
    recursive: true
  });
  await createDir("grids", {
    dir: BaseDirectory.AppData,
    recursive: true
  });
  await createDir("logos", {
    dir: BaseDirectory.AppData,
    recursive: true
  });
  await createDir("icons", {
    dir: BaseDirectory.AppData,
    recursive: true
  });

  updateData();
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("data.json", { dir: BaseDirectory.AppData })) {
    const getLibraryData = await readTextFile("data.json", {
      dir: BaseDirectory.AppData
    });

    // ! potential footgun here cause you're not checking if games are empty
    if (getLibraryData !== "" && JSON.parse(getLibraryData).folders !== "") {
      setCurrentGames("");
      setCurrentFolders("");

      setLibraryData(JSON.parse(getLibraryData));

      for (let x = 0; x < Object.keys(libraryData.folders).length; x++) {
        for (const key in libraryData.folders) {
          if (libraryData.folders[key].index === x) {
            setCurrentFolders((z) => [...z, key]);
          }
        }
      }

      setCurrentGames(Object.keys(libraryData.games));

      console.log("data fetched");

      // ? Checks currentTheme and adds it to the document classList for Tailwind

      if (libraryData.userSettings.currentTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      closeDialog("newGameModal");
      closeDialog("newFolderModal");
      closeDialog("gamePopup");
      closeDialog("editGameModal");
      closeDialog("editFolderModal");
    } else createEmptyLibrary();
  } else {
    createEmptyLibrary();
  }
}

export async function openGame(gameLocation) {
  if (gameLocation === undefined) {
    triggerToast(translateText("no game file provided!"));
    return;
  }

  invoke("open_location", {
    location: gameLocation
  });

  if (
    libraryData.userSettings.quitAfterOpen === true ||
    libraryData.userSettings.quitAfterOpen === undefined
  ) {
    setTimeout(async () => {
      invoke("close_app");
    }, 500);
  } else {
    triggerToast(translateText("game launched! enjoy your session!"));
  }
}

export function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export async function importSteamGames() {
  openDialog("loadingModal");

  const connectedToInternet = await checkIfConnectedToInternet();

  if (connectedToInternet) {
    const steamVDFData = await invoke("read_steam_vdf");

    if (steamVDFData === "error") {
      closeDialog("loadingModal");

      triggerToast(
        translateText(
          "sorry but there was an error \n reading your Steam library :("
        )
      );

      return;
    }

    const steamData = parseVDF(steamVDFData);

    const steamGameIds = [];

    for (let x = 0; x < Object.keys(steamData.libraryfolders).length; x++) {
      steamGameIds.push(...Object.keys(steamData.libraryfolders[x].apps));
    }

    const index = steamGameIds.indexOf("228980");

    index !== -1 ? steamGameIds.splice(index, 1) : null;

    setTotalSteamGames(steamGameIds.length);

    const allGameNames = [];

    // ! check if this works
    setLibraryData((data) => {
      data.folders.steam = undefined;
      return data;
    });

    await updateData();

    for (const steamId of steamGameIds) {
      console.log(steamId);

      let gameData = await fetch(
        `${import.meta.env.VITE_CLEAR_API_URL}/?steamID=${steamId}`
      );

      gameData = await gameData.json();

      const gameSGDBID = gameData.data.id;
      const name = gameData.data.name;
      allGameNames.push(name);
      let gridImageFileName = `${generateRandomString()}.png`;
      let heroImageFileName = `${generateRandomString()}.png`;
      let logoImageFileName = `${generateRandomString()}.png`;
      let iconImageFileName = `${generateRandomString()}.png`;

      let assetsData = await fetch(
        `${import.meta.env.VITE_CLEAR_API_URL}/?assets=${gameSGDBID}&length=1`
      );

      assetsData = await assetsData.json();

      if (assetsData.grids.length !== 0) {
        await invoke("download_image", {
          link: assetsData.grids[0],
          location: `${appDataDirPath()}grids\\${gridImageFileName}`
        });
      } else {
        gridImageFileName = undefined;
      }
      if (assetsData.heroes.length !== 0) {
        await invoke("download_image", {
          link: assetsData.heroes[0],
          location: `${appDataDirPath()}heroes\\${heroImageFileName}`
        });
      } else {
        heroImageFileName = undefined;
      }
      if (assetsData.logos.length !== 0) {
        await invoke("download_image", {
          link: assetsData.logos[0],
          location: `${appDataDirPath()}logos\\${logoImageFileName}`
        });
      } else {
        logoImageFileName = undefined;
      }
      if (assetsData.icons.length !== 0) {
        await invoke("download_image", {
          link: assetsData.icons[0],
          location: `${appDataDirPath()}icons\\${iconImageFileName}`
        });
      } else {
        iconImageFileName = undefined;
      }
      setLibraryData((data) => {
        data.games[name] = {
          location: `steam://rungameid/${steamId}`,
          name: name,
          heroImage: heroImageFileName,
          gridImage: gridImageFileName,
          logo: logoImageFileName,
          icon: iconImageFileName,
          favourite: false
        };
        return data;
      });
      await updateData();
      setTotalImportedSteamGames((x) => x + 1);
    }

    setLibraryData(
      produce((data) => {
        data.folders.steam = {
          name: "steam",
          hide: false,
          games: allGameNames,
          index: currentFolders().length
        };
        return data;
      })
    );

    await updateData().then(() => {
      closeDialog("loadingModal");
      closeDialog("settingsModal");
      setTotalImportedSteamGames(0);
      setTotalSteamGames(0);
    });
  } else {
    closeDialog("loadingModal");
    triggerToast(translateText("you're not connected to the internet :("));
  }
}

export function translateText(text) {
  if (!Object.prototype.hasOwnProperty.call(textLanguages, text)) {
    console.trace(`missing text translation '${text}'`);

    return "undefined";
  }

  const translatedText = textLanguages[text][libraryData.userSettings.language];

  if (libraryData.userSettings.language === "en" || translatedText === "") {
    return text;
  }

  return translatedText;
}

export async function updateData() {
  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(libraryData, null, 4)
    },
    {
      dir: BaseDirectory.AppData
    }
  ).then(getData());
}

let toastTimeout = setTimeout(() => {}, 0);

export function triggerToast(message) {
  document.querySelector(".toast").hidePopover();
  setTimeout(() => {
    document.querySelector(".toast").showPopover();
  }, 20);

  setToastMessage(message);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    document.querySelector(".toast").hidePopover();
  }, 1500);
}

export function openDialog(dialogData) {
  switch (dialogData) {
    case "newGameModal":
      setShowNewGameModal(true);
      break;

    case "editGameModal":
      setShowEditGameModal(true);
      break;

    case "newFolderModal":
      setShowNewFolderModal(true);
      break;

    case "editFolderModal":
      setShowEditFolderModal(true);
      break;

    case "gamePopup":
      setShowGamePopUpModal(true);
      break;

    case "notepadModal":
      setShowNotepadModal(true);
      break;

    case "settingsModal":
      setShowSettingsModal(true);
      break;

    case "loadingModal":
      setShowLoadingModal(true);
      break;
  }

  const dialogRef = document.querySelector(`[data-${dialogData}]`);

  dialogRef.classList.remove("hideDialog");
  dialogRef.showModal();
  dialogRef.classList.add("showDialog");

  document.activeElement.focus();
  document.activeElement.blur();
}

export function closeDialog(dialogData, ref) {
  function updateModalShowState() {
    switch (dialogData) {
      case "newGameModal":
        setShowNewGameModal(false);
        break;

      case "editGameModal":
        setShowEditGameModal(false);
        break;

      case "newFolderModal":
        setShowNewFolderModal(false);
        break;

      case "editFolderModal":
        setShowEditFolderModal(false);
        break;

      case "gamePopup":
        setShowGamePopUpModal(false);
        break;

      case "notepadModal":
        setShowNotepadModal(false);
        break;

      case "settingsModal":
        setShowSettingsModal(false);
        break;

      case "loadingModal":
        setShowLoadingModal(false);
        break;
    }
  }

  if (ref !== undefined) {
    ref.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();

        ref.classList.remove("showDialog");
        ref.classList.add("hideDialog");
        setTimeout(() => {
          ref.close();
          updateModalShowState();
        }, 200);
      }
    });
  } else {
    const dialogRef = document.querySelector(`[data-${dialogData}]`);

    console.log(dialogRef);
    dialogRef.classList.remove("showDialog");
    dialogRef.classList.add("hideDialog");
    setTimeout(() => {
      dialogRef.close();
      updateModalShowState();
    }, 200);
  }
}

export function closeDialogImmediately(ref) {
  ref.classList.remove("showDialog");
  ref.classList.add("hideDialog");
  setTimeout(() => {
    ref.close();
  }, 200);
}

export async function toggleSideBar() {
  setSearchValue("");

  setLibraryData("userSettings", "showSideBar", (x) => !x);

  await updateData();
}

export async function checkIfConnectedToInternet() {
  let connectedToInternet = false;

  try {
    await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?version=a`);
    connectedToInternet = true;
  } catch {
    connectedToInternet = false;
  }

  return connectedToInternet;
}
