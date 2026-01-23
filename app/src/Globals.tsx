import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
// importing code snippets and library functions
import { invoke } from "@tauri-apps/api/core";
import { Accessor, createContext, createSignal, Setter } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { parseVDF } from "./libraries/parseVDF.js";

// importing text snippets for different languages
import { textLanguages } from "./Text.js";
import { Game, Language, LibraryData, UserSettings } from "./core/types/game.js";

export type GlobalContextType = {
  libraryData: Accessor<LibraryData>;
  setLibraryData: Setter<LibraryData>;
};

export const GlobalContext = createContext<GlobalContextType>();
export const UIContext = createContext();
export const SelectedDataContext = createContext();
export const ApplicationStateContext = createContext();
export const SteamDataContext = createContext();

// creating store for library data
export const [libraryData, setLibraryData] = createSignal<LibraryData>(new LibraryData());

// ui signals
const [showSettingsLanguageSelector, setShowSettingsLanguageSelector] = createSignal<boolean>(false);
const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] = createSignal(false);
const [showNewVersionAvailable, setShowNewVersionAvailable] = createSignal(false);
const [showNewGameModal, setShowNewGameModal] = createSignal(false);
const [showEditGameModal, setShowEditGameModal] = createSignal(false);
const [showNewFolderModal, setShowNewFolderModal] = createSignal(false);
const [showEditFolderModal, setShowEditFolderModal] = createSignal(false);
const [showGamePopUpModal, setShowGamePopUpModal] = createSignal(false);
const [showNotepadModal, setShowNotepadModal] = createSignal(false);
const [showSettingsModal, setShowSettingsModal] = createSignal(false);
const [showLoadingModal, setShowLoadingModal] = createSignal(false);
const [userIsTabbing, setUserIsTabbing] = createSignal(false);

// selected data signals
const [selectedGame, setSelectedGame] = createSignal({});
const [selectedFolder, setSelectedFolder] = createSignal([]);
const [selectedGameId, setSelectedGameId] = createSignal();

// application state signals
const [currentGames, setCurrentGames] = createSignal([]);
const [currentFolders, setCurrentFolders] = createSignal([]);
const [searchValue, setSearchValue] = createSignal();
const [toastMessage, setToastMessage] = createSignal("");
const [appVersion, setAppVersion] = createSignal("1.1.0");
const [systemPlatform, setSystemPlatform] = createSignal("");
const [latestVersion, setLatestVersion] = createSignal("");
const [appDataDirPath, setAppDataDirPath] = createSignal({});
const [windowWidth, setWindowWidth] = createSignal(self.innerWidth);

// steam data signals
const [totalSteamGames, setTotalSteamGames] = createSignal(0);
const [totalImportedSteamGames, setTotalImportedSteamGames] = createSignal(0);

// adding signals to and exporting their respective context providers

export function GlobalContextProvider(props) {
  const context = {
    libraryData,
    setLibraryData,
  };
  return <GlobalContext.Provider value={context}>{props.children}</GlobalContext.Provider>;
}

export function UIContextProvider(props) {
  const context = {
    showSettingsLanguageSelector,
    setShowSettingsLanguageSelector,
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
    setShowLoadingModal,
    userIsTabbing,
    setUserIsTabbing,
  };

  return <UIContext.Provider value={context}>{props.children}</UIContext.Provider>;
}

export function SelectedDataContextProvider(props) {
  const context = {
    selectedGame,
    setSelectedGame,
    selectedFolder,
    setSelectedFolder,
    selectedGameId,
    setSelectedGameId,
  };

  return <SelectedDataContext.Provider value={context}>{props.children}</SelectedDataContext.Provider>;
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
    systemPlatform,
    setSystemPlatform,
    latestVersion,
    setLatestVersion,
    appDataDirPath,
    setAppDataDirPath,
    windowWidth,
    setWindowWidth,
  };

  return <ApplicationStateContext.Provider value={context}>{props.children}</ApplicationStateContext.Provider>;
}

export function SteamDataContextProvider(props) {
  const context = {
    totalSteamGames,
    setTotalSteamGames,
    totalImportedSteamGames,
    setTotalImportedSteamGames,
  };

  return <SteamDataContext.Provider value={context}>{props.children}</SteamDataContext.Provider>;
}

// global helper functions

async function setupFoldersForImages() {
  await mkdir("heroes", {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
  await mkdir("grids", {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
  await mkdir("logos", {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });
  await mkdir("icons", {
    baseDir: BaseDirectory.AppData,
    recursive: true,
  });

  updateData();
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("data.json", { baseDir: BaseDirectory.AppData })) {
    const getLibraryData = await readTextFile("data.json", {
      baseDir: BaseDirectory.AppData,
    });

    console.log(JSON.parse(getLibraryData));

    // WARN potential footgun here cause you're not checking if games are empty
    if (getLibraryData !== "" && JSON.parse(getLibraryData).folders !== "") {
      setLibraryData(JSON.parse(getLibraryData));

      const correctOrderOfFolders = [];
      const folders = libraryData.folders;
      for (let x = 0; x < Object.keys(folders).length; x++) {
        for (const key in folders) {
          if (folders[key].index === x) {
            correctOrderOfFolders.push(key);
          }
        }
      }

      // i actually have no idea but this somehow fixes all issues with drag and drop ¯\_(ツ)_/¯
      setCurrentFolders("");
      setCurrentGames("");

      setCurrentFolders(correctOrderOfFolders);

      setCurrentGames(Object.keys(libraryData.games));

      // checks current theme and adds it to the document classlist for tailwind
      if (libraryData.userSettings.currentTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      console.log("data fetched");
    } else setupFoldersForImages();
  } else {
    setupFoldersForImages();
  }
}

export function openGame(gameLocation) {
  if (gameLocation === undefined) {
    triggerToast(translateText("no game file provided!"));
    return;
  }

  invoke("open_location", {
    location: gameLocation,
  });

  if (libraryData.userSettings.quitAfterOpen === true || libraryData.userSettings.quitAfterOpen === undefined) {
    setTimeout(() => {
      invoke("close_app");
    }, 500);
  } else {
    triggerToast(translateText("game launched! enjoy your session!"));
  }
}

export function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export async function importSteamGames() {
  openDialog("loading");

  const connectedToInternet = await checkIfConnectedToInternet();

  if (!connectedToInternet) {
    closeDialog("loading");
    triggerToast(translateText("you're not connected to the internet :("));

    return;
  }

  const steamVDFData = await invoke("read_steam_vdf");

  if (steamVDFData === "error") {
    closeDialog("loading");
    triggerToast(translateText("sorry but there was an error \n reading your Steam library :("));

    return;
  }

  const steamData = parseVDF(steamVDFData);

  const steamGameIds = [];

  for (let x = 0; x < Object.keys(steamData.libraryfolders).length; x++) {
    steamGameIds.push(...Object.keys(steamData.libraryfolders[x].apps));
  }

  // exclude steam redistrutables from the game library
  const index = steamGameIds.indexOf("228980");
  index !== -1 ? steamGameIds.splice(index, 1) : null;

  setTotalSteamGames(steamGameIds.length);

  const allGameNames = [];

  setLibraryData((data) => {
    data.folders.steam = undefined;
    return data;
  });

  await updateData();

  for (const steamId of steamGameIds) {
    let gameData = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?steamID=${steamId}`);

    gameData = await gameData.json();

    console.log(gameData);

    if (!gameData.success) {
      setTotalImportedSteamGames((x) => x + 1);
      continue;
    }

    const gameSGDBID = gameData.data.id;
    const name = gameData.data.name;
    allGameNames.push(name);

    let gridImageFileName = `${generateRandomString()}.png`;
    let heroImageFileName = `${generateRandomString()}.png`;
    let logoImageFileName = `${generateRandomString()}.png`;
    let iconImageFileName = `${generateRandomString()}.png`;

    let assetsData = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?assets=${gameSGDBID}&length=1`);

    assetsData = await assetsData.json();

    if (assetsData.grids.length !== 0) {
      await invoke("download_image", {
        link: assetsData.grids[0],
        location: locationJoin([appDataDirPath(), "grids", gridImageFileName]),
      });
    } else {
      gridImageFileName = undefined;
    }

    if (assetsData.heroes.length !== 0) {
      await invoke("download_image", {
        link: assetsData.heroes[0],
        location: locationJoin([appDataDirPath(), "heroes", heroImageFileName]),
      });
    } else {
      heroImageFileName = undefined;
    }

    if (assetsData.logos.length !== 0) {
      await invoke("download_image", {
        link: assetsData.logos[0],
        location: locationJoin([appDataDirPath(), "logos", logoImageFileName]),
      });
    } else {
      logoImageFileName = undefined;
    }

    if (assetsData.icons.length !== 0) {
      await invoke("download_image", {
        link: assetsData.icons[0],
        location: locationJoin([appDataDirPath(), "icons", iconImageFileName]),
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
        favourite: false,
      };
      return data;
    });

    setTotalImportedSteamGames((x) => x + 1);
  }

  setLibraryData(
    produce((data) => {
      data.folders.steam = {
        name: "steam",
        hide: false,
        games: allGameNames,
        index: currentFolders().length,
      };
      return data;
    }),
  );

  setTimeout(async () => {
    await updateData().then(() => {
      closeDialog("loading");
      closeDialog("settings");
      setTotalImportedSteamGames(0);
      setTotalSteamGames(0);
    });
  }, 1000);
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
  await writeTextFile("data.json", JSON.stringify(libraryData, null, 4), {
    baseDir: BaseDirectory.AppData,
  }).then(getData());
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
    case "newGame":
      setShowNewGameModal(true);
      break;

    case "editGame":
      setShowEditGameModal(true);
      break;

    case "newFolder":
      setShowNewFolderModal(true);
      break;

    case "editFolder":
      setShowEditFolderModal(true);
      break;

    case "gamePopUp":
      setShowGamePopUpModal(true);
      break;

    case "notepad":
      setShowNotepadModal(true);
      break;

    case "settings":
      setShowSettingsModal(true);
      break;

    case "loading":
      setShowLoadingModal(true);
      break;
  }

  const dialogRef = document.querySelector(`[data-modal="${dialogData}"]`);

  dialogRef.classList.remove("hideDialog");
  dialogRef.showModal();
  dialogRef.classList.add("showDialog");

  document.activeElement.focus();
  document.activeElement.blur();
}

export function closeDialog(dialogData, ref) {
  function updateModalShowState() {
    switch (dialogData) {
      case "newGame":
        setShowNewGameModal(false);
        break;

      case "editGame":
        setShowEditGameModal(false);
        break;

      case "newFolder":
        setShowNewFolderModal(false);
        break;

      case "editFolder":
        setShowEditFolderModal(false);
        break;

      case "gamePopUp":
        setShowGamePopUpModal(false);
        break;

      case "notepad":
        setShowNotepadModal(false);
        break;

      case "settings":
        setShowSettingsModal(false);
        break;

      case "loading":
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
    const dialogRef = document.querySelector(`[data-modal="${dialogData}"]`);

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
  let connectedToInternet = await invoke("check_connection");

  connectedToInternet = connectedToInternet === "true";

  if (!connectedToInternet) {
    triggerToast("not connected to the internet :(");
  }

  return connectedToInternet;
}

export function locationJoin(locationsList) {
  if (systemPlatform() === "windows") {
    return locationsList.join("\\");
  }

  return locationsList.join("/");
}

export function getExecutableFileName(location) {
  // splits both / and \ paths since a library created on windows can be
  // viewed on macos and vice versa
  return location.toString().split("\\").slice(-1).toString().split("/").slice(-1);
}

export function getExecutableParentFolder(location) {
  if (systemPlatform() === "windows") {
    return location.toString().split("\\").slice(0, -1).join("\\");
  }

  return location.toString().split("/").slice(0, -1).join("/");
}
