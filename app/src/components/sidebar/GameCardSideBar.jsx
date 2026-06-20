import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, Show } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame } from "@/services/gameService.js";
import { openModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore.js";
import { preloadGameModalImages } from "@/utils/preloadGameImages.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { libraryData } from "../../stores/libraryStore";
import { setSelectedGame } from "../../stores/selectedGameStore";

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
  const preloadModalAssets = () => preloadGameModalImages(game());

  console.log(icon());
  console.log(game().iconImagePath);

  return (
    <button
      type="button"
      class={`flex! game-card-sidebar w-full cursor-grab items-center gap-2.5 p-0 ${gameIndex === 0 ? "mt-4" : "mt-5"}`}
      data-tooltip={game().gameLocation ? translateText("play") : translateText("no game file")}
      data-game-id={gameId}
      draggable={true}
      onPointerEnter={async () => {
        await preloadModalAssets();
      }}
      onFocus={async () => {
        await preloadModalAssets();
      }}
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
        if (e.ctrlKey && game().gameLocation) {
          try {
            const res = await openGame(game().gameLocation);
            if (res?.ok) {
              triggerToast(res.message);
            }
          } catch (err) {
            triggerToast(err.message);
          }
          return;
        }

        setSelectedGame(gameId);
        await preloadModalAssets();

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
        <img src={icon()} alt="" class="game-card-icon aspect-square h-[16px]" />
      </Show>
      <span class="truncate-text max-w-[85%] text-left text-muted transition active:text-muted-strong">
        {game().name}
      </span>
    </button>
  );
}
