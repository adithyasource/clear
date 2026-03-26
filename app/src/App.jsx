import { invoke } from "@tauri-apps/api/core";
import { createEffect, For, onMount, Show, useContext } from "solid-js";
import { ModalFrame } from "@/components/modal/ModalFrame";
import { SideBar } from "@/components/sidebar/SideBar.jsx";
import { GameCards } from "@/components/ui/GameCards.jsx";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { ChevronArrows, EmptyTray, Steam } from "@/libraries/Icons.jsx";
import { fuzzysearch } from "@/utils/fuzzysearch.js";
import { translateText } from "@/utils/translateText";
import {
  ApplicationStateContext,
  checkIfConnectedToInternet,
  importSteamGames,
  openDialog,
  toggleSideBar,
  triggerToast,
  UIContext,
  updateData,
} from "./Globals.jsx";
import "./App.css";
import { getData } from "@/services/libraryService.js";
import { libraryData } from "./stores/libraryStore.js";

function App() {
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  // setting up effects for styles that can be changed in settings
  createEffect(() => {
    document.body.style.setProperty(
      "--text-color",
      libraryData.userSettings.currentTheme === "light" ? "#000000" : "#ffffff",
    );

    libraryData.userSettings.currentTheme === "light"
      ? document.documentElement.classList.remove("dark")
      : document.documentElement.classList.add("dark");
  });

  createEffect(() => {
    let fontFamily;
    switch (libraryData.userSettings.fontName) {
      case "sans serif":
        fontFamily = "Helvetica, Arial, sans-serif";
        break;
      case "serif":
        fontFamily = "Times New Roman";
        break;
      case "mono":
        fontFamily = "IBM Plex Mono, Consolas";
        break;
    }
    document.body.style.setProperty("--font-family", fontFamily);
  });

  createEffect(() => {
    document.body.style.setProperty("--border-radius", libraryData.userSettings.roundedBorders ? "6px" : "0px");
  });

  createEffect(() => {
    document.body.style.setProperty(
      "--outline-color",
      libraryData.userSettings.currentTheme === "light" ? "#000000" : "#ffffff",
    );
  });

  function closeApp() {
    invoke("close_app");
  }

  function handleTabAndMouseBehaviour() {
    // adds user-is-tabbing to body whenever tab is used
    // used for changing tooltip delay

    function handleFirstTab(e) {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        self.removeEventListener("keydown", handleFirstTab);
        self.addEventListener("mousedown", handleMouseDown);
        uiContext.setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
      }
    }

    function handleMouseDown() {
      document.body.classList.remove("user-is-tabbing");
      self.removeEventListener("mousedown", handleMouseDown);
      self.addEventListener("keydown", handleFirstTab);
      uiContext.setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
    }

    self.addEventListener("keydown", handleFirstTab);
  }

  function returnGridStyleForGameCard(zoomLevel, showSideBar) {
    switch (zoomLevel) {
      case 0:
        if (showSideBar) {
          return "grid-cols-4 medium:grid-cols-5 large:grid-cols-7";
        }
        return "grid-cols-4 medium:grid-cols-6 large:grid-cols-8";
      case 1:
        if (showSideBar) {
          return "grid-cols-3 medium:grid-cols-4 large:grid-cols-6";
        }
        return "grid-cols-3 medium:grid-cols-5 large:grid-cols-7";
      case 2:
        if (showSideBar) {
          return "grid-cols-2 medium:grid-cols-3 large:grid-cols-5";
        }
        return "grid-cols-2 medium:grid-cols-4 large:grid-cols-6";
    }
  }

  function addEventListeners() {
    handleTabAndMouseBehaviour();

    // disabling right click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // storing window width in application state context
    self.addEventListener("resize", () => {
      applicationStateContext.setWindowWidth(self.innerWidth);
    });

    // keyboard handling
    document.addEventListener("keydown", (e) => {
      const modifierKey = applicationStateContext.systemPlatform() === "windows" ? "ctrlKey" : "metaKey";

      if (e[modifierKey]) {
        // "play" tooltip added to sidebar game and game card if user is also hovering on a specific element
        for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
          sideBarGame.classList.add("tooltip-right");
          sideBarGame.style.cursor = "pointer";
        }
        for (const gameCard of document.querySelectorAll(".gameCard")) {
          gameCard.classList.add("tooltip-center");
        }

        // if ctrl/cmd + another key held down
        switch (e.code) {
          // increase game card zoom level
          case "Equal":
            setLibraryData("userSettings", "zoomLevel", (zoomLevel) => {
              return zoomLevel !== 2 ? zoomLevel + 1 : 2;
            });
            updateData();
            break;

          // decrease game card zoom level
          case "Minus":
            setLibraryData("userSettings", "zoomLevel", (zoomLevel) => {
              return zoomLevel !== 0 ? zoomLevel - 1 : 0;
            });
            updateData();
            break;

          // closes the app
          case "KeyW":
            e.preventDefault();
            closeApp();
            break;

          // focuses game search bar
          case "KeyF":
            if (!anyDialogOpen) {
              e.preventDefault();
              document.querySelector("#searchInput").focus();
            } else {
              triggerToast(translateText("close current dialog before opening another"));
            }
            break;

          // opens new game modal
          case "KeyN":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("newGame");
            } else {
              if (!uiContext.showNewGameModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens new folder modal
          case "KeyM":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("newFolder");
            } else {
              if (!uiContext.showNewFolderModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens notepad modal
          case "KeyL":
            e.preventDefault();
            if (!anyDialogOpen) {
              openDialog("notepad");
            } else {
              if (!uiContext.showNotepadModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // opens settings modal
          case "Comma":
            if (!anyDialogOpen) {
              e.preventDefault();
              openDialog("settings");
            } else {
              if (!uiContext.showSettingsModal()) {
                triggerToast(translateText("close current dialog before opening another"));
              }
            }
            break;

          // toggles sidebar
          case "Backslash":
            if (!anyDialogOpen) {
              e.preventDefault();
              toggleSideBar();
              document.querySelector("#searchInput").blur();
            } else {
              triggerToast(translateText("close current dialog before toggling sidebar"));
            }
            break;

          // reload shortcut doesn't work on macos for some reason
          case "KeyR":
            self.location.reload();
            break;

          // disabling misc webview shortcuts
          case "KeyG":
          case "KeyP":
          case "KeyU":
            e.preventDefault();
            break;
        }
      }
    });
  }

  document.addEventListener("keyup", () => {
    // resets sidebar cursor back to grab when ctrl/cmd is let go of
    for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
      sideBarGame.style.cursor = "grab";
    }

    // hides "play" tooltip from sidebar game / game card when ctrl/cmd is let go of
    for (const sideBarGame of document.querySelectorAll(".sideBarGame")) {
      sideBarGame.classList.remove("tooltip-right");
    }
    for (const gameCard of document.querySelectorAll(".gameCard")) {
      gameCard.classList.remove("tooltip-center");
    }
  });

  onMount(async () => {
    // fetches library data and populates the ui
    getData();

    // loading app by default in dark mode so there's no bright flash of white while getData fetches preferences
    document.documentElement.classList.add("dark");

    // only shows the window after the ui has been rendered
    invoke("show_window");

    addEventListeners();
    applicationStateContext.setSystemPlatform(await invoke("get_platform"));

    if (await checkIfConnectedToInternet()) {
      try {
        // checks latest version and stores it in variable
        const response = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?version=a`);
        const clearVersion = await response.json();
        applicationStateContext.setLatestVersion(clearVersion.clearVersion);

        // shows new version indicators if update is available
        applicationStateContext.latestVersion().replaceAll(".", "") >
        applicationStateContext.appVersion().replaceAll(".", "")
          ? uiContext.setShowNewVersionAvailable(true)
          : uiContext.setShowNewVersionAvailable(false);
      } catch (error) {
        triggerToast(`could not check if newer version available: ${error.message.toLowerCase()}`);
      }
    }
  });

  return (
    <>
      <ModalFrame />

      <div class="flex h-full gap-[30px] overflow-y-hidden">
        <Show when={libraryData.userSettings.showSideBar === false && applicationStateContext.windowWidth() >= 1000}>
          <button
            type="button"
            class="!absolute tooltip-delayed-left top-[32px] right-[31px] z-20 w-[25.25px] cursor-pointer p-2 duration-150 hover:bg-[#D6D6D6] motion-reduce:duration-0 dark:hover:bg-[#232323]"
            onClick={() => {
              toggleSideBar();
            }}
            data-tooltip={translateText("open sidebar")}
          >
            <ChevronArrows classProp="rotate-180" />
          </button>
        </Show>
        <Show when={libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000}>
          <SideBar />
        </Show>

        <Show
          when={
            libraryData.folders.length === 0 &&
            (applicationStateContext.searchValue() === "" || applicationStateContext.searchValue() === undefined)
          }
        >
          <div
            class={`absolute flex h-[100vh] w-full flex-col items-center justify-center overflow-y-scroll py-[20px] pr-[30px] ${
              libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000
                ? "large:pl-[17%] pl-[23%]"
                : "large:pl-[30px] pl-[30px]"
            }`}
          >
            <div class="!z-50">
              <p class="text-[#000000] dark:text-[#ffffff80]">
                {translateText("hey there! thank you so much for using clear")}
                <br />
                <br />- {translateText("add some new games using the sidebar buttons")}
                <br />
                <br />- {translateText("create new folders and drag and drop your games into them")}
                <br />
                <br />- {translateText("don't forget to check out the settings!")}
              </p>

              <div class="mt-[35px] flex gap-6">
                <button
                  type="button"
                  class="standardButton tooltip-bottom !flex !w-max !gap-3 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] bg-[#E8E8E8] dark:bg-[#232323]"
                  data-tooltip={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (libraryData.folders.steam !== undefined) {
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
                  <Show when={libraryData.folders.steam !== undefined} fallback={translateText("import Steam games")}>
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

                <LanguageSelector onSettingsPage={false} />
              </div>

              <Hotkeys onSettingsPage={false} />
            </div>
          </div>
        </Show>
        <div
          class={`!rounded-[0px] absolute h-[100vh] w-full overflow-y-scroll py-[20px] pr-[30px] ${
            libraryData.userSettings.showSideBar && applicationStateContext.windowWidth() >= 1000
              ? "large:pl-[17%] pl-[23%]"
              : "large:pl-[30px] pl-[30px]"
          }`}
        >
          <Show
            when={
              libraryData.folders &&
              (applicationStateContext.searchValue() === "" || applicationStateContext.searchValue() === undefined)
            }
          >
            <For each={libraryData.folders}>
              {(folder) => {
                return (
                  <Show when={folder.games.length !== 0 && !folder.hide}>
                    <div class="mb-[40px]">
                      <Show when={libraryData.userSettings.folderTitle}>
                        <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">{folder.name}</p>
                      </Show>
                      <div
                        class={`foldersDiv mt-4 grid gap-5 ${returnGridStyleForGameCard(
                          libraryData.userSettings.zoomLevel,
                          libraryData.userSettings.showSideBar,
                        )}`}
                      >
                        <GameCards gamesList={folder.games} />
                      </div>
                    </div>
                  </Show>
                );
              }}
            </For>
          </Show>
          <Show
            when={applicationStateContext.searchValue() !== "" && applicationStateContext.searchValue() !== undefined}
          >
            {() => {
              const searchResults = [];
              const allGameNames = [];

              if (applicationStateContext.searchValue() !== "" && applicationStateContext.searchValue() !== undefined) {
                for (const key in libraryData.games) {
                  allGameNames.push(key);
                }
              }

              for (const libraryGame of Object.keys(libraryData.games)) {
                const result = fuzzysearch(
                  applicationStateContext.searchValue(),
                  libraryGame.toLowerCase().replace("-", " "),
                );
                if (result === true) {
                  searchResults.push(libraryGame);
                }
              }

              return (
                <div>
                  <div
                    class={`foldersDiv mt-4 grid gap-5 ${returnGridStyleForGameCard(
                      libraryData.userSettings.zoomLevel,
                      libraryData.userSettings.showSideBar,
                    )}`}
                  >
                    <GameCards gamesList={searchResults} />
                  </div>
                  <div class="items-center">
                    <Show when={searchResults.length === 0}>
                      <div class="flex h-[calc(100vh-100px)] w-full items-center justify-center gap-3 align-middle">
                        <EmptyTray />
                        {translateText("no games found")}
                      </div>
                    </Show>
                  </div>
                </div>
              );
            }}
          </Show>
        </div>
      </div>

      <div
        popover
        class="toast bg-[#E8E8E8] p-[10px] text-black hover:bg-[#d6d6d6] dark:bg-[#232323] dark:text-white dark:hover:bg-[#2b2b2b]"
      >
        {applicationStateContext.toastMessage()}
      </div>

      <div id="abovePage">
        <Show when={uiContext.showLoadingModal()}>
          <Loading />
        </Show>
      </div>
    </>
  );
}

export default App;
