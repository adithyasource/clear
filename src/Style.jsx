import { useContext } from "solid-js";

import { GlobalContext } from "./Globals";

export function Style() {
  const globalContext = useContext(GlobalContext);

  return (
    <style jsx>{`
      .titleBarText {
        font-family: ${globalContext.libraryData.userSettings.fontName ===
        "sans serif"
          ? "Segoe UI"
          : globalContext.libraryData.userSettings.fontName === "serif"
          ? "Times New Roman"
          : "IBM Plex Mono, Consolas"};
      }

      * {
        font-family: ${globalContext.libraryData.userSettings.fontName ===
        "sans serif"
          ? "Helvetica, Arial, sans-serif"
          : globalContext.libraryData.userSettings.fontName === "serif"
          ? "Times New Roman"
          : "IBM Plex Mono, Consolas"};
        color: ${globalContext.libraryData.userSettings.currentTheme === "light"
          ? "#000000"
          : "#ffffff"};
      }

      *:not(body, svg, #loading, .sideBarGame, .gameIconImage),
      [class*="hint--"]:after {
        border-radius: ${globalContext.libraryData.userSettings.roundedBorders
          ? "6px"
          : "0px"};
      }

      .currentlyDragging {
        box-shadow: 0 -3px 0 0 #646464;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      body.user-is-tabbing button:focus,
      body.user-is-tabbing input:focus,
      body.user-is-tabbing select:focus {
        outline: 1px solid
          ${globalContext.libraryData.userSettings.currentTheme === "light"
            ? "#000000"
            : "#ffffff"};
      }
    `}</style>
  );
}
