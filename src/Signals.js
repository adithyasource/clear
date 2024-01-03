import { createSignal } from "solid-js";

// !? Misc / Globals

export const [appVersion, setAppVersion] = createSignal("0.19.2");
export const [latestVersion, setLatestVersion] = createSignal("");
export const [newVersionAvailable, setNewVersionAvailable] =
  createSignal(false);

export const [appDataDirPath, setAppDataDirPath] = createSignal({});
export const [libraryData, setLibraryData] = createSignal({});
export const [notepadValue, setNotepadValue] = createSignal("");
export const [toastError, setToastMessage] = createSignal("");
export const [showToast, setShowToast] = createSignal(false);
export const [windowWidth, setWindowWidth] = createSignal(window.innerWidth);
export const [zoomLevel, setZoomLevel] = createSignal();

// !? References
export const [selectedGame, setSelectedGame] = createSignal({});
export const [selectedFolder, setSelectedFolder] = createSignal([]);
export const [currentGames, setCurrentGames] = createSignal([]);
export const [currentFolders, setCurrentFolders] = createSignal([]);
export const [searchValue, setSearchValue] = createSignal();
export const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
export const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] =
  createSignal(false);
export const [steamFolderExists, setSteamFolderExists] = createSignal(false);
export const [language, setLanguage] = createSignal("en");
export const [showSettingsLanguageSelector, setShowSettingsLanguageSelector] =
  createSignal(false);
export const [showLanguageSelector, setShowLanguageSelector] =
  createSignal(false);

export const [totalSteamGames, setTotalSteamGames] = createSignal(0);
export const [totalImportedSteamGames, setTotalImportedSteamGames] =
  createSignal(0);

// !? Styles Signals
export const [currentTheme, setCurrentTheme] = createSignal("");

// !? Settings Signals
export const [showSideBar, setShowSideBar] = createSignal(true);
export const [roundedBorders, setRoundedBorders] = createSignal(true);
export const [gameTitle, setGameTitle] = createSignal(true);
export const [folderTitle, setFolderTitle] = createSignal(true);
export const [quitAfterOpen, setQuitAfterOpen] = createSignal(true);
export const [fontName, setFontName] = createSignal("Sans serif");

// !? Create Signals
export const [gameName, setGameName] = createSignal("");
export const [favouriteGame, setFavouriteGame] = createSignal(false);
export const [locatedHeroImage, setLocatedHeroImage] = createSignal();
export const [locatedGridImage, setLocatedGridImage] = createSignal();
export const [locatedLogo, setLocatedLogo] = createSignal();
export const [locatedIcon, setLocatedIcon] = createSignal();
export const [locatedGame, setlocatedGame] = createSignal();
export const [folderName, setFolderName] = createSignal();
export const [hideFolder, setHideFolder] = createSignal(false);
export const [foundGridImage, setFoundGridImage] = createSignal(false);
export const [foundHeroImage, setFoundHeroImage] = createSignal(false);
export const [foundLogoImage, setFoundLogoImage] = createSignal(false);
export const [foundIconImage, setFoundIconImage] = createSignal(false);
export const [SGDBGames, setSGDBGames] = createSignal();
export const [selectedGameId, setSelectedGameId] = createSignal();

export const [foundGridImageIndex, setFoundGridImageIndex] = createSignal(0);
export const [foundHeroImageIndex, setFoundHeroImageIndex] = createSignal(0);
export const [foundLogoImageIndex, setFoundLogoImageIndex] = createSignal(0);
export const [foundIconImageIndex, setFoundIconImageIndex] = createSignal(0);

// !? Update Signals
export const [editedGameName, setEditedGameName] = createSignal();
export const [editedFavouriteGame, setEditedFavouriteGame] = createSignal();
export const [editedLocatedHeroImage, setEditedLocatedHeroImage] =
  createSignal();
export const [editedLocatedGridImage, setEditedLocatedGridImage] =
  createSignal();
export const [editedLocatedLogo, setEditedLocatedLogo] = createSignal();
export const [editedLocatedIcon, setEditedLocatedIcon] = createSignal();
export const [editedLocatedGame, setEditedlocatedGame] = createSignal();
export const [editedFolderName, setEditedFolderName] = createSignal();
export const [editedHideFolder, setEditedHideFolder] = createSignal();
