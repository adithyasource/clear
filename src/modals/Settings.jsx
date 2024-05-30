import { Show, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import {
  libraryData,
  appVersion,
  latestVersion,
  setLatestVersion,
  newVersionAvailable,
  setNewVersionAvailable,
  showImportAndOverwriteConfirm,
  setShowImportAndOverwriteConfirm,
  setShowSettingsLanguageSelector,
  showSettingsLanguageSelector,
  setLibraryData,
} from "../Signals";

import {
  getData,
  importSteamGames,
  translateText,
  changeLanguage,
  updateData,
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
        onClose={() => {
          setShowSettingsLanguageSelector(false);
        }}
        ref={(ref) => {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          function handleTab(e) {
            if (e.key === "Tab") {
              if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                  e.preventDefault();
                  lastElement.focus();
                }
              } else {
                if (document.activeElement === lastElement) {
                  e.preventDefault();
                  firstElement.focus();
                }
              }
            }
          }

          ref.addEventListener("keydown", handleTab);

          ref.addEventListener("close", () => {
            previouslyFocusedElement.focus();
          });
        }}
        className="outline-none absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div
            className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
              libraryData.userSettings.roundedBorders ? "6px" : "0px"
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
              <button
                onClick={async () => {
                  setLibraryData("userSettings", "roundedBorders", (x) => !x);

                  await updateData();
                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show when={libraryData.userSettings.roundedBorders}>
                  <div className="relative ">
                    <div className="">{translateText("rounded borders")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      {translateText("rounded borders")}
                    </div>
                  </div>
                </Show>
                <Show when={!libraryData.userSettings.roundedBorders}>
                  <div className="">{translateText("rounded borders")}</div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  setLibraryData("userSettings", "gameTitle", (x) => !x);

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show when={libraryData.userSettings.gameTitle}>
                  <div className="relative">
                    <div className="">{translateText("game title")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("game title")}
                    </div>
                  </div>
                </Show>
                <Show when={!libraryData.userSettings.gameTitle}>
                  <div className="">{translateText("game title")}</div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  setLibraryData("userSettings", "folderTitle", (x) => !x);

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show when={libraryData.userSettings.folderTitle}>
                  <div className="relative">
                    <div className="">{translateText("folder title")}</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("folder title")}
                    </div>
                  </div>
                </Show>
                <Show when={!libraryData.userSettings.folderTitle}>
                  <div className="">{translateText("folder title")}</div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  setLibraryData("userSettings", "quitAfterOpen", (x) => !x);

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show when={libraryData.userSettings.quitAfterOpen}>
                  <div className="relative">
                    <div className="">
                      {translateText("quit after opening game")}
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
                      {translateText("quit after opening game")}
                    </div>
                  </div>
                </Show>
                <Show when={!libraryData.userSettings.quitAfterOpen}>
                  <div className="">
                    {translateText("quit after opening game")}
                  </div>
                </Show>
              </button>

              <button
                onClick={async () => {
                  if (libraryData.userSettings.fontName == "sans serif") {
                    setLibraryData("userSettings", "fontName", "serif");
                  } else {
                    if (libraryData.userSettings.fontName == "serif") {
                      setLibraryData("userSettings", "fontName", "mono");
                    } else {
                      if (libraryData.userSettings.fontName == "mono") {
                        setLibraryData(
                          "userSettings",
                          "fontName",
                          "sans serif",
                        );
                      }
                    }
                  }

                  await updateData();

                  getData();
                }}
                className="flex gap-2 cursor-pointer p-0 text-left">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  [{translateText("font")}]
                </span>
                <div className="">
                  {translateText(libraryData.userSettings.fontName) ||
                    translateText("sans serif")}
                </div>
              </button>
              <button
                onClick={async () => {
                  libraryData.userSettings.currentTheme == "dark"
                    ? setLibraryData("userSettings", "currentTheme", "light")
                    : setLibraryData("userSettings", "currentTheme", "dark");

                  await updateData();

                  getData();
                }}
                className="flex gap-2 cursor-pointer p-0 text-left">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  [{translateText("theme")}]
                </span>
                <div className="">
                  {translateText(libraryData.userSettings.currentTheme) ||
                    translateText("dark")}
                </div>
              </button>
              <div className="flex gap-2 cursor-pointer relative">
                <button
                  onClick={() => {
                    setShowSettingsLanguageSelector((x) => !x);
                    document.getElementById("firstDropdownItem").focus();
                  }}
                  className="w-full p-0 text-left">
                  <span className="dark:text-[#ffffff80] text-[#12121280]">
                    [{translateText("language")}]
                  </span>
                  &nbsp;{" "}
                  {libraryData.userSettings.language == "en"
                    ? "english"
                    : libraryData.userSettings.language == "jp"
                    ? "日本語"
                    : libraryData.userSettings.language == "es"
                    ? "Español"
                    : libraryData.userSettings.language == "hi"
                    ? "हिंदी"
                    : libraryData.userSettings.language == "ru"
                    ? "русский"
                    : libraryData.userSettings.language == "fr"
                    ? "Français"
                    : "english"}
                  <Show when={showSettingsLanguageSelector()}>
                    <div
                      className={`flex flex-col gap-4 absolute border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
                        libraryData.userSettings.roundedBorders ? "6px" : "0px"
                      }] p-3 z-[100000] top-[150%]`}
                      onMouseLeave={() => {
                        setShowSettingsLanguageSelector(false);
                      }}>
                      <button
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
                        id="firstDropdownItem"
                        onClick={() => {
                          changeLanguage("en");
                        }}>
                        english
                      </button>
                      <button
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75 p-0 text-left"
                        onClick={() => {
                          changeLanguage("fr");
                        }}>
                        Français [french]
                      </button>
                      <button
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75 p-0 text-left"
                        onClick={() => {
                          changeLanguage("ru");
                        }}>
                        русский [russian]
                      </button>
                      <button
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
                        onClick={() => {
                          changeLanguage("jp");
                        }}>
                        日本語 [japanese]
                      </button>
                      <button
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
                        onClick={() => {
                          changeLanguage("es");
                        }}>
                        Español [spanish]
                      </button>
                      <button
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            setShowSettingsLanguageSelector(false);
                          }
                        }}
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
                        onClick={() => {
                          changeLanguage("hi");
                        }}>
                        हिंदी [hindi]
                      </button>
                    </div>
                  </Show>
                </button>
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
                    if (libraryData.folders.steam != undefined) {
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
                  <Show when={libraryData.folders.steam != undefined}>
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
                  <Show when={libraryData.folders.steam == undefined}>
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
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + n
                </div>

                {translateText("new game")}
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + .
                </div>

                {translateText("open settings")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + f
                </div>

                {translateText("search bar")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + m
                </div>

                {translateText("new folder")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + l
                </div>

                {translateText("open notepad")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + \\
                </div>

                {translateText("hide sidebar")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl + w
                </div>

                {translateText("close app")}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
                  }] `}>
                  ctrl - / =
                </div>

                {translateText("change zoom")}
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                    libraryData.userSettings.roundedBorders ? "6px" : "0px"
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
              <button
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/feedback",
                  });
                }}
                className="underline cursor-pointer p-0">
                {translateText("feedback")}
              </button>
              <button
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                className="underline cursor-pointer p-0">
                {translateText("website")}
              </button>
              <div>
                {translateText("made by")}{" "}
                <button
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://adithya.zip/",
                    });
                  }}
                  className="underline cursor-pointer p-0">
                  {" "}
                  adithya
                </button>
              </div>
              <button
                onClick={() => {
                  invoke("open_location", {
                    location: "https://ko-fi.com/adithyasource",
                  });
                }}
                className="underline cursor-pointer p-0">
                {translateText("buy me a coffee")}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
