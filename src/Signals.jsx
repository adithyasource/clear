import { createSignal } from "solid-js";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

// !? Misc / Globals
export const [permissionGranted, setPermissionGranted] = createSignal(
  isPermissionGranted(),
);
export const [appDataDirPath, setAppDataDirPath] = createSignal({});
export const [libraryData, setLibraryData] = createSignal({});
export const [notepadValue, setNotepadValue] = createSignal("");

// !? References
export const [selectedGame, setSelectedGame] = createSignal({});
export const [selectedFolder, setSelectedFolder] = createSignal([]);
export const [currentGames, setCurrentGames] = createSignal([]);
export const [currentFolders, setCurrentFolders] = createSignal([]);
export const [searchValue, setSearchValue] = createSignal();
export const [notificationGameName, setNotificaitonGameName] = createSignal();
export const [foundGridImage, setFoundGridImage] = createSignal();
export const [foundHeroImage, setFoundHeroImage] = createSignal();
export const [foundLogoImage, setFoundLogoImage] = createSignal();

// !? Styles Signals
export const [secondaryColor, setSecondaryColor] = createSignal("#1c1c1c");
export const [secondaryColorForBlur, setSecondaryColorForBlur] =
  createSignal("#272727cc");
export const [primaryColor, setPrimaryColor] = createSignal("#121212");
export const [modalBackground, setModalBackground] = createSignal("#12121266");
export const [locatingLogoBackground, setLocatingLogoBackground] =
  createSignal("#272727");
export const [gamesDivLeftPadding, setGamesDivLeftPadding] =
  createSignal("10px");
export const [showSideBar, setShowSideBar] = createSignal(true);
export const [roundedBorders, setRoundedBorders] = createSignal(true);
export const [gameTitle, setGameTitle] = createSignal(true);
export const [folderTitle, setFolderTitle] = createSignal(true);
export const [quitAfterOpen, setQuitAfterOpen] = createSignal(true);

// !? Create Signals
export const [gameName, setGameName] = createSignal();
export const [favouriteGame, setFavouriteGame] = createSignal(false);
export const [locatedHeroImage, setLocatedHeroImage] = createSignal();
export const [locatedGridImage, setLocatedGridImage] = createSignal();
export const [locatedLogo, setLocatedLogo] = createSignal();
export const [locatedGame, setlocatedGame] = createSignal();
export const [folderName, setFolderName] = createSignal();
export const [hideFolder, setHideFolder] = createSignal(false);

// !? Update Signals

export const [editedGameName, setEditedGameName] = createSignal();
export const [editedFavouriteGame, setEditedFavouriteGame] = createSignal();
export const [editedLocatedHeroImage, setEditedLocatedHeroImage] =
  createSignal();
export const [editedLocatedGridImage, setEditedLocatedGridImage] =
  createSignal();
export const [editedLocatedLogo, setEditedLocatedLogo] = createSignal();
export const [editedLocatedGame, setEditedlocatedGame] = createSignal();

export const [editedFolderName, setEditedFolderName] = createSignal("");
export const [editedHideFolder, setEditedHideFolder] = createSignal(false);
