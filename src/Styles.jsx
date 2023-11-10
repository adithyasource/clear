import {
  fontName,
  secondaryColor,
  roundedBorders,
  secondaryColorForBlur,
  primaryColor,
} from "./Signals";

export function Styles() {
  return (
    <style jsx>{`
      button,
      input {
        background-color: ${secondaryColor()};
        border: 0;
        padding: 10px;
        border-radius: ${roundedBorders() ? "6px" : "0px"};
      }
      .sideBarFolder {
        margin: 0px 0px 12px 0px;
        background: ${secondaryColor()};
        border-radius: ${roundedBorders() ? "6px" : "0px"};
        display: flex;
        justify-items: center;
        flex-direction: column;
        padding: 10px;
        justify-content: space-between;
      }
      .titleBarText {
        font-family: ${fontName() == "Sans Serif"
          ? "Segoe UI"
          : fontName() == "Serif"
          ? "Times New Roman"
          : "IBM Plex Mono, Consolas"};
      }
      * {
        font-family: ${fontName() == "Sans Serif"
          ? "Helvetica, Arial, sans-serif"
          : fontName() == "Serif"
          ? "Times New Roman"
          : "IBM Plex Mono, Consolas"};
        font-weight: normal;
        color: #ffffff;
        font-size: 14px;
        user-select: none;
        margin: 0;
        padding: 0;
        color-scheme: dark;
      }
      ::-webkit-scrollbar-thumb {
        background: ${secondaryColor()};
        border-radius: ${roundedBorders() ? "10px" : "0px"};
      }
      #sideBarFolders:hover::-webkit-scrollbar-thumb {
        background: ${secondaryColorForBlur()};
      }
      html,
      body {
        background-color: ${primaryColor()};
        height: 100%;
        margin: 0;
      }
      .functionalInteractables {
        background-color: ${secondaryColor()};
      }
      .bgBlur {
        backdrop-filter: blur(10px) !important;
        background-color: ${secondaryColorForBlur()} !important;
        border-radius: ${roundedBorders() ? "6px" : "0px"};
      }
      .tooltip {
        background: #272727cc;
        backdrop-filter: blur(10px);
        border: 0.5px solid #ffffff10;
        color: #fff;
        padding: 8px 10px;
        font-family: Helvetica;
        line-height: 12px;
        white-space: nowrap;
        border-radius: ${roundedBorders() ? "6px" : "0px"};
      }
    `}</style>
  );
}
