import { getCurrentWindow } from "@tauri-apps/api/window";
import { NewFolderModal } from "@/components/modal/NewFolderModal.jsx";
import { NewGameModal } from "@/components/modal/NewGameModal.jsx";
import { NotepadModal } from "@/components/modal/NotepadModal.jsx";
import { SettingsModal } from "@/components/modal/SettingsModal.jsx";
import { writeUpdateData } from "@/services/libraryService.js";
import { toggleSideBar } from "@/services/userSettingsService.js";
import { setUserIsTabbing, systemPlatform } from "@/stores/applicationStore";
import { setLibraryData } from "@/stores/libraryStore.js";
import { modalState, openModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore.js";
import { translateText } from "@/utils/translateText";

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

export function addEventListeners() {
  handleTabAndMouseBehaviour();

  // disabling right click
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  // storing window width in application state context
  self.addEventListener("resize", () => {
    setWindowWidth(self.innerWidth);
  });

  // keyboard handling
  document.addEventListener("keydown", (e) => {
    const modifierKey = systemPlatform() === "windows" ? "ctrlKey" : "metaKey";

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
          openModal({ type: "newGame", component: NewGameModal, confirmWhileClosing: true });
          break;

        // opens new folder modal
        case "KeyM":
          e.preventDefault();
          if (modalState()) {
            triggerToast(translateText("close current dialog before opening another"));
            return;
          }
          openModal({ type: "newFolder", component: NewFolderModal, confirmWhileClosing: true });
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
        case "KeyJ":
          e.preventDefault();
          break;
      }
    }
  });

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
}
