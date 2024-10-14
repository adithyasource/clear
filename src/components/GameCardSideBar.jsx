import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/core";
import { openDialog, openGame, translateText } from "../Globals";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext
} from "../Globals";

export function GameCardSideBar(props) {
  const globalContext = useContext(GlobalContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <button
      type="button"
      class={`!flex gap-[5px] bg-transparent ${props.index === 0 ? "mt-4" : "mt-5"
        }  sideBarGame cursor-grab p-0`}
      data-tooltip={
        globalContext.libraryData.games[props.gameName].location
          ? translateText("play")
          : translateText("no game file")
      }
      draggable={true}
      onDragStart={(e) => {
        setTimeout(() => {
          e.srcElement.classList.add("dragging");
        }, 10);
        e.dataTransfer.setData("gameName", props.gameName);

        e.dataTransfer.setData("oldFolderName", props.folderName);
      }}
      onDragEnd={(e) => {
        e.srcElement.classList.remove("dragging");
      }}
      onClick={async (e) => {
        if (e.ctrlKey) {
          openGame(globalContext.libraryData.games[props.gameName].location);
          return;
        }
        await selectedDataContext.setSelectedGame(
          globalContext.libraryData.games[props.gameName]
        );
        openDialog("gamePopUp");
      }}>
      <Show when={globalContext.libraryData.games[props.gameName].icon}>
        <img
          src={convertFileSrc(
            `${applicationStateContext.appDataDirPath()}\\icons\\${globalContext.libraryData.games[props.gameName].icon
            }`
          )}
          alt=""
          class="aspect-square h-[16px] gameIconImage"
        />
      </Show>
      <span class="text-[#00000080] active:text-[#0000003a] dark:text-[#ffffff80] active:dark:text-[#ffffff3a]">
        {props.gameName}
      </span>
    </button>
  );
}
