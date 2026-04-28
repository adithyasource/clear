import { createEffect, createMemo, For, onMount, Show } from "solid-js";
import { ModalFrame } from "@/components/modal/ModalFrame";
import { SideBar } from "@/components/sidebar/SideBar.jsx";
import { GameCards } from "@/components/ui/GameCards.jsx";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { ChevronArrows, EmptyTray, Steam } from "@/libraries/Icons.jsx";
import { getErrorMessage, logError } from "@/utils/errorHandling";
import { fuzzysearch } from "@/utils/fuzzysearch.js";
import { translateText } from "@/utils/translateText";
import "./App.css";
import { Toast } from "@/components/Toast.jsx";
import { ContextMenu } from "@/components/ui/ContextMenu.jsx";
import { getData } from "@/services/libraryService.js";
import { importSteamGames } from "@/services/steamService.js";
import { triggerToast } from "@/stores/toastStore.js";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";
import { addEventListeners } from "./services/keyboardService.js";
import { toggleSideBar } from "./services/userSettingsService.js";
import { initApplicationStore, windowWidth } from "./stores/applicationStore.js";
import { libraryData } from "./stores/libraryStore.js";
import { closeModal, openModal } from "./stores/modalStore.js";
import { search } from "./stores/searchStore.js";

// import { checkForUpdatesAndNotify } from "@/services/updaterService.js";

function App() {
  async function handleImportSteamGames() {
    try {
      openModal({
        type: "loading",
        component: LoadingModal,
      });

      await importSteamGames();

      closeModal(true);
    } catch (err) {
      closeModal(true);
      triggerToast(`error: ${err.message}`);
    }
  }

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

  onMount(async () => {
    self.addEventListener("error", (event) => {
      logError("app.windowError", event.error ?? new Error(event.message));
    });

    self.addEventListener("unhandledrejection", (event) => {
      logError("app.unhandledRejection", event.reason);
      triggerToast(getErrorMessage(event.reason));
    });

    // fetches library data and populates the ui
    try {
      await getData();
    } catch (err) {
      triggerToast(err.message);
    }

    initApplicationStore();

    // loading app by default in dark mode so there's no bright flash of white while getData fetches preferences
    document.documentElement.classList.add("dark");

    addEventListeners();

    try {
      await checkIfConnectedToInternet();
      await checkIfConnectedToServer();
    } catch (err) {
      triggerToast(err.message);
    }

    // try {
    //   await checkForUpdatesAndNotify();
    // } catch (err) {
    // triggerToast(err.message);
    // }
  });

  return (
    <>
      <ContextMenu />
      <ModalFrame />

      <div class="flex gap-7.5">
        <Show when={libraryData.userSettings.showSideBar === false && windowWidth() >= 1000}>
          <button
            type="button"
            class="absolute! tooltip-delayed-left top-8 right-7 z-20 w-[25.25px] cursor-pointer p-2 duration-150 hover:bg-[#D6D6D6] motion-reduce:duration-0 dark:hover:bg-[#232323]"
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
            class={`absolute flex h-screen w-full flex-col items-center justify-center overflow-y-scroll py-5 pr-7.5 ${
              libraryData.userSettings.showSideBar && windowWidth() >= 1000
                ? "large:pl-[17%] pl-[23%]"
                : "large:pl-7.5 pl-7.5"
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

              <div class="mt-8.5 flex gap-6">
                <button
                  type="button"
                  class="standardButton tooltip-bottom icon-btn w-max!"
                  data-tooltip={translateText("might not work perfectly!")}
                  onClick={handleImportSteamGames}
                >
                  <Steam />
                </button>

                <LanguageSelector onSettingsPage={false} />
              </div>

              <Hotkeys onSettingsPage={false} />
            </div>
          </div>
        </Show>

        {/* seperating out pr and pl here and adding it back in the folder is because we want to fix the style for the tabbing */}
        <div
          class={`h-screen w-full overflow-y-scroll rounded-none! py-5 ${!libraryData.userSettings.showSideBar || windowWidth() <= 1000 ? "pr-7 pl-5" : "pr-7"}`}
        >
          <Show when={libraryData.folders && !search()}>
            <For each={libraryData.folders}>
              {(folder) => {
                return (
                  <Show when={folder.games.length !== 0 && !folder.hide}>
                    <div class="mb-10 pl-2">
                      <Show when={libraryData.userSettings.folderTitle}>
                        <h1 class="title">{folder.name}</h1>
                      </Show>
                      <div
                        class={`mt-4 grid gap-5 ${returnGridStyleForGameCard(
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
                class={`mt-4 grid gap-5 ${returnGridStyleForGameCard(
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
