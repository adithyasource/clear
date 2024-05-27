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
  steamFolderExists,
  showImportAndOverwriteConfirm,
  setShowImportAndOverwriteConfirm,
  setShowSettingsLanguageSelector,
  showSettingsLanguageSelector,
} from "../Signals";

import {
  getData,
  importSteamGames,
  translateText,
  changeLanguage,
} from "../App";

import { appDataDir } from "@tauri-apps/api/path";
import { Close, Steam } from "../components/Icons";

export function Settings() {
  onMount(() => {
    fetch("https://clear-api.adithya.zip/?version=a").then((res) =>
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
                  {translateText("settings")}
                </p>
              </div>

              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-settingsModal]").close();
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>

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
                    <div className="">{translateText("rounded borders")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("rounded borders")}
                    </div>
                  </div>
                </Show>
                <Show when={!roundedBorders()}>
                  <div className="">{translateText("rounded borders")}</div>
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
                    <div className="">{translateText("game title")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("game title")}
                    </div>
                  </div>
                </Show>
                <Show when={!gameTitle()}>
                  <div className="">{translateText("game title")}</div>
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
                    <div className="">{translateText("folder title")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("folder title")}
                    </div>
                  </div>
                </Show>
                <Show when={!folderTitle()}>
                  <div className="">{translateText("folder title")}</div>
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
                      {translateText("quit after opening game")}
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("quit after opening game")}
                    </div>
                  </div>
                </Show>
                <Show when={!quitAfterOpen()}>
                  <div className="">
                    {translateText("quit after opening game")}
                  </div>
                </Show>
              </div>

              <div
                onClick={async () => {
                  if (fontName() == "sans serif") {
                    setFontName("serif");
                  } else {
                    if (fontName() == "serif") {
                      setFontName("mono");
                    } else {
                      if (fontName() == "mono") {
                        setFontName("sans serif");
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
                  [{translateText("font")}]
                </span>
                <div className="">
                  {translateText(fontName()) || translateText("sans serif")}
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
                  [{translateText("theme")}]
                </span>
                <div className="">
                  {translateText(currentTheme()) || translateText("dark")}
                </div>
              </div>
              <div className="flex gap-2 cursor-pointer relative">
                <div
                  onClick={() => {
                    setShowSettingsLanguageSelector((x) => !x);
                  }}
                  className="w-full">
                  <span className="dark:text-[#ffffff80] text-[#12121280]">
                    [{translateText("language")}]
                  </span>
                  &nbsp;{" "}
                  {language() == "en"
                    ? "english"
                    : language() == "jp"
                    ? "日本語"
                    : language() == "es"
                    ? "Español"
                    : language() == "hi"
                    ? "हिंदी"
                    : language() == "ru"
                    ? "русский"
                    : language() == "fr"
                    ? "Français"
                    : "english"}
                </div>

                <Show when={showSettingsLanguageSelector()}>
                  <div
                    className={`flex flex-col gap-4 absolute border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] p-3 z-[100000] top-[150%]`}>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                      onClick={() => {
                        changeLanguage("en");
                      }}>
                      english
                    </div>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75"
                      onClick={() => {
                        changeLanguage("fr");
                      }}>
                      Français [french]
                    </div>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75"
                      onClick={() => {
                        changeLanguage("ru");
                      }}>
                      русский [russian]
                    </div>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                      onClick={() => {
                        changeLanguage("jp");
                      }}>
                      日本語 [japanese]
                    </div>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                      onClick={() => {
                        changeLanguage("es");
                      }}>
                      Español [spanish]
                    </div>
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                      onClick={() => {
                        changeLanguage("hi");
                      }}>
                      हिंदी [hindi]
                    </div>
                  </div>
                </Show>
              </div>
            </div>

            <Show when={newVersionAvailable()}>
              <div className="flex gap-3 items-start mt-[35px]">
                <button
                  className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !m-0"
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://clear.adithya.zip/update",
                    });
                  }}>
                  {translateText("new update available!")}
                  <span className="dark:text-[#ffffff80] text-[#12121280]">
                    v{latestVersion()}
                  </span>
                </button>
              </div>
            </Show>

            <div className="flex flex-row items-start mt-[35px] gap-4">
              <div>
                <button
                  className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] hint--bottom !flex !w-max !gap-3 "
                  aria-label={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (steamFolderExists()) {
                      showImportAndOverwriteConfirm()
                        ? importSteamGames()
                        : setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}>
                  <Show when={steamFolderExists() == true}>
                    <Show when={showImportAndOverwriteConfirm() == true}>
                      <span className="text-[#FF3636]">
                        {translateText(
                          "current 'steam' folder will be overwritten. confirm?",
                        )}
                      </span>
                    </Show>
                    <Show when={showImportAndOverwriteConfirm() == false}>
                      {translateText("import Steam games")}
                    </Show>
                  </Show>
                  <Show when={steamFolderExists() == false}>
                    {translateText("import Steam games")}
                  </Show>

                  <Steam />
                </button>
              </div>

              <div className="flex gap-3 items-start">
                <button
                  className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !m-0"
                  onClick={async () => {
                    const appDataDirPath = await appDataDir();

                    invoke("open_location", {
                      location: appDataDirPath,
                    });
                  }}>
                  {translateText("open library location")}
                </button>
                <span className="dark:text-[#ffffff80] text-[#12121280] w-[50%]">
                  {translateText(
                    "these are all the files that the app stores on your pc. you can copy these files to the same location on another pc to get your library there",
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 mt-[35px] gap-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + n
                </div>

                {translateText("new game")}
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + .
                </div>

                {translateText("open settings")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + f
                </div>

                {translateText("search bar")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + m
                </div>

                {translateText("new folder")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + l
                </div>

                {translateText("open notepad")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + \\
                </div>

                {translateText("hide sidebar")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + w
                </div>

                {translateText("close app")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl - / =
                </div>

                {translateText("change zoom")}
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + click
                </div>

                {translateText("quick open game")}
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
                    location: "https://clear.adithya.zip/feedback",
                  });
                }}
                className="underline cursor-pointer">
                {translateText("feedback")}
              </p>
              <p
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                className="underline cursor-pointer">
                {translateText("website")}
              </p>
              <div>
                {translateText("made by")}{" "}
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
                {translateText("buy me a coffee")}
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
