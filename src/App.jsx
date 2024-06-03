import { For, Show, onMount, useContext } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import Fuse from "fuse.js";
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

  document.addEventListener("keydown", (e) => {
    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].style.cursor = "pointer";
    }

    if (e.ctrlKey) {
      for (
        let i = 0;
        i < document.querySelectorAll(".sideBarGame").length;
        i++
      ) {
        document
          .querySelectorAll(".sideBarGame")
          [i].classList.add("hint--right");
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document.querySelectorAll(".gameCard")[i].classList.add("hint--center");
      }
    }

    if (e.ctrlKey && e.code == "Equal") {
      globalContext.setLibraryData("userSettings", "zoomLevel", (x) =>
        x != 2 ? (x += 1) : (x = 2),
      );

      updateData();
    }

    if (e.ctrlKey && e.code == "Minus") {
      globalContext.setLibraryData("userSettings", "zoomLevel", (x) =>
        x != 0 ? (x -= 1) : (x = 0),
      );

      updateData();
    }

    if (e.ctrlKey && e.code == "KeyW") {
      e.preventDefault();
      closeApp();
    }

    let allDialogs = [];

    allDialogs = document.querySelectorAll("dialog");

    let anyDialogOpen = false;

    allDialogs.forEach((dialog) => {
      if (dialog.open) {
        anyDialogOpen = true;
      }
    });

    if (e.ctrlKey && e.code == "KeyF") {
      if (!anyDialogOpen) {
        e.preventDefault();
        document.querySelector("#searchInput").focus();
      } else {
        triggerToast(
          translateText("close current dialog before opening another"),
        );
      }
    }

    if (e.ctrlKey && e.code == "KeyN") {
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
    }

    if (e.ctrlKey && e.code == "KeyM") {
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
    }
    if (e.ctrlKey && e.code == "KeyL") {
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
    }
    if (e.ctrlKey && e.code == "Period") {
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
    }

    if (e.ctrlKey && e.code == "Backslash") {
      if (!anyDialogOpen) {
        e.preventDefault();
        toggleSideBar();
        document.querySelector("#searchInput").blur();
      } else {
        triggerToast(
          translateText("close current dialog before toggling sidebar"),
        );
      }
    }

    if (e.ctrlKey && e.code == "KeyR") {
      e.preventDefault();
    }

    // ? Disabling Misc WebView Shortcuts

    if (e.ctrlKey && e.code == "KeyG") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyP") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyU") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyU") {
      e.preventDefault();
    }
  });

  async function closeApp() {
    invoke("close_app");
  }

  async function toggleSideBar() {
    applicationStateContext.setSearchValue("");

    globalContext.setLibraryData("userSettings", "showSideBar", (x) => !x);

    await updateData();
    getData();
  }

  function addEventListeners() {
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    document.addEventListener("keyup", (e) => {
      for (
        let i = 0;
        i < document.querySelectorAll(".sideBarGame").length;
        i++
      ) {
        document.querySelectorAll(".sideBarGame")[i].style.cursor = "grab";
      }

      for (
        let i = 0;
        i < document.querySelectorAll(".sideBarGame").length;
        i++
      ) {
        document.querySelectorAll(".sideBarGame")[i].classList.remove(
          "hint--right",
          "hint--no-animate",

          "hint--no-arrow",
        );
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document.querySelectorAll(".gameCard")[i].classList.remove(
          "hint--center",
          "hint--no-animate",

          "hint--no-arrow",
        );
      }
    });

    let body = document.body;

    function handleFirstTab(e) {
      if (e.key === "Tab") {
        body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDown);
      }
    }

    function handleMouseDown() {
      body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDown);
      window.addEventListener("keydown", handleFirstTab);
    }

    window.addEventListener("keydown", handleFirstTab);
  }

  getData();

  onMount(async () => {
    window.addEventListener("resize", () => {
      applicationStateContext.setWindowWidth(window.innerWidth);
    });
    invoke("show_window");
    addEventListeners();
  });

  return (
    <>
      {
        // * fading out bg color to make the app loading look a
        // * bit more smoother
      }

      <div className="pointer-events-none items-center justify-center flex loading w-screen h-screen bg-[#121212] absolute z-[1000]">
        <p className=""></p>
      </div>

      <Style />

      <Toast />

      <div className="h-full flex gap-[30px] overflow-y-hidden">
        <Show
          when={
            globalContext.libraryData.userSettings.showSideBar == false &&
            applicationStateContext.windowWidth() >= 1000
          }>
          <button
            className="absolute right-[31px] top-[32px] z-20 rotate-180 cursor-pointer hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px]"
            onClick={toggleSideBar}>
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
            className={` flex items-center justify-center flex-col w-full absolute h-[100vh]
            overflow-y-scroll py-[20px] pr-[30px]  ${
              globalContext.libraryData.userSettings.showSideBar &&
              applicationStateContext.windowWidth() >= 1000
                ? "pl-[23%] large:pl-[17%]"
                : "pl-[30px] large:pl-[30px]"
            }`}>
            <div className="!z-50">
              <p className="dark:text-[#ffffff80] text-[#000000] ">
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
                  className="standardButton hint--bottom !flex !w-max !gap-3 dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b]"
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
          className={`w-full absolute h-[100vh] overflow-y-scroll py-[20px] pr-[30px] !rounded-[0px] ${
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
                        <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                          {folder.name}
                        </p>
                      </Show>
                      <div
                        className={`grid gap-5 mt-4 foldersDiv ${
                          globalContext.libraryData.userSettings.zoomLevel == 0
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "medium:grid-cols-5 grid-cols-4 large:grid-cols-7"
                              : "medium:grid-cols-6 grid-cols-4 large:grid-cols-8"
                            : globalContext.libraryData.userSettings
                                .zoomLevel == 1
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "medium:grid-cols-4 grid-cols-3 large:grid-cols-6"
                              : "medium:grid-cols-5 grid-cols-3 large:grid-cols-7"
                            : globalContext.libraryData.userSettings
                                .zoomLevel == 2
                            ? globalContext.libraryData.userSettings.showSideBar
                              ? "medium:grid-cols-3 grid-cols-2 large:grid-cols-5"
                              : "medium:grid-cols-4 grid-cols-2 large:grid-cols-6"
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

              let fuse = new Fuse(
                Object.values(globalContext.libraryData.games),
                {
                  threshold: 0.5,
                  keys: ["name"],
                },
              );

              for (
                let i = 0;
                i < fuse.search(applicationStateContext.searchValue()).length;
                i++
              ) {
                searchResults.push(
                  fuse.search(applicationStateContext.searchValue())[i].item[
                    "name"
                  ],
                );
              }

              return (
                <div>
                  <div
                    className={`grid gap-5 mt-4 foldersDiv ${
                      globalContext.libraryData.userSettings.zoomLevel == 0
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "medium:grid-cols-5 grid-cols-4 large:grid-cols-7"
                          : "medium:grid-cols-6 grid-cols-4 large:grid-cols-8"
                        : globalContext.libraryData.userSettings.zoomLevel == 1
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "medium:grid-cols-4 grid-cols-3 large:grid-cols-6"
                          : "medium:grid-cols-5 grid-cols-3 large:grid-cols-7"
                        : globalContext.libraryData.userSettings.zoomLevel == 2
                        ? globalContext.libraryData.userSettings.showSideBar
                          ? "medium:grid-cols-3 grid-cols-2 large:grid-cols-5"
                          : "medium:grid-cols-4 grid-cols-2 large:grid-cols-6"
                        : ""
                    }`}>
                    <GameCards gamesList={searchResults} />
                  </div>
                  <div className="items-center">
                    <Show when={searchResults == ""}>
                      <div className="flex items-center  justify-center w-full h-[calc(100vh-100px)] gap-3 align-middle">
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
