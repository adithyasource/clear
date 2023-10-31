import { For, Show, createSignal, onMount } from "solid-js";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  writeTextFile,
  BaseDirectory,
  readTextFile,
  copyFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";

import Fuse from "fuse.js";

import { exit } from "@tauri-apps/api/process";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

import { appDataDir } from "@tauri-apps/api/path";

import { open } from "@tauri-apps/api/dialog";

import { Styles } from "../Styles";

import {
  permissionGranted,
  setPermissionGranted,
  appDataDirPath,
  setAppDataDirPath,
  libraryData,
  setLibraryData,
  selectedGame,
  setSelectedGame,
  selectedFolder,
  setSelectedFolder,
  currentGames,
  setCurrentGames,
  currentFolders,
  setCurrentFolders,
  searchValue,
  setSearchValue,
  notificationGameName,
  setNotificaitonGameName,
  secondaryColor,
  setSecondaryColor,
  secondaryColorForBlur,
  setSecondaryColorForBlur,
  primaryColor,
  setPrimaryColor,
  modalBackground,
  setModalBackground,
  locatingLogoBackground,
  setLocatingLogoBackground,
  gamesDivLeftPadding,
  setGamesDivLeftPadding,
  showSideBar,
  setShowSideBar,
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
  locatedGame,
  setlocatedGame,
  folderName,
  setFolderName,
  hideFolder,
  setHideFolder,
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
  editedLocatedGame,
  setEditedlocatedGame,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
  roundedBorders,
  setRoundedBorders,
  gameTitle,
  setGameTitle,
  folderTitle,
  setFolderTitle,
} from "../Signals";

import { getData, getSettingsData } from "../App";

export function Settings() {
  setTimeout(() => {
    getSettingsData();
  }, 50);

  return (
    <>
      <dialog data-settingsModal onClose={() => {}} className="outline-none">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div className="modalWindow w-[50%]  rounded-[6px] p-6">
            <div className="flex justify-between">
              <div>
                <h1>settings</h1>
              </div>

              <button
                className="flex items-center functionalInteractables"
                onClick={() => {
                  document.querySelector("[data-settingsModal]").close();
                  getData();
                }}>
                ​
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L11 10.3369M1 10.3369L11 1"
                    stroke="#FF3636"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 mt-10">
              <div
                onClick={async () => {
                  setRoundedBorders((x) => !x);

                  libraryData().userSettings.roundedBorders = roundedBorders();

                  await writeTextFile(
                    {
                      path: "data/lib.json",
                      contents: JSON.stringify(libraryData(), null, 1),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={roundedBorders()}>
                  <div className="relative">
                    <div className="">rounded borders</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      rounded borders
                    </div>
                  </div>
                </Show>
                <Show when={!roundedBorders()}>
                  <div className="">rounded borders</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setGameTitle((x) => !x);

                  libraryData().userSettings.gameTitle = gameTitle();

                  await writeTextFile(
                    {
                      path: "data/lib.json",
                      contents: JSON.stringify(libraryData(), null, 1),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={gameTitle()}>
                  <div className="relative">
                    <div className="">game title</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      game title
                    </div>
                  </div>
                </Show>
                <Show when={!gameTitle()}>
                  <div className="">game title</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setFolderTitle((x) => !x);

                  libraryData().userSettings.folderTitle = folderTitle();

                  await writeTextFile(
                    {
                      path: "data/lib.json",
                      contents: JSON.stringify(libraryData(), null, 1),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={folderTitle()}>
                  <div className="relative">
                    <div className="">folder title</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      folder title
                    </div>
                  </div>
                </Show>
                <Show when={!folderTitle()}>
                  <div className="">folder title</div>
                </Show>
              </div>
            </div>

            <div className="flex gap-5 mt-10">
              <button
                className="flex items-center functionalInteractables"
                onClick={() => {}}>
                export library
              </button>
              <button
                className="flex items-center functionalInteractables"
                onClick={() => {}}>
                import library
              </button>
            </div>

            <div className="grid grid-cols-3 mt-10 gap-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + n
                </div>
                new game
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + m
                </div>
                new folder
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + w
                </div>
                close app
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + .
                </div>
                open settings
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + l
                </div>
                open notepad
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  escape
                </div>
                close dialogs
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + f
                </div>
                search bar
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + \
                </div>
                hide sidebar
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + click
                </div>
                quick open game
              </div>
            </div>

            <div className="flex justify-between mt-10 ">
              <div>
                clear <span className="text-[#ffffff80]">v1.0.0</span>
              </div>
              <a href="https://clear.adithya.zip" className="underline">
                visit website
              </a>
              <div>
                made by{" "}
                <a href="https://adithya.zip" className="underline">
                  adithya
                </a>
              </div>
              <a href="https://ko-fi.com/adithyasource" className="underline">
                buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
