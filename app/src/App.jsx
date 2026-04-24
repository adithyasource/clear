// biome-ignore assist/source/organizeImports: <explanation>

import { createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { ModalFrame } from "@/components/modal/ModalFrame";
import { SideBar } from "@/components/sidebar/SideBar.jsx";
import { GameCards } from "@/components/ui/GameCards.jsx";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { ChevronArrows, EmptyTray, Steam } from "@/libraries/Icons.jsx";
import { fuzzysearch } from "@/utils/fuzzysearch.js";
import { translateText } from "@/utils/translateText";
import { importSteamGames } from "./Globals.jsx";
import "./App.css";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Toast } from "@/components/Toast.jsx";
import { getData } from "@/services/libraryService.js";
import { triggerToast } from "@/stores/toastStore.js";
import { NewFolderModal } from "./components/modal/NewFolderModal.jsx";
import { NewGameModal } from "./components/modal/NewGameModal.jsx";
import { NotepadModal } from "./components/modal/NotepadModal.jsx";
import { SettingsModal } from "./components/modal/SettingsModal.jsx";
import { ContextMenu } from "./components/ui/ContextMenu.jsx";
import { writeUpdateData } from "./services/libraryService.js";
import { toggleSideBar } from "./services/userSettingsService.js";
import { SYSTEM_PLATFORM, setUserIsTabbing, setWindowWidth, windowWidth } from "./stores/applicationStore.js";
import { libraryData, setLibraryData } from "./stores/libraryStore.js";
import { modalState, openModal } from "./stores/modalStore.js";
import { search } from "./stores/searchStore.js";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";

function App() {
  const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] = createSignal(false);

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

  const searchResults = createMemo(() => {
    const query = search()?.toLowerCase().trim();
    if (!query) return;

    const searchResults = [];

    for (const id in libraryData.games) {
      const game = libraryData.games[id];
      const result = fuzzysearch(search(), game.name.toLowerCase().replace("-", " "));
      if (result === true) {
        searchResults.push(id);
      }

      console.log(searchResults);
    }
    return searchResults;
  });

  function handleTabAndMouseBehaviour() {
    // adds user-is-tabbing to body whenever tab is used
    // used for changing tooltip delay

    function handleFirstTab(e) {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        self.removeEventListener("keydown", handleFirstTab);
        self.addEventListener("mousedown", handleMouseDown);
        setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
      }
    }

    function handleMouseDown() {
      document.body.classList.remove("user-is-tabbing");
      self.removeEventListener("mousedown", handleMouseDown);
      self.addEventListener("keydown", handleFirstTab);
      setUserIsTabbing(document.body.classList.contains("user-is-tabbing"));
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
      setWindowWidth(self.innerWidth);
    });

    // keyboard handling
    document.addEventListener("keydown", (e) => {
      const modifierKey = SYSTEM_PLATFORM === "windows" ? "ctrlKey" : "metaKey";

      if (e[modifierKey]) {
        // "play" tooltip added to sidebar game and game card if user is also hovering on a specific element
        for (const gameCardSidebar of document.querySelectorAll(".game-card-sidebar")) {
          gameCardSidebar.classList.add("tooltip-right");
          gameCardSidebar.style.cursor = "pointer";
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
            writeUpdateData();
            break;

          // decrease game card zoom level
          case "Minus":
            setLibraryData("userSettings", "zoomLevel", (zoomLevel) => {
              return zoomLevel !== 0 ? zoomLevel - 1 : 0;
            });
            writeUpdateData();
            break;

          // closes the app
          case "KeyW":
            e.preventDefault();
            getCurrentWindow().close();
            break;

          // focuses game search bar
          case "KeyF":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog"));
              return;
            }
            document.querySelector("#searchInput").focus();
            break;

          // opens new game modal
          case "KeyN":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog before opening another"));
              return;
            }
            openModal({ type: "newGame", component: NewGameModal });
            break;

          // opens new folder modal
          case "KeyM":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog before opening another"));
              return;
            }
            openModal({ type: "newFolder", component: NewFolderModal });
            break;

          // opens notepad modal
          case "KeyL":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog before opening another"));
              return;
            }
            openModal({ type: "notepad", component: NotepadModal });
            break;

          // opens settings modal
          case "Comma":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog before opening another"));
              return;
            }
            openModal({ type: "settings", component: SettingsModal });
            break;

          // toggles sidebar
          case "Backslash":
            e.preventDefault();
            if (modalState()) {
              triggerToast(translateText("close current dialog before toggling sidebar"));
              return;
            }

            toggleSideBar();

            document.querySelector("#searchInput")?.blur();
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
    for (const gameCardSidebar of document.querySelectorAll(".game-card-sidebar")) {
      gameCardSidebar.style.cursor = "grab";
    }

    // hides "play" tooltip from sidebar game / game card when ctrl/cmd is let go of
    for (const gameCardSidebar of document.querySelectorAll(".game-card-sidebar")) {
      gameCardSidebar.classList.remove("tooltip-right");
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

    addEventListeners();

    try {
      await checkIfConnectedToInternet();
      await checkIfConnectedToServer();
    } catch (err) {
      triggerToast(err.message);
    }
  });

  return (
    <>
      <ContextMenu />
      <ModalFrame />

      <div class="flex gap-[30px]">
        <Show when={libraryData.userSettings.showSideBar === false && windowWidth() >= 1000}>
          <button
            type="button"
            class="absolute! tooltip-delayed-left top-[32px] right-[31px] z-20 w-[25.25px] cursor-pointer p-2 duration-150 hover:bg-[#D6D6D6] motion-reduce:duration-0 dark:hover:bg-[#232323]"
            onClick={() => {
              toggleSideBar();
            }}
            data-tooltip={translateText("open sidebar")}
          >
            <ChevronArrows classProp="rotate-180" />
          </button>
        </Show>
        <Show when={libraryData.userSettings.showSideBar && windowWidth() >= 1000}>
          <SideBar />
        </Show>
        <Show when={libraryData.folders.length === 0}>
          <div
            class={`absolute flex h-screen w-full flex-col items-center justify-center overflow-y-scroll py-[20px] pr-[30px] ${
              libraryData.userSettings.showSideBar && windowWidth() >= 1000
                ? "large:pl-[17%] pl-[23%]"
                : "large:pl-[30px] pl-[30px]"
            }`}
          >
            <div class="z-50!">
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
                  class="standardButton tooltip-bottom flex! w-max! gap-3! bg-[#E8E8E8] text-black! hover:bg-[#d6d6d6]! dark:bg-[#232323] dark:text-white! dark:hover:bg-[#2b2b2b]!"
                  data-tooltip={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (libraryData.folders.steam !== undefined) {
                      showImportAndOverwriteConfirm() ? importSteamGames() : setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}
                >
                  <Show when={libraryData.folders.steam !== undefined} fallback={translateText("import Steam games")}>
                    <Show
                      when={showImportAndOverwriteConfirm() === true}
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
          class={`h-screen w-full overflow-y-scroll rounded-none! py-5 ${!libraryData.userSettings.showSideBar || windowWidth() <= 1000 ? "px-7" : "pr-7"}`}
        >
          <Show when={libraryData.folders && !search()}>
            <For each={libraryData.folders}>
              {(folder) => {
                return (
                  <Show when={folder.games.length !== 0 && !folder.hide}>
                    <div class="mb-[40px]">
                      <Show when={libraryData.userSettings.folderTitle}>
                        <h1 class="title">{folder.name}</h1>
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

          <Show when={search()}>
            <div>
              <div
                class={`foldersDiv mt-4 grid gap-5 ${returnGridStyleForGameCard(
                  libraryData.userSettings.zoomLevel,
                  libraryData.userSettings.showSideBar,
                )}`}
              >
                <GameCards gamesList={searchResults()} />
              </div>
              <div class="items-center">
                <Show when={searchResults()?.length === 0}>
                  <div class="flex h-[calc(100vh-100px)] w-full items-center justify-center gap-3 align-middle">
                    <EmptyTray />
                    {translateText("no games found")}
                  </div>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Toast />
    </>
  );
}

export default App;
