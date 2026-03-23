import { convertFileSrc } from "@tauri-apps/api/core";
import { Show, useContext } from "solid-js";
import { ApplicationStateContext, locationJoin, openGame, SelectedDataContext, translateText } from "../../Globals.jsx";
import { openModal } from "../../stores/modalStore.js";
import { GamePopUpModal } from "../modal/GamePopUp.jsx";

export function GameCardSideBar({ gameId, game, index, folderName }) {
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  console.log(game);

  return (
    <button
      type="button"
      class={`!flex sideBarGame cursor-grab gap-[5px] bg-transparent p-0 ${index === 0 ? "mt-4" : "mt-5"}`}
      data-tooltip={game.gameLocation ? translateText("play") : translateText("no game file")}
      draggable={true}
      onDragStart={(e) => {
        setTimeout(() => {
          e.srcElement.classList.add("dragging");
        }, 10);
        e.dataTransfer.setData("gameName", gameId);

        e.dataTransfer.setData("oldFolderName", folderName);
      }}
      onDragEnd={(e) => {
        e.srcElement.classList.remove("dragging");
      }}
      onClick={async (e) => {
        if (e.ctrlKey) {
          openGame(game.gameLocation);
          return;
        }
        await selectedDataContext.setSelectedGame(gameId);

        openModal({ type: "gamePopUp", component: GamePopUpModal, confirmWhileClosing: false });
      }}
    >
      <Show when={game.icon}>
        <img
          src={convertFileSrc(locationJoin([applicationStateContext.appDataDirPath(), "icons", game.icon]))}
          alt=""
          class="gameIconImage aspect-square h-[16px]"
        />
      </Show>
      <span class="text-[#00000080] active:text-[#0000003a] dark:text-[#ffffff80] active:dark:text-[#ffffff3a]">
        {game.name}
      </span>
    </button>
  );
}
