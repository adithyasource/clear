import { For, Show, onMount, useContext } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { fuzzysearch } from "./libraries/fuzzysearch";

import {
  GlobalContext,
  ApplicationStateContext,
  UIContext,
  getData,
  importSteamGames,
  translateText,
  updateData,
  openDialog,
  closeDialog,
  triggerToast,
  toggleSideBar,
} from "./Globals";

import "./App.css";
import "./libraries/Hint.css";

import { SideBar } from "./SideBar";
import { EditFolder } from "./modals/EditFolder";
import { EditGame } from "./modals/EditGame";
import { GamePopUp } from "./modals/GamePopUp";
import { NewFolder } from "./modals/NewFolder";
import { NewGame } from "./modals/NewGame";
import { Notepad } from "./modals/Notepad";
import { Settings } from "./modals/Settings";
import { Loading } from "./modals/Loading";
import { Toast } from "./components/Toast";
import { ChevronArrows, EmptyTray, Steam } from "./libraries/Icons";
import { GameCards } from "./components/GameCards";
import { LanguageSelector } from "./components/LanguageSelector";
import { Hotkeys } from "./components/HotKeys";
import { Style } from "./Style";

function App() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  async function closeApp() {
    invoke("close_app");
  }

  function addEventListeners() {
    function handleFirstTab(e) {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDown);
      }
    }

    function handleMouseDown() {
      document.body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDown);
      window.addEventListener("keydown", handleFirstTab);
    }

    window.addEventListener("keydown", handleFirstTab);

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    window.addEventListener("resize", () => {
      applicationStateContext.setWindowWidth(window.innerWidth);
    });

    document.addEventListener("keyup", () => {
      document.querySelectorAll(".sideBarGame").forEach((sideBarGame) => {
        sideBarGame.style.cursor = "grab";
      });

      document.querySelectorAll(".sideBarGame").forEach((sideBarGame) => {
        sideBarGame.classList.remove(
          "hint--right",
          "hint--no-animate",
          "hint--no-arrow",
        );
      });

      document.querySelectorAll(".gameCard").forEach((gameCard) => {
        gameCard.classList.remove(
          "hint--center",
          "hint--no-animate",
          "hint--no-arrow",
        );
      });
    });

    document.addEventListener("keydown", (e) => {
      let allDialogs = document.querySelectorAll("dialog");

      let anyDialogOpen = false;

      allDialogs.forEach((dialog) => {
        if (dialog.open) {
          anyDialogOpen = true;
        }
      });

      if (e.ctrlKey) {
        document.querySelectorAll(".sideBarGame").forEach((sideBarGame) => {
          sideBarGame.classList.add("hint--right");
          sideBarGame.style.cursor = "pointer";
        });

        document.querySelectorAll(".gameCard").forEach((gameCard) => {
          gameCard.classList.add("hint--center");
        });

        switch (e.code) {
          case "Equal":
            globalContext.setLibraryData("userSettings", "zoomLevel", (x) =>
              x != 2 ? (x += 1) : (x = 2),
            );

            updateData();

            break;

          case "Minus":
            globalContext.setLibraryData("userSettings", "zoomLevel", (x) =>
              x != 0 ? (x -= 1) : (x = 0),
            );

            updateData();

            break;

          case "KeyW":
            e.preventDefault();
            closeApp();

            break;

          case "KeyF":
            if (!anyDialogOpen) {
              e.preventDefault();
              document.querySelector("#searchInput").focus();
            } else {
              triggerToast(
                translateText("close current dialog before opening another"),
              );
            }

            break;

          case "KeyN":
            e.preventDefault();
            if (document.querySelector("[data-newGameModal]").open) {
              closeDialog("newGameModal");
            } else {
              if (!anyDialogOpen) {
                openDialog("newGameModal");
              } else {
                triggerToast(
                  translateText("close current dialog before opening another"),
                );
              }
            }

            break;

          case "KeyM":
            e.preventDefault();
            if (document.querySelector("[data-newFolderModal]").open) {
              closeDialog("newFolderModal");
            } else {
              if (!anyDialogOpen) {
                openDialog("newFolderModal");
              } else {
                triggerToast(
                  translateText("close current dialog before opening another"),
                );
              }
            }

            break;

          case "KeyL":
            e.preventDefault();
            if (document.querySelector("[data-notepadModal]").open) {
              closeDialog("notepadModal");
            } else {
              if (!anyDialogOpen) {
                openDialog("notepadModal");
              } else {
                triggerToast(
                  translateText("close current dialog before opening another"),
                );
              }
            }

            break;

          case "Period":
            if (document.querySelector("[data-settingsModal]").open) {
              closeDialog("settingsModal");
            } else {
              if (!anyDialogOpen) {
                e.preventDefault();
                openDialog("settingsModal");
              } else {
                triggerToast(
                  translateText("close current dialog before opening another"),
                );
              }
            }

            break;

          case "Backslash":
            if (!anyDialogOpen) {
              e.preventDefault();
              toggleSideBar();
              document.querySelector("#searchInput").blur();
            } else {
              triggerToast(
                translateText("close current dialog before toggling sidebar"),
              );
            }

            break;

          // ? Disabling Misc WebView Shortcuts

          case "KeyR":
            e.preventDefault();

          case "KeyG":
            e.preventDefault();

          case "KeyP":
            e.preventDefault();

          case "KeyU":
            e.preventDefault();
        }
      }
    });
  }

  getData();

  onMount(async () => {
    invoke("show_window");
    addEventListeners();
  });

  return (
    <>
      {/* fading out bg color to make the app loading look a bit more smoother */}
      <div className="loading pointer-events-none absolute z-[1000] flex h-screen w-screen items-center justify-center bg-[#121212]">
        <p className=""></p>
      </div>

      <div className="flex h-full gap-[30px] overflow-y-hidden">
        <Show
          when={
            globalContext.libraryData.userSettings.showSideBar == false &&
            applicationStateContext.windowWidth() >= 1000
          }>
          <button
            className="absolute right-[31px] top-[32px] z-20 w-[25.25px] rotate-180 cursor-pointer p-2 duration-150 hover:bg-[#D6D6D6] dark:hover:bg-[#232323]"
            onClick={() => {
              toggleSideBar();
            }}>
            <ChevronArrows />
          </button>
        </Show>
        <Show
          when={
            globalContext.libraryData.userSettings.showSideBar &&
            applicationStateContext.windowWidth() >= 1000
          }>
          <SideBar />
        </Show>

        <Show
          when={
            JSON.stringify(globalContext.libraryData.folders) == "{}" &&
            (applicationStateContext.searchValue() == "" ||
              applicationStateContext.searchValue() == undefined)
          }>
          <div
            className={` absolute flex h-[100vh] w-full flex-col items-center justify-center
            overflow-y-scroll py-[20px] pr-[30px]  ${
              globalContext.libraryData.userSettings.showSideBar &&
              applicationStateContext.windowWidth() >= 1000
                ? "pl-[23%] large:pl-[17%]"
                : "pl-[30px] large:pl-[30px]"
            }`}>
            <div className="!z-50">
              <p className="text-[#000000] dark:text-[#ffffff80] ">
                {translateText("hey there! thank you so much for using clear")}
                <br />
                <br />-{" "}
                {translateText("add some new games using the sidebar buttons")}
                <br />
                <br />-{" "}
                {translateText(
                  "create new folders and drag and drop your games into them",
                )}
                <br />
                <br />-{" "}
                {translateText("don't forget to check out the settings!")}
              </p>

              <div className="mt-[35px] flex gap-6">
                <button
                  className="standardButton hint--bottom !flex !w-max !gap-3 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
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

                <LanguageSelector onSettingsPage={false} />
              </div>

              <Hotkeys onSettingsPage={false} />
            </div>
          </div>
        </Show>
        <div
          className={`absolute h-[100vh] w-full overflow-y-scroll !rounded-[0px] py-[20px] pr-[30px] ${
            globalContext.libraryData.userSettings.showSideBar &&
            applicationStateContext.windowWidth() >= 1000
              ? "pl-[23%] large:pl-[17%]"
              : "pl-[30px] large:pl-[30px]"
          }`}>
          <Show
            when={
              applicationStateContext.searchValue() == "" ||
              applicationStateContext.searchValue() == undefined
            }>
            <For each={applicationStateContext.currentFolders()}>
              {(folderName) => {
                let folder = globalContext.libraryData.folders[folderName];

                return (
                  <Show when={folder.games != "" && !folder.hide}>
                    <div className="mb-[40px]">
                      <Show
                        when={
                          globalContext.libraryData.userSettings.folderTitle
                        }>
                        <p className="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                          {folder.name}
                        </p>
                      </Show>
                      <div
                        className={`foldersDiv mt-4 grid gap-5 ${
                          globalContext.libraryData.userSettings.zoomLevel == 0
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "grid-cols-4 medium:grid-cols-5 large:grid-cols-7"
                              : "grid-cols-4 medium:grid-cols-6 large:grid-cols-8"
                            : globalContext.libraryData.userSettings
                                .zoomLevel == 1
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "grid-cols-3 medium:grid-cols-4 large:grid-cols-6"
                              : "grid-cols-3 medium:grid-cols-5 large:grid-cols-7"
                            : globalContext.libraryData.userSettings
                                .zoomLevel == 2
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "grid-cols-2 medium:grid-cols-3 large:grid-cols-5"
                              : "grid-cols-2 medium:grid-cols-4 large:grid-cols-6"
                            : ""
                        }`}>
                        <GameCards gamesList={folder.games} />
                      </div>
                    </div>
                  </Show>
                );
              }}
            </For>
          </Show>

          <Show
            when={
              applicationStateContext.searchValue() != "" &&
              applicationStateContext.searchValue() != undefined
            }>
            {() => {
              let searchResults = [];
              let allGameNames = [];

              if (
                applicationStateContext.searchValue() != "" &&
                applicationStateContext.searchValue() != undefined
              ) {
                for (
                  let i = 0;
                  i < Object.values(globalContext.libraryData.games).length;
                  i++
                ) {
                  allGameNames.push(
                    Object.keys(globalContext.libraryData.games)[i],
                  );
                }
              }

              Object.keys(globalContext.libraryData.games).forEach(
                (libraryGame) => {
                  let result = fuzzysearch(
                    applicationStateContext.searchValue(),
                    libraryGame.toLowerCase().replace("-", " "),
                  );
                  if (result == true) {
                    searchResults.push(libraryGame);
                  }
                },
              );

              return (
                <div>
                  <div
                    className={`foldersDiv mt-4 grid gap-5 ${
                      globalContext.libraryData.userSettings.zoomLevel == 0
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "grid-cols-4 medium:grid-cols-5 large:grid-cols-7"
                          : "grid-cols-4 medium:grid-cols-6 large:grid-cols-8"
                        : globalContext.libraryData.userSettings.zoomLevel == 1
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "grid-cols-3 medium:grid-cols-4 large:grid-cols-6"
                          : "grid-cols-3 medium:grid-cols-5 large:grid-cols-7"
                        : globalContext.libraryData.userSettings.zoomLevel == 2
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "grid-cols-2 medium:grid-cols-3 large:grid-cols-5"
                          : "grid-cols-2 medium:grid-cols-4 large:grid-cols-6"
                        : ""
                    }`}>
                    <GameCards gamesList={searchResults} />
                  </div>
                  <div className="items-center">
                    <Show when={searchResults == ""}>
                      <div className="flex h-[calc(100vh-100px)]  w-full items-center justify-center gap-3 align-middle">
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

      <Style />
      <Toast />

      <div id="abovePage">
        <NewGame />
        <EditGame />
        <NewFolder />
        <EditFolder />
        <GamePopUp />
        <Notepad />
        <Settings />
        <Loading />
      </div>
    </>
  );
}

export default App;
