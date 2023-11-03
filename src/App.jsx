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
import "./App.css";

import { Styles } from "./Styles";

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
  setFontName,
  fontName,
  quitAfterOpen,
  setQuitAfterOpen,
} from "./Signals";

import { SideBar } from "./SideBar";
import { NewGame } from "./modals/NewGame";
import { EditGame } from "./modals/EditGame";
import { NewFolder } from "./modals/NewFolder";
import { EditFolder } from "./modals/EditFolder";
import { GamePopUp } from "./modals/GamePopUp";
import { Notepad } from "./modals/Notepad";
import { Settings } from "./modals/Settings";

export function getSettingsData() {
  if (
    libraryData().userSettings.roundedBorders == true ||
    libraryData().userSettings.roundedBorders == undefined
  ) {
    setRoundedBorders(true);
  } else {
    setRoundedBorders(false);
  }
  if (
    libraryData().userSettings.gameTitle == true ||
    libraryData().userSettings.gameTitle == undefined
  ) {
    setGameTitle(true);
  } else {
    setGameTitle(false);
  }
  if (
    libraryData().userSettings.folderTitle == true ||
    libraryData().userSettings.folderTitle == undefined
  ) {
    setFolderTitle(true);
  } else {
    setFolderTitle(false);
  }
  if (
    libraryData().userSettings.quitAfterOpen == true ||
    libraryData().userSettings.quitAfterOpen == undefined
  ) {
    setQuitAfterOpen(true);
  } else {
    setQuitAfterOpen(false);
  }

  setFontName(libraryData().userSettings.fontName || "Sans Serif");
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("lib.json", { dir: BaseDirectory.AppData })) {
    let getLibraryData = await readTextFile("lib.json", {
      dir: BaseDirectory.AppData,
    });

    if (getLibraryData != "") {
      setCurrentGames("");
      setCurrentFolders("");
      setLibraryData(JSON.parse(getLibraryData));

      console.log(libraryData());

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

      if (
        libraryData().userSettings.showSideBar == true ||
        libraryData().userSettings.showSideBar == undefined
      ) {
        setGamesDivLeftPadding("23%");
        setShowSideBar(true);
      } else {
        setGamesDivLeftPadding("30px");
        setShowSideBar(false);
      }
      getSettingsData();
    } else return;
  } else {
    await createDir("data", {
      dir: BaseDirectory.AppData,
      recursive: true,
    });
    await writeTextFile(
      {
        path: "lib.json",
        contents: "",
      },
      {
        dir: BaseDirectory.AppData,
      },
    );
  }
}

export async function openGame(gameLocation) {
  invoke("openGame", {
    gameLocation: gameLocation,
  });

  if (permissionGranted()) {
    sendNotification(`launched ${notificationGameName()}!`);
  }

  console.log(selectedGame());

  console.log(quitAfterOpen());
  if (quitAfterOpen() == true || quitAfterOpen() == undefined) {
    setTimeout(async () => {
      await exit(1);
    }, 500);
  }
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
          [i].classList.add(
            "hint--right",
            "hint--no-animate",
            "hint--rounded",
            "hint--no-arrow",
          );
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document
          .querySelectorAll(".gameCard")
          [i].classList.add(
            "hint--center",
            "hint--no-animate",
            "hint--rounded",
            "hint--no-arrow",
          );
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
        setModalBackground("#12121266");
      } else {
        document.querySelector("[data-newGameModal]").showModal();
        setModalBackground("#121212cc");
      }
    }

    if (e.ctrlKey && e.code == "KeyM") {
      e.preventDefault();
      if (document.querySelector("[data-newFolderModal]").open) {
        document.querySelector("[data-newFolderModal]").close();
      } else {
        document.querySelector("[data-newFolderModal]").showModal();
      }
    }

    if (e.ctrlKey && e.code == "KeyL") {
      e.preventDefault();
      if (document.querySelector("[data-notepadModal]").open) {
        document.querySelector("[data-notepadModal]").close();
      } else {
        document.querySelector("[data-notepadModal]").showModal();
      }
    }

    if (e.ctrlKey && e.code == "Period") {
      e.preventDefault();
      if (document.querySelector("[data-settingsModal]").open) {
        document.querySelector("[data-settingsModal]").close();
      } else {
        document.querySelector("[data-settingsModal]").showModal();
      }
    }

    if (e.code == "Escape") {
      document.querySelector("#searchInput").blur();
    }

    if (e.ctrlKey && e.code == "Backslash") {
      e.preventDefault();
      toggleSideBar();
    }
  });

  async function closeApp() {
    await exit(1);
  }

  async function toggleSideBar() {
    if (
      libraryData().userSettings.showSideBar == true ||
      libraryData().userSettings.showSideBar == undefined
    ) {
      libraryData().userSettings.showSideBar = false;
    } else {
      libraryData().userSettings.showSideBar = true;
    }

    await writeTextFile(
      {
        path: "lib.json",
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
      document
        .querySelectorAll(".sideBarGame")
        [i].classList.remove(
          "hint--right",
          "hint--no-animate",
          "hint--rounded",
          "hint--no-arrow",
        );
    }

    for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
      document
        .querySelectorAll(".gameCard")
        [i].classList.remove(
          "hint--center",
          "hint--no-animate",
          "hint--rounded",
          "hint--no-arrow",
        );
    }
  });

  onMount(async () => {
    if (!permissionGranted()) {
      const permission = await requestPermission();
      setPermissionGranted(permission === "granted");
    }
    await getData();

    console.log(document.documentElement.classList);
    document.documentElement.classList.add("dark");

    if (document.documentElement.classList[0] == undefined) {
      setSecondaryColor("#F3F3F2");
      setSecondaryColorForBlur("#272727cc");
      setPrimaryColor("#FFFFFC");
      setModalBackground("#12121266");
      setLocatingLogoBackground("#272727");
      setGamesDivLeftPadding("10px");
    } else {
      document.documentElement.classList.add("dark");
      setSecondaryColor("#1c1c1c");
      setSecondaryColorForBlur("#272727cc");
      setPrimaryColor("#121212");
      setModalBackground("#12121266");
      setLocatingLogoBackground("#272727");
      setGamesDivLeftPadding("10px");
    }
  });

  return (
    <>
      <head>
        <link rel="stylesheet" href="hint.min.css" />
      </head>

      <Styles
        roundedBorders={roundedBorders}
        fontName={fontName}
        gameTitle={gameTitle}
        secondaryColor={secondaryColor}
        secondaryColorForBlur={secondaryColorForBlur}
        primaryColor={primaryColor}
        modalBackground={modalBackground}
        locatingLogoBackground={locatingLogoBackground}
        gamesDivLeftPadding={gamesDivLeftPadding}
      />

      <div id="page" className="">
        <Show when={showSideBar() == false}>
          <svg
            className="absolute right-[30px] top-[30px] z-10 rotate-180 cursor-pointer"
            onClick={toggleSideBar}
            width="12.19"
            height="14"
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
        <Show when={showSideBar() || showSideBar() == undefined}>
          <SideBar />
        </Show>
        <div
          className={`w-[100%] absolute h-screen overflow-y-scroll py-[20px] pr-[30px]   ${
            showSideBar()
              ? "pl-[23%] min-[1500px]:pl-[17%]"
              : "pl-[30px] min-[1500px]:pl-[30px]"
          }`}>
          <Show when={searchValue() == "" || searchValue() == undefined}>
            <For each={currentFolders()}>
              {(folderName) => {
                let folder = libraryData().folders[folderName];

                return (
                  <Show when={folder.games != "" && !folder.hide}>
                    <div className="folderRack">
                      <Show when={folderTitle()}>
                        <h1 className="dark:text-[#ffffff80] text-[#000000]">
                          {folder.name}
                        </h1>
                      </Show>
                      <div
                        className={`grid gap-5 mt-4 foldersDiv 
                          ${
                            showSideBar()
                              ? "grid-cols-5 min-[1500px]:grid-cols-7"
                              : "grid-cols-6 min-[1500px]:grid-cols-8"
                          }`}>
                        <For each={folder.games}>
                          {(gameName) => {
                            return (
                              <div
                                className="relative gameCard group"
                                aria-label="play"
                                onDragStart={(e) => {
                                  e.preventDefault();
                                }}
                                onClick={async (e) => {
                                  if (e.ctrlKey) {
                                    setNotificaitonGameName(gameName);
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
                                    .showModal();
                                }}>
                                <Show
                                  when={
                                    !libraryData().games[gameName].favourite
                                  }>
                                  <div className="w-[100%]">
                                    <img
                                      className="relative z-10 gridImage  object-fill  dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none"
                                      src={convertFileSrc(
                                        appDataDirPath() +
                                          libraryData().games[gameName]
                                            .gridImage,
                                      )}
                                      alt=""
                                    />
                                  </div>
                                </Show>
                                <Show
                                  when={
                                    libraryData().games[gameName].favourite
                                  }>
                                  <img
                                    className="relative z-10 gridImage  dark:outline-[#ffffff1a] outline-[2px] outline-none dark:group-hover:outline-[#ffffff28] duration-700"
                                    src={convertFileSrc(
                                      appDataDirPath() +
                                        libraryData().games[gameName].gridImage,
                                    )}
                                    alt=""
                                    width="100%"
                                  />
                                  <div className="absolute inset-0 blur-[30px]  group-hover:blur-[40px] duration-500 bg-blend-screen ">
                                    <img
                                      className="absolute inset-0 duration-500 opacity-40 group-hover:opacity-45"
                                      src={convertFileSrc(
                                        appDataDirPath() +
                                          libraryData().games[gameName]
                                            .gridImage,
                                      )}
                                      alt=""
                                    />
                                    <div
                                      className="dark:bg-[#fff] opacity-[10%] w-[100%] aspect-[2/3]"
                                      alt=""
                                    />
                                  </div>
                                </Show>
                                <Show when={gameTitle()}>
                                  {gameName.replaceAll("_", " ")}
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
                  allGameNames.push(
                    Object.keys(libraryData().games)[i].replaceAll("_", " "),
                  );
                }
              }

              let fuse = new Fuse(Object.values(libraryData().games), {
                threshold: 0.5,
                keys: ["name"],
              });

              for (let i = 0; i < fuse.search(searchValue()).length; i++) {
                searchResults.push(
                  fuse
                    .search(searchValue())
                    [i].item["name"].replaceAll(" ", "_"),
                );
              }

              return (
                <div>
                  <div className="grid grid-cols-5 gap-5 mt-4 foldersDiv">
                    <For each={searchResults}>
                      {(gameName) => {
                        return (
                          <div
                            className="relative gameCard group"
                            aria-label="play"
                            onDragStart={(e) => {
                              e.preventDefault();
                            }}
                            onClick={async (e) => {
                              if (e.ctrlKey) {
                                setNotificaitonGameName(gameName);
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
                                .showModal();
                            }}>
                            <img
                              className="relative z-10 gridImage dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none"
                              src={convertFileSrc(
                                appDataDirPath() +
                                  libraryData().games[gameName].gridImage,
                              )}
                              alt=""
                              width="100%"
                            />
                            <Show
                              when={libraryData().games[gameName].favourite}>
                              <img
                                className=" absolute blur-[50px] opacity-[0.4] inset-0 group-hover:opacity-[0.5] group-hover:blur-[60px] duration-700"
                                src={convertFileSrc(
                                  appDataDirPath() +
                                    libraryData().games[gameName].gridImage,
                                )}
                                alt=""
                              />
                            </Show>
                            <Show when={gameTitle()}>
                              {gameName.replaceAll("_", " ")}
                            </Show>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                  <div className="items-center">
                    <Show when={searchResults == ""}>
                      <div className="w-[100%] h-[90vh] flex items-center gap-3 justify-center align-middle">
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
          <img src="https://app.piratepx.com/ship?p=10ee2af1-5d97-4777-84dc-b537862876af&" />
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
