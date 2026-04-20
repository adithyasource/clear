import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, Show } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame } from "@/Globals.jsx";
import { openModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { libraryData } from "../../stores/libraryStore";
import { setSelectedGame } from "../../stores/selectedGameStore";
import { getImagePath } from "../../data/storage/imageStroage";

export function GameCardSideBar({ gameId, gameIndex, folderName, folderIndex }) {
  const game = () => libraryData.games[gameId];

  const [iconImageFile] = createResource(
    // track changes from the image path
    () => game().iconImagePath,
    async (path) => {
      if (!path) {
        return null;
      }
      const fullPath = await getImagePath({ type: "icon", fileName: path });
      console.log(fullPath);
      return convertFileSrc(fullPath);
    },
  );

  const icon = () => iconImageFile();

  console.log(icon());
  console.log(game().iconImagePath);

  return (
    <button
      type="button"
      class={`!flex sideBarGame cursor-grab gap-[5px] bg-transparent p-0 ${gameIndex === 0 ? "mt-4" : "mt-5"}`}
      data-tooltip={game().gameLocation ? translateText("play") : translateText("no game file")}
      data-game-id={gameId}
      draggable={true}
      onDragStart={(e) => {
        setTimeout(() => {
          e.srcElement.classList.add("dragging");
        }, 10);
        e.dataTransfer.setData("gameId", gameId);

        e.dataTransfer.setData("oldFolderName", folderName);

        e.dataTransfer.setData("fromFolderIndex", folderIndex);
        e.dataTransfer.setData("fromGameIndex", gameIndex);
      }}
      onDragEnd={(e) => {
        e.srcElement.classList.remove("dragging");
      }}
      onClick={async (e) => {
        if (e.ctrlKey) {
          openGame(game().gameLocation);
          return;
        }

        setSelectedGame(gameId);

        openModal({
          type: "gamePopUp",
          component: GamePopUpModal,
          confirmWhileClosing: false,
          onClose: () => {
            setSelectedGame();
          },
        });
      }}
    >
      <Show when={game().iconImagePath}>
        <img src={icon()} alt="" class="gameIconImage aspect-square h-[16px]" />
      </Show>
      <span class="text-[#00000080] active:text-[#0000003a] dark:text-[#ffffff80] active:dark:text-[#ffffff3a]">
        {game().name}
      </span>
    </button>
  );
}
