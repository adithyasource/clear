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
                  if (fontName().toLocaleLowerCase() == "sans serif") {
                    setFontName("serif");
                  } else {
                    if (fontName().toLocaleLowerCase() == "serif") {
                      setFontName("mono");
                    } else {
                      if (fontName().toLocaleLowerCase() == "mono") {
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
                  currentTheme().toLocaleLowerCase() == "dark"
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
                    <div
                      className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75"
                      onClick={() => {
                        changeLanguage("ru");
                      }}>
                      русский [russian]
                    </div>
                  </div>
                </Show>
              </div>
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
                  className="standardButton hint--bottom !flex !w-max !gap-3 "
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

                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.33521 10.141L10.8362 11.166L11.8246 12.667L15.0096 10.3973L11.5683 6.88281"
                      className="fill-[#00000080] dark:fill-[#ffffff80] "
                    />
                    <path
                      d="M15.0827 8.6404C16.0734 8.6404 16.8765 7.83728 16.8765 6.84657C16.8765 5.85586 16.0734 5.05273 15.0827 5.05273C14.0919 5.05273 13.2888 5.85586 13.2888 6.84657C13.2888 7.83728 14.0919 8.6404 15.0827 8.6404Z"
                      className="fill-[#00000080] dark:fill-[#ffffff80] "
                    />
                    <path
                      d="M9.18868 15.0834C10.4624 15.0834 11.495 14.0508 11.495 12.7771C11.495 11.5033 10.4624 10.4707 9.18868 10.4707C7.91492 10.4707 6.88232 11.5033 6.88232 12.7771C6.88232 14.0508 7.91492 15.0834 9.18868 15.0834Z"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="0.695568"
                    />
                    <path
                      d="M1.97681 9.81055L9.11554 12.7759"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="2.92871"
                      stroke-linecap="round"
                    />
                    <path
                      d="M15.0827 9.81149C16.7204 9.81149 18.0481 8.48388 18.0481 6.84618C18.0481 5.20848 16.7204 3.88086 15.0827 3.88086C13.445 3.88086 12.1174 5.20848 12.1174 6.84618C12.1174 8.48388 13.445 9.81149 15.0827 9.81149Z"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="1.17148"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex gap-3 items-start">
                <button
                  className="flex items-center standardButton !w-max !m-0"
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
