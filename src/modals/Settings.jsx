import { Show, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import {
  libraryData,
  roundedBorders,
  setRoundedBorders,
  gameTitle,
  setGameTitle,
  folderTitle,
  setFolderTitle,
  quitAfterOpen,
  setQuitAfterOpen,
  setFontName,
  fontName,
  currentTheme,
  setCurrentTheme,
  appVersion,
  latestVersion,
  setLatestVersion,
  newVersionAvailable,
  setNewVersionAvailable,
} from "../Signals";

import { getData, getSettingsData } from "../App";

import { appDataDir } from "@tauri-apps/api/path";

export function Settings() {
  setTimeout(() => {
    getSettingsData();
  }, 50);

  onMount(() => {
    fetch("https://clear-api.vercel.app/?version=a").then((res) =>
      res.json().then((jsonres) => {
        setLatestVersion(jsonres.clearVersion);
        latestVersion().replaceAll(".", "") > appVersion().replaceAll(".", "")
          ? setNewVersionAvailable(true)
          : setNewVersionAvailable(false);
      }),
    );
  });

  return (
    <>
      <dialog
        data-settingsModal
        onClose={() => {}}
        className="outline-none absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div
            className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] w-[70%] p-6`}>
            <div className="flex justify-between">
              <div>
                <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                  settings
                </p>
              </div>

              <button
                className="standardButton !w-max !gap-0"
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

            <Show when={newVersionAvailable()}>
              <div className="flex gap-3 items-start mt-[35px]">
                <button
                  className="flex items-center standardButton !w-max !m-0"
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://clear.adithya.zip/update",
                    });
                  }}>
                  new update available!
                  <span className="dark:text-[#ffffff80] text-[#12121280]">
                    v{latestVersion()}
                  </span>
                </button>
              </div>
            </Show>

            <div className="grid grid-cols-3 mt-[25px] gap-y-4">
              <div
                onClick={async () => {
                  setRoundedBorders((x) => !x);

                  libraryData().userSettings.roundedBorders = roundedBorders();

                  await writeTextFile(
                    {
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={roundedBorders()}>
                  <div className="relative ">
                    <div className="">rounded borders</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
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
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
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
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
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
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
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
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      folder title
                    </div>
                  </div>
                </Show>
                <Show when={!folderTitle()}>
                  <div className="">folder title</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setQuitAfterOpen((x) => !x);

                  libraryData().userSettings.quitAfterOpen = quitAfterOpen();

                  await writeTextFile(
                    {
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={quitAfterOpen()}>
                  <div className="relative">
                    <div className="">quit after opening game</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      quit after opening game
                    </div>
                  </div>
                </Show>
                <Show when={!quitAfterOpen()}>
                  <div className="">quit after opening game</div>
                </Show>
              </div>

              <div
                onClick={async () => {
                  if (fontName() == "Sans Serif") {
                    setFontName("Serif");
                  } else {
                    if (fontName() == "Serif") {
                      setFontName("Mono");
                    } else {
                      if (fontName() == "Mono") {
                        setFontName("Sans Serif");
                      }
                    }
                  }

                  libraryData().userSettings.fontName = fontName();

                  await writeTextFile(
                    {
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="flex gap-2 cursor-pointer ">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  [font]
                </span>
                <div className="">
                  {fontName().toLowerCase() || "sans serif"}
                </div>
              </div>
              <div
                onClick={async () => {
                  currentTheme() == "dark"
                    ? setCurrentTheme("light")
                    : setCurrentTheme("dark");

                  libraryData().userSettings.theme = currentTheme();

                  await writeTextFile(
                    {
                      path: "data.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="flex gap-2 cursor-pointer ">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  [theme]
                </span>
                <div className="">{currentTheme().toLowerCase() || "dark"}</div>
              </div>
            </div>

            <div className="flex gap-3 items-start mt-[35px]">
              <button
                className="flex items-center standardButton !w-max !m-0"
                onClick={async () => {
                  const appDataDirPath = await appDataDir();

                  invoke("open_location", {
                    location: appDataDirPath,
                  });
                }}>
                open library location
              </button>
              <span className="dark:text-[#ffffff80] text-[#12121280] w-[50%]">
                these are all the files that the app stores on your pc. you can
                copy these files to the same location on another pc to get your
                library there
              </span>
            </div>

            <div className="grid grid-cols-3 mt-[35px] gap-y-4">
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
                  ctrl + f
                </div>
                search bar
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
                  ctrl + \\
                </div>
                hide sidebar
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

            <div className="flex justify-between mt-[35px] ">
              <div>
                clear{" "}
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  v{appVersion()}
                </span>
              </div>
              <p
                onClick={() => {
                  invoke("open_location", {
                    location: "https://github.com/adithyasource/clear/issues",
                  });
                }}
                className="underline cursor-pointer">
                feedback & suggestions
              </p>
              <p
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                className="underline cursor-pointer">
                visit website
              </p>
              <div>
                <a
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://adithya.zip/",
                    });
                  }}
                  className="underline cursor-pointer">
                  made by adithya
                </a>
              </div>
              <a
                onClick={() => {
                  invoke("open_location", {
                    location: "https://ko-fi.com/adithyasource",
                  });
                }}
                className="underline cursor-pointer">
                buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
