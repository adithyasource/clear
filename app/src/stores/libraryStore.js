import { createStore } from "solid-js/store";

export const [libraryData, setLibraryData] = createStore({
  // default values
  games: [],
  folders: [],
  notepad: "",
  userSettings: {
    roundedBorders: true,
    showSideBar: true,
    gameTitle: true,
    folderTitle: true,
    quitAfterOpen: true,
    fontName: "sans serif",
    language: "en",
    currentTheme: "dark",
    zoomLevel: 1,
  },
});
