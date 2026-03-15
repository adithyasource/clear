// importing globals
import {
  ApplicationStateContext,
  GlobalContext,
  UIContext,
  closeDialog,
  getData,
  importSteamGames,
  translateText,
  updateData,
} from "../Globals.jsx";

import { Hotkeys } from "../components/Hotkeys.jsx";
// importing components
import { LanguageSelector } from "../components/LanguageSelector.jsx";

import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
// importing code snippets and library functions
import { Show, useContext } from "solid-js";

// importing style related files
import { Close, Steam } from "../libraries/Icons.jsx";

export function Settings() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <>
      <dialog
        data-modal="settings"
        onClose={() => {
          uiContext.setShowSettingsLanguageSelector(false);
          uiContext.setShowSettingsModal(false);
        }}
        class="!p-0 h-screen w-screen overflow-visible backdrop:bg-transparent"
      >
        <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
          <div class="w-[70%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
            <div class="flex justify-between">
              <div>
                <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">{translateText("settings")}</p>
              </div>

              <button
                type="button"
                class="standardButton !w-max !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom aspect-square bg-[#E8E8E8] dark:bg-[#232323]"
                onClick={() => {
                  closeDialog("settings");
                  getData();
                }}
                data-tooltip={translateText("close")}
              >
                <Close />
              </button>
            </div>

            <div class="mt-[25px] grid grid-cols-3 gap-y-4">
              <button
                type="button"
                onClick={async () => {
                  globalContext.setLibraryData("userSettings", "roundedBorders", (x) => !x);

                  await updateData();
                }}
                class="relative cursor-pointer p-0 text-left"
              >
                <Show
                  when={globalContext.libraryData.userSettings.roundedBorders}
                  fallback={<div class="">{translateText("rounded borders")}</div>}
                >
                  <div class="relative ">
                    <div class="">{translateText("rounded borders")}</div>
                    <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("rounded borders")}</div>
                  </div>
                </Show>
              </button>
              <button
                type="button"
                onClick={async () => {
                  globalContext.setLibraryData("userSettings", "gameTitle", (x) => !x);

                  await updateData();
                }}
                class="relative cursor-pointer p-0 text-left"
              >
                <Show
                  when={globalContext.libraryData.userSettings.gameTitle}
                  fallback={<div class="">{translateText("game title")}</div>}
                >
                  <div class="relative">
                    <div class="">{translateText("game title")}</div>
                    <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("game title")}</div>
                  </div>
                </Show>
              </button>
              <button
                type="button"
                onClick={async () => {
                  globalContext.setLibraryData("userSettings", "folderTitle", (x) => !x);

                  await updateData();
                }}
                class="relative cursor-pointer p-0 text-left"
              >
                <Show
                  when={globalContext.libraryData.userSettings.folderTitle}
                  fallback={<div class="">{translateText("folder title")}</div>}
                >
                  <div class="relative">
                    <div class="">{translateText("folder title")}</div>
                    <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("folder title")}</div>
                  </div>
                </Show>
              </button>
              <button
                type="button"
                onClick={async () => {
                  globalContext.setLibraryData("userSettings", "quitAfterOpen", (x) => !x);

                  await updateData();
                }}
                class="relative cursor-pointer p-0 text-left"
              >
                <Show
                  when={globalContext.libraryData.userSettings.quitAfterOpen}
                  fallback={<div class="">{translateText("quit after opening game")}</div>}
                >
                  <div class="relative">
                    <div class="">{translateText("quit after opening game")}</div>
                    <div class="absolute inset-0 opacity-70 blur-[5px] ">
                      {translateText("quit after opening game")}
                    </div>
                  </div>
                </Show>
              </button>

              <button
                type="button"
                onClick={async () => {
                  switch (globalContext.libraryData.userSettings.fontName) {
                    case "sans serif":
                      globalContext.setLibraryData("userSettings", "fontName", "serif");
                      break;
                    case "serif":
                      globalContext.setLibraryData("userSettings", "fontName", "mono");
                      break;
                    case "mono":
                      globalContext.setLibraryData("userSettings", "fontName", "sans serif");
                  }

                  await updateData();
                }}
                class="flex cursor-pointer gap-2 p-0 text-left"
              >
                <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("font")}]</span>
                <div class="">
                  {translateText(globalContext.libraryData.userSettings.fontName) || translateText("sans serif")}
                </div>
              </button>
              <button
                type="button"
                onClick={async () => {
                  globalContext.libraryData.userSettings.currentTheme === "dark"
                    ? globalContext.setLibraryData("userSettings", "currentTheme", "light")
                    : globalContext.setLibraryData("userSettings", "currentTheme", "dark");

                  await updateData();
                }}
                class="flex cursor-pointer gap-2 p-0 text-left"
              >
                <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("theme")}]</span>
                <div class="">
                  {translateText(globalContext.libraryData.userSettings.currentTheme) || translateText("dark")}
                </div>
              </button>
              <div class="relative flex cursor-pointer gap-2">
                <LanguageSelector onSettingsPage={true} />
              </div>
            </div>

            <Show when={uiContext.showNewVersionAvailable()}>
              <div class="mt-[35px] flex items-start gap-3">
                <button
                  type="button"
                  class="standardButton !m-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://clear.adithya.zip/update",
                    });
                  }}
                >
                  {translateText("new update available!")}
                  <span class="text-[#12121280] dark:text-[#ffffff80]">v{applicationStateContext.latestVersion()}</span>
                </button>
              </div>
            </Show>

            <div class="mt-[35px] flex flex-row items-start gap-4">
              <div>
                <button
                  type="button"
                  class="standardButton tooltip-bottom !flex !w-max !gap-3 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] bg-[#E8E8E8] dark:bg-[#232323] "
                  data-tooltip={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (globalContext.libraryData.folders.steam !== undefined) {
                      uiContext.showImportAndOverwriteConfirm()
                        ? importSteamGames()
                        : uiContext.setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        uiContext.setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}
                >
                  <Show
                    when={globalContext.libraryData.folders.steam !== undefined}
                    fallback={translateText("import Steam games")}
                  >
                    <Show
                      when={uiContext.showImportAndOverwriteConfirm() === true}
                      fallback={translateText("import Steam games")}
                    >
                      <span class="text-[#FF3636]">
                        {translateText("current 'steam' folder will be overwritten. confirm?")}
                      </span>
                    </Show>
                  </Show>

                  <Steam />
                </button>
              </div>

              <div class="flex items-start gap-3">
                <button
                  type="button"
                  class="standardButton !m-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
                  onClick={async () => {
                    const appDataDirPath = await appDataDir();

                    invoke("open_location", {
                      location: appDataDirPath,
                    });
                  }}
                >
                  {translateText("open library location")}
                </button>
                <span class="w-[50%] text-[#12121280] dark:text-[#ffffff80]">
                  {translateText("these are all the files that the app stores on your pc")}
                </span>
              </div>
            </div>

            <Hotkeys onSettingsPage={true} />

            <div class="mt-[35px] flex justify-between ">
              <div>
                clear{" "}
                <span class="text-[#12121280] dark:text-[#ffffff80]">v{applicationStateContext.appVersion()}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/feedback",
                  });
                }}
                class="cursor-pointer p-0 underline"
              >
                {translateText("feedback")}
              </button>
              <button
                type="button"
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                class="cursor-pointer p-0 underline"
              >
                {translateText("website")}
              </button>
              <div>
                {translateText("made by")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://adithya.zip/",
                    });
                  }}
                  class="cursor-pointer p-0 underline"
                >
                  {" "}
                  adithya
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  invoke("open_location", {
                    location: "https://ko-fi.com/adithyasource",
                  });
                }}
                class="cursor-pointer p-0 underline"
              >
                {translateText("buy me a coffee")}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
