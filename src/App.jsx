import { For, Show, onMount } from "solid-js";

import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { appWindow } from "@tauri-apps/api/window";

import {
  appDataDirPath,
  currentFolders,
  currentTheme,
  folderTitle,
  fontName,
  gameTitle,
  libraryData,
  quitAfterOpen,
  roundedBorders,
  searchValue,
  setAppDataDirPath,
  setCurrentFolders,
  setCurrentGames,
  setCurrentTheme,
  setFolderTitle,
  setFontName,
  setGameTitle,
  setGamesDivLeftPadding,
  setLibraryData,
  setQuitAfterOpen,
  setRoundedBorders,
  setSearchValue,
  setSelectedGame,
  setShowSideBar,
  setWindowWidth,
  showSideBar,
  windowWidth,
  setToastMessage,
  setShowToast,
} from "./Signals";

import { SideBar } from "./SideBar";

import { EditFolder } from "./modals/EditFolder";
import { EditGame } from "./modals/EditGame";
import { GamePopUp } from "./modals/GamePopUp";
import { NewFolder } from "./modals/NewFolder";
import { NewGame } from "./modals/NewGame";
import { Notepad } from "./modals/Notepad";
import { Settings } from "./modals/Settings";

import { Toast } from "./components/Toast";

import "./App.css";

import Fuse from "fuse.js";

export function getSettingsData() {
  if (
    libraryData().userSettings.roundedBorders == undefined ||
    libraryData().userSettings.roundedBorders == true
  ) {
    setRoundedBorders(true);
  } else {
    setRoundedBorders(false);
  }
  if (
    libraryData().userSettings.gameTitle == undefined ||
    libraryData().userSettings.gameTitle == true
  ) {
    setGameTitle(true);
  } else {
    setGameTitle(false);
  }
  if (
    libraryData().userSettings.folderTitle == undefined ||
    libraryData().userSettings.folderTitle == true
  ) {
    setFolderTitle(true);
  } else {
    setFolderTitle(false);
  }
  if (
    libraryData().userSettings.quitAfterOpen == undefined ||
    libraryData().userSettings.quitAfterOpen == true
  ) {
    setQuitAfterOpen(true);
  } else {
    setQuitAfterOpen(false);
  }

  if (
    libraryData().userSettings.theme == undefined ||
    libraryData().userSettings.theme == "dark"
  ) {
    setCurrentTheme("dark");
  } else {
    setCurrentTheme("light");
  }

  setFontName(libraryData().userSettings.fontName || "Sans Serif");

  document.documentElement.classList.add("dark");

  if (currentTheme() == "light") {
    document.documentElement.classList.remove("dark");
    setGamesDivLeftPadding("10px");
  } else {
    document.documentElement.classList.add("dark");
    setGamesDivLeftPadding("10px");
  }

  try {
    setGamesDivLeftPadding("23%");
    setShowSideBar(libraryData().userSettings.showSideBar || true);
  } catch (error) {
    setGamesDivLeftPadding("30px");
    setShowSideBar(false);
  }

  libraryData().userSettings.showSideBar == undefined
    ? setShowSideBar(true)
    : setShowSideBar(libraryData().userSettings.showSideBar);
}

async function createEmptyLibrary() {
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

  let emptyLibrary = {
    games: {},
    folders: {},
    notepad: "",
    userSettings: {},
  };
  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(emptyLibrary, null, 4),
    },
    {
      dir: BaseDirectory.AppData,
    },
  );

  getData();
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("data.json", { dir: BaseDirectory.AppData })) {
    let getLibraryData = await readTextFile("data.json", {
      dir: BaseDirectory.AppData,
    });

    if (getLibraryData != "" && JSON.parse(getLibraryData).folders != "") {
      setCurrentGames("");
      setCurrentFolders("");

      setLibraryData(JSON.parse(getLibraryData));

      for (let x = 0; x < Object.keys(libraryData()["folders"]).length; x++) {
        for (let y = 0; y < Object.keys(libraryData()["folders"]).length; y++) {
          if (Object.values(libraryData()["folders"])[y].index == x) {
            setCurrentFolders((z) => [
              ...z,
              Object.keys(libraryData()["folders"])[y],
            ]);
          }
        }
      }

      setCurrentGames(Object.keys(libraryData()["games"]));

      console.log("data fetched");

      getSettingsData();

      document.querySelector("[data-newGameModal]").close();
      document.querySelector("[data-newFolderModal]").close();
      document.querySelector("[data-gamePopup]").close();
      document.querySelector("[data-editGameModal]").close();
      document.querySelector("[data-editFolderModal]").close();
    } else createEmptyLibrary();
  } else {
    createEmptyLibrary();
  }
}

export async function openGame(gameLocation) {
  invoke("open_explorer", {
    location: gameLocation,
  });

  if (quitAfterOpen() == true || quitAfterOpen() == undefined) {
    setTimeout(async () => {
      appWindow.close();
    }, 500);
  } else {
    setShowToast(true);
    setToastMessage("game launched! enjoy your session!");
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
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

function App() {
  document.addEventListener("keydown", (e) => {
    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].style.cursor = "pointer";
    }

    if (e.ctrlKey) {
      for (
        let i = 0;
        i < document.querySelectorAll(".sideBarGame").length;
        i++
      ) {
        document
          .querySelectorAll(".sideBarGame")
          [i].classList.add("hint--right");
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document.querySelectorAll(".gameCard")[i].classList.add("hint--center");
      }
    }

    if (e.ctrlKey && e.code == "KeyF") {
      e.preventDefault();
      document.querySelector("#searchInput").focus();
    }

    if (e.ctrlKey && e.code == "KeyW") {
      e.preventDefault();
      closeApp();
    }

    if (e.ctrlKey && e.code == "KeyN") {
      e.preventDefault();
      if (document.querySelector("[data-newGameModal]").open) {
        document.querySelector("[data-newGameModal]").close();
      } else {
        document.querySelector("[data-newGameModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "KeyM") {
      e.preventDefault();
      if (document.querySelector("[data-newFolderModal]").open) {
        document.querySelector("[data-newFolderModal]").close();
      } else {
        document.querySelector("[data-newFolderModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "KeyL") {
      e.preventDefault();
      if (document.querySelector("[data-notepadModal]").open) {
        document.querySelector("[data-notepadModal]").close();
      } else {
        document.querySelector("[data-notepadModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "Period") {
      e.preventDefault();
      if (document.querySelector("[data-settingsModal]").open) {
        document.querySelector("[data-settingsModal]").close();
      } else {
        document.querySelector("[data-settingsModal]").show();
      }
    }

    if (e.code == "Escape") {
      document.querySelector("[data-settingsModal]").close();
      document.querySelector("[data-newGameModal]").close();
      document.querySelector("[data-newFolderModal]").close();
      document.querySelector("[data-notepadModal]").close();
      document.querySelector("[data-gamePopup]").close();
      document.querySelector("[data-editGameModal]").close();
      document.querySelector("[data-editFolderModal]").close();
      document.querySelector("#searchInput").blur();
    }

    if (e.ctrlKey && e.code == "Backslash") {
      e.preventDefault();
      toggleSideBar();
      document.querySelector("#searchInput").blur();
    }
  });

  async function closeApp() {
    appWindow.close();
  }

  async function toggleSideBar() {
    setSearchValue("");

    libraryData().userSettings.showSideBar == undefined
      ? (libraryData().userSettings.showSideBar = false)
      : (libraryData().userSettings.showSideBar =
          !libraryData().userSettings.showSideBar);

    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(getData());
  }

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  document.addEventListener("keyup", (e) => {
    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].style.cursor = "grab";
    }

    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].classList.remove(
        "hint--right",
        "hint--no-animate",

        "hint--no-arrow",
      );
    }

    for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
      document.querySelectorAll(".gameCard")[i].classList.remove(
        "hint--center",
        "hint--no-animate",

        "hint--no-arrow",
      );
    }
  });

  onMount(async () => {
    await getData();

    appWindow.onResized(() => {
      appWindow.isMaximized().then((x) => {
        setMaximizeIconToggle(x);
        console.log(x);
      });

      setWindowWidth(window.innerWidth);
    });
  });

  return (
    <>
      {
        // * fading out bg color to make the app loading look a
        // * bit more smoother
      }

      <div className="pointer-events-none items-center justify-center flex loading w-screen h-screen bg-[#121212] absolute z-[1000]">
        <p className=""></p>
      </div>

      {
        // Ignoring the following few lines for build since it doesnt get minified for some reason
        // While working on it remove the "prettier-ignore" comment
        // prettier-ignore 
      }

      <style jsx>{`
  button, input, .panelButton { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
  .sideBarFolder { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
  .titleBarText { font-family: ${fontName() == "Sans Serif" ? "Segoe UI" : fontName() == "Serif" ? "Times New Roman" : "IBM Plex Mono, Consolas"}; }
  * { font-family: ${fontName() == "Sans Serif" ? "Helvetica, Arial, sans-serif" : fontName() == "Serif" ? "Times New Roman" : "IBM Plex Mono, Consolas"}; color: ${currentTheme() == "light" ? "#000000" : "#ffffff"}; }
  ::-webkit-scrollbar-thumb { border-radius: ${roundedBorders() ? "10px" : "0px"}; }
  .gameInput { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
  .tooltip { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
  .currentlyDragging { box-shadow: 0 -3px 0 0 #646464; border-top-left-radius: 0; border-top-right-radius: 0; }
`}</style>

      {
        // prettier-ignore
      }

      <Toast />

      <div className={`h-full flex gap-[30px] overflow-y-hidden`}>
        <Show when={showSideBar() == false && windowWidth() >= 1000}>
          <svg
            className={`absolute right-[30px] top-[32px] z-10 rotate-180 cursor-pointer hover:bg-[#232323] duration-150 p-2 w-[25.25px] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }]`}
            onClick={toggleSideBar}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 11L1 6L6 1"
              stroke="white"
              stroke-opacity="0.5"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 11L6 6L11 1"
              stroke="white"
              stroke-opacity="0.5"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <Show when={showSideBar() && windowWidth() >= 1000}>
          <SideBar />
        </Show>

        <Show
          when={
            JSON.stringify(libraryData().folders) == "{}" &&
            (searchValue() == "" || searchValue() == undefined)
          }>
          <div
            className={`flex items-center justify-center flex-col  w-full absolute 
          h-[100vh]
           overflow-y-scroll py-[20px] pr-[30px]  ${
             showSideBar() && windowWidth() >= 1000
               ? "pl-[23%] large:pl-[17%]"
               : "pl-[30px] large:pl-[30px]"
           }`}>
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] ">
                hey there! thank you so much for using clear <br />
                <br />
                - add some new games using the sidebar buttons <br />
                <br />- create new folders and drag and drop your games into
                them <br />
                <br />- dont forget to check out the settings!
              </p>
              <div className="grid grid-cols-2 mt-[35px] gap-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + n
                  </div>
                  new game
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + .
                  </div>
                  open settings
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + m
                  </div>
                  new folder
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + l
                  </div>
                  open notepad
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + w
                  </div>
                  close app
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    escape
                  </div>
                  close dialogs
                </div>
              </div>

              <div className="grid mt-[35px] gap-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + f
                  </div>
                  search bar
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + \\
                  </div>
                  hide sidebar
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + click
                  </div>
                  quick open game
                </div>
              </div>
            </div>
          </div>
        </Show>
        <div
          className={`w-full absolute h-[100vh] overflow-y-scroll py-[20px] pr-[30px]  ${
            showSideBar() && windowWidth() >= 1000
              ? "pl-[23%] large:pl-[17%]"
              : "pl-[30px] large:pl-[30px]"
          }`}>
          <Show when={searchValue() == "" || searchValue() == undefined}>
            <For each={currentFolders()}>
              {(folderName) => {
                let folder = libraryData().folders[folderName];

                return (
                  <Show when={folder.games != "" && !folder.hide}>
                    <div className="mb-[40px]">
                      <Show when={folderTitle()}>
                        <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                          {folder.name}
                        </p>
                      </Show>
                      <div
                        className={`grid gap-5 mt-4 foldersDiv 
                          ${
                            showSideBar()
                              ? "medium:grid-cols-4 grid-cols-3 large:grid-cols-6"
                              : "medium:grid-cols-5 grid-cols-3 large:grid-cols-7"
                          }`}>
                        <For each={folder.games}>
                          {(gameName) => {
                            return (
                              <div
                                className="relative w-full bg-transparent cursor-pointer gameCard group"
                                aria-label="play"
                                onDragStart={(e) => {
                                  e.preventDefault();
                                }}
                                onClick={async (e) => {
                                  if (e.ctrlKey) {
                                    openGame(
                                      libraryData().games[gameName].location,
                                    );
                                    return;
                                  }
                                  await setSelectedGame(
                                    libraryData().games[gameName],
                                  );
                                  document
                                    .querySelector("[data-gamePopup]")
                                    .show();
                                }}>
                                <Show
                                  when={
                                    !libraryData().games[gameName].favourite
                                  }>
                                  <div className="relative w-full">
                                    <Show
                                      when={
                                        libraryData().games[gameName].gridImage
                                      }>
                                      <img
                                        className={`z-10 mb-[7px] rounded-[${
                                          roundedBorders() ? "6px" : "0px"
                                        }] group-hover:outline-[#0000001f] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                        src={convertFileSrc(
                                          appDataDirPath() +
                                            "grids\\" +
                                            libraryData().games[gameName]
                                              .gridImage,
                                        )}
                                        alt=""
                                      />{" "}
                                    </Show>
                                    <Show
                                      when={
                                        !libraryData().games[gameName].gridImage
                                      }>
                                      <div className="relative flex items-center justify-center">
                                        <Show when={!gameTitle()}>
                                          <span className="!max-w-[50%] absolute z-[100]">
                                            {gameName}
                                          </span>

                                          <Show
                                            when={
                                              !libraryData().games[gameName]
                                                .location
                                            }>
                                            <span class="absolute tooltip z-[100] bottom-[30px]">
                                              no game file
                                            </span>
                                          </Show>
                                        </Show>

                                        <div
                                          className={`z-10 mb-[7px] rounded-[${
                                            roundedBorders() ? "6px" : "0px"
                                          }] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] bg-[#F1F1F1]  w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                          alt=""
                                        />
                                      </div>
                                    </Show>
                                  </div>
                                </Show>
                                <Show
                                  when={
                                    libraryData().games[gameName].favourite
                                  }>
                                  <div className="relative w-full">
                                    <Show
                                      when={
                                        libraryData().games[gameName].gridImage
                                      }>
                                      <img
                                        className={`relative z-10 mb-[7px] rounded-[${
                                          roundedBorders() ? "6px" : "0px"
                                        }] outline-[#0000001c] hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                        src={convertFileSrc(
                                          appDataDirPath() +
                                            "grids\\" +
                                            libraryData().games[gameName]
                                              .gridImage,
                                        )}
                                        alt=""
                                        width="100%"
                                      />
                                    </Show>
                                    <Show
                                      when={
                                        !libraryData().games[gameName].gridImage
                                      }>
                                      <div className="relative flex items-center justify-center">
                                        <Show when={!gameTitle()}>
                                          <span className="absolute z-[100] !max-w-[50%]">
                                            {gameName}
                                          </span>

                                          <Show
                                            when={
                                              !libraryData().games[gameName]
                                                .location
                                            }>
                                            <span class="absolute tooltip z-[100] bottom-[30px]">
                                              no game file
                                            </span>
                                          </Show>
                                        </Show>
                                        <div
                                          className={`relative z-10 mb-[7px] rounded-[${
                                            roundedBorders() ? "6px" : "0px"
                                          }] outline-[#0000001c] w-full aspect-[2/3] dark:bg-[#1C1C1C] bg-[#F1F1F1]  hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                        />
                                      </div>
                                    </Show>
                                    <div className="absolute inset-0 dark:blur-[30px]  dark:group-hover:blur-[50px] duration-500 dark:bg-blend-screen ">
                                      <img
                                        className="absolute inset-0 duration-500 opacity-0 dark:opacity-[40%] dark:group-hover:opacity-60"
                                        src={convertFileSrc(
                                          appDataDirPath() +
                                            "grids\\" +
                                            libraryData().games[gameName]
                                              .gridImage,
                                        )}
                                        alt=""
                                      />
                                      <div
                                        className="dark:bg-[#fff] bg-[#000]  opacity-[0%] dark:opacity-[10%] w-full aspect-[2/3]"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </Show>
                                <Show when={gameTitle()}>
                                  <div className="flex justify-between items-start">
                                    <span className="text-[#000000] dark:text-white !max-w-[50%]">
                                      {gameName}
                                    </span>

                                    <Show
                                      when={
                                        !libraryData().games[gameName].location
                                      }>
                                      <span class=" tooltip z-[100]">
                                        no game file
                                      </span>
                                    </Show>
                                  </div>
                                </Show>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                  </Show>
                );
              }}
            </For>
          </Show>

          <Show when={searchValue() != "" && searchValue() != undefined}>
            {() => {
              let searchResults = [];
              let allGameNames = [];

              if (searchValue() != "" && searchValue() != undefined) {
                for (
                  let i = 0;
                  i < Object.values(libraryData().games).length;
                  i++
                ) {
                  allGameNames.push(Object.keys(libraryData().games)[i]);
                }
              }

              let fuse = new Fuse(Object.values(libraryData().games), {
                threshold: 0.5,
                keys: ["name"],
              });

              for (let i = 0; i < fuse.search(searchValue()).length; i++) {
                searchResults.push(fuse.search(searchValue())[i].item["name"]);
              }

              return (
                <div>
                  <div className="grid grid-cols-3 gap-5 mt-4 medium:grid-cols-4 large:grid-cols-6 foldersDiv">
                    <For each={searchResults}>
                      {(gameName) => {
                        return (
                          <div
                            className="relative w-full bg-transparent cursor-pointer gameCard group"
                            aria-label="play"
                            onDragStart={(e) => {
                              e.preventDefault();
                            }}
                            onClick={async (e) => {
                              if (e.ctrlKey) {
                                openGame(
                                  libraryData().games[gameName].location,
                                );
                                return;
                              }
                              await setSelectedGame(
                                libraryData().games[gameName],
                              );
                              document.querySelector("[data-gamePopup]").show();
                            }}>
                            <Show
                              when={!libraryData().games[gameName].favourite}>
                              <div className="relative w-full">
                                <Show
                                  when={
                                    libraryData().games[gameName].gridImage
                                  }>
                                  <img
                                    className={`z-10 mb-[7px] rounded-[${
                                      roundedBorders() ? "6px" : "0px"
                                    }] group-hover:outline-[#0000001f] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                    src={convertFileSrc(
                                      appDataDirPath() +
                                        "grids\\" +
                                        libraryData().games[gameName].gridImage,
                                    )}
                                    alt=""
                                  />{" "}
                                </Show>
                                <Show
                                  when={
                                    !libraryData().games[gameName].gridImage
                                  }>
                                  <div className="relative flex items-center justify-center">
                                    <Show when={!gameTitle()}>
                                      <span className="absolute z-[100] !max-w-[50%]">
                                        {gameName}
                                      </span>

                                      <Show
                                        when={
                                          !libraryData().games[gameName]
                                            .location
                                        }>
                                        <span class="absolute tooltip z-[100] bottom-[30px]">
                                          no game file
                                        </span>
                                      </Show>
                                    </Show>

                                    <div
                                      className={`z-10 mb-[7px] rounded-[${
                                        roundedBorders() ? "6px" : "0px"
                                      }] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] bg-[#F1F1F1]  w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                      alt=""
                                    />
                                  </div>
                                </Show>
                              </div>
                            </Show>
                            <Show
                              when={libraryData().games[gameName].favourite}>
                              <Show
                                when={libraryData().games[gameName].gridImage}>
                                <img
                                  className={`relative z-10 mb-[7px] rounded-[${
                                    roundedBorders() ? "6px" : "0px"
                                  }] outline-[#0000001c] w-full aspect-[2/3] hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                  src={convertFileSrc(
                                    appDataDirPath() +
                                      "grids\\" +
                                      libraryData().games[gameName].gridImage,
                                  )}
                                  alt=""
                                  width="100%"
                                />
                              </Show>

                              <Show
                                when={!libraryData().games[gameName].gridImage}>
                                <div className="relative flex items-center justify-center">
                                  <Show when={!gameTitle()}>
                                    <span className="absolute z-[100] !max-w-[50%]">
                                      {gameName}
                                    </span>

                                    <Show
                                      when={
                                        !libraryData().games[gameName].location
                                      }>
                                      <span class="absolute tooltip z-[100] bottom-[30px]">
                                        no game file
                                      </span>
                                    </Show>
                                  </Show>
                                  <div
                                    className={`relative z-10 mb-[7px] rounded-[${
                                      roundedBorders() ? "6px" : "0px"
                                    }] outline-[#0000001c] w-full aspect-[2/3] dark:bg-[#1C1C1C] bg-[#F1F1F1]  hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                  />
                                </div>
                              </Show>
                              <div className="absolute inset-0 dark:blur-[30px]  dark:group-hover:blur-[50px] duration-500 dark:bg-blend-screen ">
                                <img
                                  className="absolute inset-0 duration-500 opacity-0 dark:opacity-[40%] dark:group-hover:opacity-60"
                                  src={convertFileSrc(
                                    appDataDirPath() +
                                      "grids\\" +
                                      libraryData().games[gameName].gridImage,
                                  )}
                                  alt=""
                                />
                                <div
                                  className="dark:bg-[#fff] bg-[#000]  opacity-[0%] dark:opacity-[10%] w-full aspect-[2/3]"
                                  alt=""
                                />
                              </div>
                            </Show>

                            <Show when={gameTitle()}>
                              <div className="flex justify-between items-start">
                                <span className="text-[#000000] dark:text-white !max-w-[50%]">
                                  {gameName}
                                </span>

                                <Show
                                  when={
                                    !libraryData().games[gameName].location
                                  }>
                                  <span class=" tooltip z-[100]">
                                    no game file
                                  </span>
                                </Show>
                              </div>
                            </Show>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                  <div className="items-center">
                    <Show when={searchResults == ""}>
                      <div className="flex items-center  justify-center w-full h-[calc(100vh-100px)] gap-3 align-middle">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.04819 12H8.44444L10.2222 14H13.7778L15.5556 12H20.9361M6.70951 5.4902L3.27942 11.2785C3.09651 11.5871 3 11.9393 3 12.2981V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12.2981C21 11.9393 20.9035 11.5871 20.7206 11.2785L17.2905 5.4902C17.1104 5.18633 16.7834 5 16.4302 5H7.5698C7.21659 5 6.88958 5.18633 6.70951 5.4902Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"></path>
                        </svg>
                        no games found
                      </div>
                    </Show>
                  </div>
                </div>
              );
            }}
          </Show>
        </div>
      </div>

      <div id="abovePage">
        <NewGame />
        <EditGame />
        <NewFolder />
        <EditFolder />
        <GamePopUp />
        <Notepad />
        <Settings />
      </div>
    </>
  );
}

export default App;
