import { createContext, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { invoke } from "@tauri-apps/api/tauri";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { textLanguages } from "./Text";
import { parseVDF } from "./libraries/parseVDF";

export const GlobalContext = createContext();
export const UIContext = createContext();
export const SelectedDataContext = createContext();
export const ApplicationStateContext = createContext();
export const DataEntryContext = createContext();
export const DataUpdateContext = createContext();
export const SteamDataContext = createContext();

// ? Global Store
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
    zoomLevel: 1,
  },
});

// ? UI
const [showToast, setShowToast] = createSignal(false);
const [showContentSkipButton, setShowContentSkipButton] = createSignal(false);
const [showSettingsLanguageSelector, setShowSettingsLanguageSelector] =
  createSignal(false);
const [showLanguageSelector, setShowLanguageSelector] = createSignal(false);
const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] =
  createSignal(false);
const [showNewVersionAvailable, setShowNewVersionAvailable] =
  createSignal(false);

// ? Selected Data Signals
const [selectedGame, setSelectedGame] = createSignal({});
const [selectedFolder, setSelectedFolder] = createSignal([]);
const [selectedGameId, setSelectedGameId] = createSignal();

// ? Application State Signals
const [currentGames, setCurrentGames] = createSignal([]);
const [currentFolders, setCurrentFolders] = createSignal([]);
const [searchValue, setSearchValue] = createSignal();
const [toastMessage, setToastMessage] = createSignal("");
const [appVersion, setAppVersion] = createSignal("1.1.0");
const [latestVersion, setLatestVersion] = createSignal("");
const [appDataDirPath, setAppDataDirPath] = createSignal({});
const [windowWidth, setWindowWidth] = createSignal(window.innerWidth);
const [SGDBGames, setSGDBGames] = createSignal();

// ? Add Data Signals
const [gameName, setGameName] = createSignal("");
const [favouriteGame, setFavouriteGame] = createSignal(false);
const [locatedHeroImage, setLocatedHeroImage] = createSignal();
const [locatedGridImage, setLocatedGridImage] = createSignal();
const [locatedLogo, setLocatedLogo] = createSignal();
const [locatedIcon, setLocatedIcon] = createSignal();
const [locatedGame, setlocatedGame] = createSignal();
const [folderName, setFolderName] = createSignal();
const [hideFolder, setHideFolder] = createSignal(false);
const [foundGridImage, setFoundGridImage] = createSignal(false);
const [foundHeroImage, setFoundHeroImage] = createSignal(false);
const [foundLogoImage, setFoundLogoImage] = createSignal(false);
const [foundIconImage, setFoundIconImage] = createSignal(false);
const [foundGridImageIndex, setFoundGridImageIndex] = createSignal(0);
const [foundHeroImageIndex, setFoundHeroImageIndex] = createSignal(0);
const [foundLogoImageIndex, setFoundLogoImageIndex] = createSignal(0);
const [foundIconImageIndex, setFoundIconImageIndex] = createSignal(0);
const [notepadValue, setNotepadValue] = createSignal("");

// ? Update Data Signals
const [editedGameName, setEditedGameName] = createSignal();
const [editedFavouriteGame, setEditedFavouriteGame] = createSignal();
const [editedLocatedHeroImage, setEditedLocatedHeroImage] = createSignal();
const [editedLocatedGridImage, setEditedLocatedGridImage] = createSignal();
const [editedLocatedLogo, setEditedLocatedLogo] = createSignal();
const [editedLocatedIcon, setEditedLocatedIcon] = createSignal();
const [editedLocatedGame, setEditedlocatedGame] = createSignal();
const [editedFolderName, setEditedFolderName] = createSignal();
const [editedHideFolder, setEditedHideFolder] = createSignal();

// ? Steam Data Signals
const [totalSteamGames, setTotalSteamGames] = createSignal(0);
const [totalImportedSteamGames, setTotalImportedSteamGames] = createSignal(0);

// ? Exporting Context Providers

export function GlobalContextProvider(props) {
  const context = {
    libraryData,
    setLibraryData,
  };

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export function UIContextProvider(props) {
  const context = {
    showToast,
    setShowToast,
    showContentSkipButton,
    setShowContentSkipButton,
    showSettingsLanguageSelector,
    setShowSettingsLanguageSelector,
    showLanguageSelector,
    setShowLanguageSelector,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showImportAndOverwriteConfirm,
    setShowImportAndOverwriteConfirm,
    showNewVersionAvailable,
    setShowNewVersionAvailable,
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
    setSelectedGameId,
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
    setWindowWidth,
    SGDBGames,
    setSGDBGames,
  };

  return (
    <ApplicationStateContext.Provider value={context}>
      {props.children}
    </ApplicationStateContext.Provider>
  );
}

export function DataEntryContextProvider(props) {
  const context = {
    gameName,
    setGameName,
    favouriteGame,
    setFavouriteGame,
    locatedHeroImage,
    setLocatedHeroImage,
    locatedGridImage,
    setLocatedGridImage,
    locatedLogo,
    setLocatedLogo,
    locatedIcon,
    setLocatedIcon,
    locatedGame,
    setlocatedGame,
    folderName,
    setFolderName,
    hideFolder,
    setHideFolder,
    foundGridImage,
    setFoundGridImage,
    foundHeroImage,
    setFoundHeroImage,
    foundLogoImage,
    setFoundLogoImage,
    foundIconImage,
    setFoundIconImage,
    foundGridImageIndex,
    setFoundGridImageIndex,
    foundHeroImageIndex,
    setFoundHeroImageIndex,
    foundLogoImageIndex,
    setFoundLogoImageIndex,
    foundIconImageIndex,
    setFoundIconImageIndex,
    notepadValue,
    setNotepadValue,
  };

  return (
    <DataEntryContext.Provider value={context}>
      {props.children}
    </DataEntryContext.Provider>
  );
}

export function DataUpdateContextProvider(props) {
  const context = {
    editedGameName,
    setEditedGameName,
    editedFavouriteGame,
    setEditedFavouriteGame,
    editedLocatedHeroImage,
    setEditedLocatedHeroImage,
    editedLocatedGridImage,
    setEditedLocatedGridImage,
    editedLocatedLogo,
    setEditedLocatedLogo,
    editedLocatedIcon,
    setEditedLocatedIcon,
    editedLocatedGame,
    setEditedlocatedGame,
    editedFolderName,
    setEditedFolderName,
    editedHideFolder,
    setEditedHideFolder,
  };

  return (
    <DataUpdateContext.Provider value={context}>
      {props.children}
    </DataUpdateContext.Provider>
  );
}

export function SteamDataContextProvider(props) {
  const context = {
    totalSteamGames,
    setTotalSteamGames,
    totalImportedSteamGames,
    setTotalImportedSteamGames,
  };

  return (
    <SteamDataContext.Provider value={context}>
      {props.children}
    </SteamDataContext.Provider>
  );
}

// ? Global Functions

export async function createEmptyLibrary() {
  await createDir("heroes", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("grids", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("logos", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("icons", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });

  updateData();

  getData();
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("data.json", { dir: BaseDirectory.AppData })) {
    let getLibraryData = await readTextFile("data.json", {
      dir: BaseDirectory.AppData,
    });

    // ! potential footgun here cause you're not checking if games are empty
    if (getLibraryData != "" && JSON.parse(getLibraryData).folders != "") {
      setCurrentGames("");
      setCurrentFolders("");

      setLibraryData(JSON.parse(getLibraryData));

      for (let x = 0; x < Object.keys(libraryData["folders"]).length; x++) {
        for (let y = 0; y < Object.keys(libraryData["folders"]).length; y++) {
          if (Object.values(libraryData["folders"])[y].index == x) {
            setCurrentFolders((z) => [
              ...z,
              Object.keys(libraryData["folders"])[y],
            ]);
          }
        }
      }

      setCurrentGames(Object.keys(libraryData["games"]));

      console.log("data fetched");

      // ? Checks currentTheme and adds it to the document classList for Tailwind

      if (libraryData.userSettings.currentTheme == "light") {
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
  if (gameLocation == undefined) {
    triggerToast(translateText("no game file provided!"));
    return;
  }

  invoke("open_location", {
    location: gameLocation,
  });

  if (
    libraryData.userSettings.quitAfterOpen == true ||
    libraryData.userSettings.quitAfterOpen == undefined
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

export async function changeLanguage(lang) {
  setLibraryData("userSettings", "language", lang);

  await updateData();

  getData();

  setShowLanguageSelector(false);
  setShowSettingsLanguageSelector(false);
}

export async function importSteamGames() {
  openDialog("loadingModal");

  await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?version=a`)
    .then(() => {
      invoke("read_steam_vdf").then(async (data) => {
        if (data == "error") {
          closeDialog("loadingModal");

          triggerToast(
            translateText(
              "sorry but there was an error \n reading your Steam library :(",
            ),
          );

          return;
        }

        let steamData = parseVDF(data);

        let steamGameIds = [];

        for (let x = 0; x < Object.keys(steamData.libraryfolders).length; x++) {
          steamGameIds.push(...Object.keys(steamData.libraryfolders[x].apps));
        }

        const index = steamGameIds.indexOf("228980");

        index != -1 ? steamGameIds.splice(index, 1) : null;

        setTotalSteamGames(steamGameIds.length);

        let allGameNames = [];

        setLibraryData((data) => {
          delete data.folders["steam"];
          return data;
        });

        await updateData().then(async () => {
          getData();

          for (const steamId of steamGameIds) {
            await fetch(
              `${import.meta.env.VITE_CLEAR_API_URL}/?steamID=${steamId}`,
            ).then((res) =>
              res.json().then(async (jsonres) => {
                let gameId = jsonres.data.id;
                let name = jsonres.data.name;

                allGameNames.push(name);

                let gridImageFileName = generateRandomString() + ".png";
                let heroImageFileName = generateRandomString() + ".png";
                let logoImageFileName = generateRandomString() + ".png";
                let iconImageFileName = generateRandomString() + ".png";

                await fetch(
                  `${
                    import.meta.env.VITE_CLEAR_API_URL
                  }/?assets=${gameId}&length=1`,
                )
                  .then((res) =>
                    res.json().then(async (jsonres) => {
                      jsonres.grids.length != 0
                        ? await invoke("download_image", {
                            link: jsonres.grids[0],
                            location:
                              appDataDirPath() + "grids\\" + gridImageFileName,
                          })
                        : (gridImageFileName = undefined);
                      jsonres.heroes.length != 0
                        ? await invoke("download_image", {
                            link: jsonres.heroes[0],
                            location:
                              appDataDirPath() + "heroes\\" + heroImageFileName,
                          })
                        : (heroImageFileName = undefined);
                      jsonres.logos.length != 0
                        ? await invoke("download_image", {
                            link: jsonres.logos[0],
                            location:
                              appDataDirPath() + "logos\\" + logoImageFileName,
                          })
                        : (logoImageFileName = undefined);
                      jsonres.icons.length != 0
                        ? await invoke("download_image", {
                            link: jsonres.icons[0],
                            location:
                              appDataDirPath() + "icons\\" + iconImageFileName,
                          })
                        : (iconImageFileName = undefined);

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

                      await updateData();

                      setTotalImportedSteamGames((x) => x + 1);
                    }),
                  )
                  .catch((err) => {
                    // no assets found at all for this game
                  });
              }),
            );
          }

          setLibraryData(
            produce((data) => {
              data.folders["steam"] = {
                name: "steam",
                hide: false,
                games: allGameNames,
                index: currentFolders().length,
              };
              return data;
            }),
          );

          await updateData().then(() => {
            closeDialog("loadingModal");
            closeDialog("settingsModal");
            setTotalImportedSteamGames(0);
            setTotalSteamGames(0);
            getData();
          });
        });
      });
    })
    .catch((err) => {
      closeDialog("loadingModal");
      triggerToast(translateText("you're not connected to the internet :("));
    });
}

export function translateText(text) {
  if (!textLanguages.hasOwnProperty(text)) {
    console.trace(`missing text translation '${text}'`);

    return undefined;
  }

  return libraryData.userSettings.language == undefined ||
    libraryData.userSettings.language == "en"
    ? text
    : textLanguages[text][libraryData.userSettings.language];
}

export async function updateData() {
  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(libraryData, null, 4),
    },
    {
      dir: BaseDirectory.AppData,
    },
  ).then(getData());
}

let toastTimeout = setTimeout(() => {}, 0);

export function triggerToast(message) {
  setShowToast(false);
  setShowToast(true);
  setToastMessage(message);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    setShowToast(false);
  }, 2500);
}

export function closeToast() {
  setShowToast(false);
  setToastMessage(undefined);
  clearTimeout(toastTimeout);
}

export function openDialog(dialogData) {
  let dialogRef = document.querySelector(`[data-${dialogData}]`);

  dialogRef.classList.remove("hideDialog");
  dialogRef.show();
  dialogRef.classList.add("showDialog");
}

export function closeDialog(dialogData, ref) {
  if (ref != undefined) {
    ref.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        e.stopPropagation();

        ref.classList.remove("showDialog");
        ref.classList.add("hideDialog");
        setTimeout(() => {
          ref.close();
        }, 200);
      }
    });
  } else {
    let dialogRef = document.querySelector(`[data-${dialogData}]`);

    dialogRef.classList.remove("showDialog");
    dialogRef.classList.add("hideDialog");
    setTimeout(() => {
      dialogRef.close();
    }, 200);
  }
}

export async function toggleSideBar() {
  setSearchValue("");

  setLibraryData("userSettings", "showSideBar", (x) => !x);

  await updateData();
  getData();
}
