import { Show, onMount, useContext } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import {
  getData,
  importSteamGames,
  translateText,
  updateData,
  closeDialog,
} from "../Globals";

import { appDataDir } from "@tauri-apps/api/path";
import { Close, Steam } from "../libraries/Icons";

import { GlobalContext, ApplicationStateContext, UIContext } from "../Globals";
import { LanguageSelector } from "../components/LanguageSelector";
import { Hotkeys } from "../components/HotKeys";

export function Settings() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  onMount(() => {
    fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?version=a`).then((res) =>
      res.json().then((jsonres) => {
        applicationStateContext.setLatestVersion(jsonres.clearVersion);
        applicationStateContext.latestVersion().replaceAll(".", "") >
        applicationStateContext.appVersion().replaceAll(".", "")
          ? uiContext.setShowNewVersionAvailable(true)
          : uiContext.setShowNewVersionAvailable(false);
      }),
    );
  });

  return (
    <>
      <dialog
        data-settingsModal
        onClose={() => {
          uiContext.setShowSettingsLanguageSelector(false);
        }}
        ref={(ref) => {
          closeDialog("settingsModal", ref);

          function handleTab(e) {
            const focusableElements = ref.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

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
        className="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] outline-none dark:bg-[#12121266]">
        <div className="flex h-screen w-screen items-center justify-center align-middle ">
          <div className="w-[70%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
            <div className="flex justify-between">
              <div>
                <p className="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                  {translateText("settings")}
                </p>
              </div>

              <button
                className="standardButton !w-max !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                onClick={() => {
                  closeDialog("settingsModal");
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>

            <div className="mt-[25px] grid grid-cols-3 gap-y-4">
              <button
                onClick={async () => {
                  globalContext.setLibraryData(
                    "userSettings",
                    "roundedBorders",
                    (x) => !x,
                  );

                  await updateData();
                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show
                  when={globalContext.libraryData.userSettings.roundedBorders}
                  fallback={
                    <div className="">{translateText("rounded borders")}</div>
                  }>
                  <div className="relative ">
                    <div className="">{translateText("rounded borders")}</div>
                    <div className="absolute inset-0 opacity-70 blur-[5px]">
                      {translateText("rounded borders")}
                    </div>
                  </div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  globalContext.setLibraryData(
                    "userSettings",
                    "gameTitle",
                    (x) => !x,
                  );

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show
                  when={globalContext.libraryData.userSettings.gameTitle}
                  fallback={
                    <div className="">{translateText("game title")}</div>
                  }>
                  <div className="relative">
                    <div className="">{translateText("game title")}</div>
                    <div className="absolute inset-0 opacity-70 blur-[5px]  ">
                      {translateText("game title")}
                    </div>
                  </div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  globalContext.setLibraryData(
                    "userSettings",
                    "folderTitle",
                    (x) => !x,
                  );

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show
                  when={globalContext.libraryData.userSettings.folderTitle}
                  fallback={
                    <div className="">{translateText("folder title")}</div>
                  }>
                  <div className="relative">
                    <div className="">{translateText("folder title")}</div>
                    <div className="absolute inset-0 opacity-70 blur-[5px]  ">
                      {translateText("folder title")}
                    </div>
                  </div>
                </Show>
              </button>
              <button
                onClick={async () => {
                  globalContext.setLibraryData(
                    "userSettings",
                    "quitAfterOpen",
                    (x) => !x,
                  );

                  await updateData();

                  getData();
                }}
                className="relative cursor-pointer p-0 text-left">
                <Show
                  when={globalContext.libraryData.userSettings.quitAfterOpen}
                  fallback={
                    <div className="">
                      {translateText("quit after opening game")}
                    </div>
                  }>
                  <div className="relative">
                    <div className="">
                      {translateText("quit after opening game")}
                    </div>
                    <div className="absolute inset-0 opacity-70 blur-[5px]  ">
                      {translateText("quit after opening game")}
                    </div>
                  </div>
                </Show>
              </button>

              <button
                onClick={async () => {
                  if (
                    globalContext.libraryData.userSettings.fontName ==
                    "sans serif"
                  ) {
                    globalContext.setLibraryData(
                      "userSettings",
                      "fontName",
                      "serif",
                    );
                  } else {
                    if (
                      globalContext.libraryData.userSettings.fontName == "serif"
                    ) {
                      globalContext.setLibraryData(
                        "userSettings",
                        "fontName",
                        "mono",
                      );
                    } else {
                      if (
                        globalContext.libraryData.userSettings.fontName ==
                        "mono"
                      ) {
                        globalContext.setLibraryData(
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
                className="flex cursor-pointer gap-2 p-0 text-left">
                <span className="text-[#12121280] dark:text-[#ffffff80]">
                  [{translateText("font")}]
                </span>
                <div className="">
                  {translateText(
                    globalContext.libraryData.userSettings.fontName,
                  ) || translateText("sans serif")}
                </div>
              </button>
              <button
                onClick={async () => {
                  globalContext.libraryData.userSettings.currentTheme == "dark"
                    ? globalContext.setLibraryData(
                        "userSettings",
                        "currentTheme",
                        "light",
                      )
                    : globalContext.setLibraryData(
                        "userSettings",
                        "currentTheme",
                        "dark",
                      );

                  await updateData();

                  getData();
                }}
                className="flex cursor-pointer gap-2 p-0 text-left">
                <span className="text-[#12121280] dark:text-[#ffffff80]">
                  [{translateText("theme")}]
                </span>
                <div className="">
                  {translateText(
                    globalContext.libraryData.userSettings.currentTheme,
                  ) || translateText("dark")}
                </div>
              </button>
              <div className="relative flex cursor-pointer gap-2">
                <LanguageSelector onSettingsPage={true} />
              </div>
            </div>

            <Show when={uiContext.showNewVersionAvailable()}>
              <div className="mt-[35px] flex items-start gap-3">
                <button
                  className="standardButton !m-0 flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                  onClick={() => {
                    invoke("open_location", {
                      location: "https://clear.adithya.zip/update",
                    });
                  }}>
                  {translateText("new update available!")}
                  <span className="text-[#12121280] dark:text-[#ffffff80]">
                    v{applicationStateContext.latestVersion()}
                  </span>
                </button>
              </div>
            </Show>

            <div className="mt-[35px] flex flex-row items-start gap-4">
              <div>
                <button
                  className="standardButton hint--bottom !flex !w-max !gap-3 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] "
                  aria-label={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (globalContext.libraryData.folders.steam != undefined) {
                      uiContext.showImportAndOverwriteConfirm()
                        ? importSteamGames()
                        : uiContext.setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        uiContext.setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}>
                  <Show
                    when={globalContext.libraryData.folders.steam != undefined}
                    fallback={<>{translateText("import Steam games")}</>}>
                    <Show
                      when={uiContext.showImportAndOverwriteConfirm() == true}
                      fallback={<>{translateText("import Steam games")}</>}>
                      <span className="text-[#FF3636]">
                        {translateText(
                          "current 'steam' folder will be overwritten. confirm?",
                        )}
                      </span>
                    </Show>
                  </Show>

                  <Steam />
                </button>
              </div>

              <div className="flex items-start gap-3">
                <button
                  className="standardButton !m-0 flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                  onClick={async () => {
                    const appDataDirPath = await appDataDir();

                    invoke("open_location", {
                      location: appDataDirPath,
                    });
                  }}>
                  {translateText("open library location")}
                </button>
                <span className="w-[50%] text-[#12121280] dark:text-[#ffffff80]">
                  {translateText(
                    "these are all the files that the app stores on your pc",
                  )}
                </span>
              </div>
            </div>

            <Hotkeys onSettingsPage={true} />

            <div className="mt-[35px] flex justify-between ">
              <div>
                clear{" "}
                <span className="text-[#12121280] dark:text-[#ffffff80]">
                  v{applicationStateContext.appVersion()}
                </span>
              </div>
              <button
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/feedback",
                  });
                }}
                className="cursor-pointer p-0 underline">
                {translateText("feedback")}
              </button>
              <button
                onClick={() => {
                  invoke("open_location", {
                    location: "https://clear.adithya.zip/",
                  });
                }}
                className="cursor-pointer p-0 underline">
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
                  className="cursor-pointer p-0 underline">
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
                className="cursor-pointer p-0 underline">
                {translateText("buy me a coffee")}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
