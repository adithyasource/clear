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
  language,
} from "../Signals";

import { getData, getSettingsData, importSteamGames } from "../App";

import { appDataDir } from "@tauri-apps/api/path";
import { Text } from "../components/Text";

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
                  <Text t="settings" />
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
                  <Text t="new update available!" />
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
                    <div className="">
                      <Text t="rounded borders" />
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      <Text t="rounded borders" />
                    </div>
                  </div>
                </Show>
                <Show when={!roundedBorders()}>
                  <div className="">
                    <Text t="rounded borders" />
                  </div>
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
                    <div className="">
                      <Text t="game title" />
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      <Text t="game title" />
                    </div>
                  </div>
                </Show>
                <Show when={!gameTitle()}>
                  <div className="">
                    <Text t="game title" />
                  </div>
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
                    <div className="">
                      <Text t="folder title" />
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      <Text t="folder title" />
                    </div>
                  </div>
                </Show>
                <Show when={!folderTitle()}>
                  <div className="">
                    <Text t="folder title" />
                  </div>
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
                    <div className="">
                      <Text t="quit after opening game" />
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      <Text t="quit after opening game" />
                    </div>
                  </div>
                </Show>
                <Show when={!quitAfterOpen()}>
                  <div className="">
                    <Text t="quit after opening game" />
                  </div>
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
                  [<Text t="font" />]
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
                  [<Text t="theme" />]
                </span>
                <div className="">{currentTheme().toLowerCase() || "dark"}</div>
              </div>
            </div>

            <div>
              <button
                className="standardButton mt-[35px] hint--bottom !flex !w-max !gap-3"
                aria-label="might not work perfectly!"
                onClick={() => {
                  importSteamGames();
                }}>
                <Text t="import steam games" />
                <svg
                  width="23"
                  height="14"
                  viewBox="0 0 23 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.3494 2.47291C19.5218 2.47291 20.4722 3.42332 20.4722 4.59569C20.4722 5.76806 19.5218 6.71847 18.3494 6.71847C17.177 6.71847 16.2266 5.76806
                      16.2266 4.59569C16.2266 3.42332 17.177 2.47291 18.3494 2.47291ZM2.97193 2.47286C4.61328 2.47286 5.94386 3.80344 5.94386 5.44479L5.92767 5.75653L10.6125
                      8.16922C11.1109 7.79163 11.7321 7.56762 12.4055 7.56762L14.5284 4.59569C14.5284 2.48541 16.239 0.774658 18.3494 0.774658C20.4597 0.774658 22.1704 2.48541
                      22.1704 4.59569C22.1704 6.70597 20.4597 8.41672 18.3494 8.41672L15.3775 10.5395C15.3775 12.1809 14.0469 13.5114 12.4055 13.5114C10.7642 13.5114 9.43366
                      12.1809 9.43366 10.5395C9.43366 10.5023 9.4343 10.4653 9.43569 10.4284L4.59494 7.93481C4.12832 8.23959 3.5708 8.41672 2.97193 8.41672C1.33058 8.41672
                      0 7.08614 0 5.44479C0 3.80344 1.33058 2.47286 2.97193 2.47286ZM13.2874 9.55643C13.9141 9.87579 14.1634 10.6428 13.844 11.2695C13.5247 11.8963 12.7577
                      12.1455 12.131 11.8261L10.3102 10.8819C10.4739 11.8915 11.3497 12.6623 12.4055 12.6623C13.578 12.6623 14.5284 11.7119 14.5284 10.5395C14.5284 9.36712
                      13.5779 8.41672 12.4055 8.41672C12.0775 8.41672 11.7668 8.49116 11.4895 8.62405L13.2874 9.55643ZM2.97193 3.32201C1.79956 3.32201 0.849154 4.27242 0.849154
                      5.44479C0.849154 6.61716 1.79956 7.56757 2.97193 7.56757C3.21433 7.56757 3.44724 7.52697 3.66422 7.45216L2.25486 6.72126C1.62811 6.4019 1.3789 5.63496
                      1.69825 5.0082C2.01761 4.38144 2.78455 4.13223 3.41136 4.45159L5.09128 5.32278C5.02805 4.20715 4.10333 3.32201 2.97193 3.32201ZM18.3494 1.62376C16.708
                      1.62376 15.3775 2.95433 15.3775 4.59569C15.3775 6.23704 16.708 7.56762 18.3494 7.56762C19.9907 7.56762 21.3213 6.23704 21.3213 4.59569C21.3213 2.95433
                      19.9907 1.62376 18.3494 1.62376Z"
                    className="fill-[#00000080] dark:fill-[#ffffff80] "
                  />
                </svg>
              </button>
            </div>

            <div className="flex gap-3 items-start mt-[10px]">
              <button
                className="flex items-center standardButton !w-max !m-0"
                onClick={async () => {
                  const appDataDirPath = await appDataDir();

                  invoke("open_location", {
                    location: appDataDirPath,
                  });
                }}>
                <Text t="open library location" />
              </button>
              <span className="dark:text-[#ffffff80] text-[#12121280] w-[50%]">
                <Text t="these are all the files that the app stores on your pc. you can copy these files to the same location on another pc to get your library there" />
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

                <Text t="new game" />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + .
                </div>

                <Text t="open settings" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + f
                </div>

                <Text t="search bar" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + m
                </div>

                <Text t="new folder" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + l
                </div>

                <Text t="open notepad" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + \\
                </div>

                <Text t="hide sidebar" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + w
                </div>

                <Text t="close app" />
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  escape
                </div>

                <Text t="close dialogs" />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + click
                </div>

                <Text t="quick open game" />
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
                <Text t="feedback" />
              </p>
              <p
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                className="underline cursor-pointer">
                <Text t="visit website" />
              </p>
              <div>
                <Text t="made by" />{" "}
                <a
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://adithya.zip/",
                    });
                  }}
                  className="underline cursor-pointer">
                  {" "}
                  adithya
                </a>
              </div>
              <a
                onClick={() => {
                  invoke("open_location", {
                    location: "https://ko-fi.com/adithyasource",
                  });
                }}
                className="underline cursor-pointer">
                <Text t="buy me a coffee" />
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
