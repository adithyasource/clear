import { Show, onMount, useContext } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import {
  getData,
  importSteamGames,
  translateText,
  changeLanguage,
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
        className="outline-none absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div className="border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] w-[70%] p-6">
            <div className="flex justify-between">
              <div>
                <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                  {translateText("settings")}
                </p>
              </div>

              <button
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  closeDialog("settingsModal");
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>

            <div className="grid grid-cols-3 mt-[25px] gap-y-4">
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
                    <div className="absolute blur-[5px] opacity-70 inset-0">
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
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
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
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
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
                    <div className="absolute blur-[5px] opacity-70 inset-0  ">
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
                className="flex gap-2 cursor-pointer p-0 text-left">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
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
                className="flex gap-2 cursor-pointer p-0 text-left">
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  [{translateText("theme")}]
                </span>
                <div className="">
                  {translateText(
                    globalContext.libraryData.userSettings.currentTheme,
                  ) || translateText("dark")}
                </div>
              </button>
              <div className="flex gap-2 cursor-pointer relative">
                <LanguageSelector onSettingsPage={true} />
              </div>
            </div>

            <Show when={uiContext.showNewVersionAvailable()}>
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
                    v{applicationStateContext.latestVersion()}
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
                    "these are all the files that the app stores on your pc",
                  )}
                </span>
              </div>
            </div>

            <Hotkeys onSettingsPage={true} />

            <div className="flex justify-between mt-[35px] ">
              <div>
                clear{" "}
                <span className="dark:text-[#ffffff80] text-[#12121280]">
                  v{applicationStateContext.appVersion()}
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
