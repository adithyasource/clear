import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, For, Show } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame } from "@/services/gameService.js";
import { libraryData } from "@/stores/libraryStore";
import { openModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore.js";
import { preloadGameModalImages } from "@/utils/preloadGameImages.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { setSelectedGame } from "../../stores/selectedGameStore";

export function GameCards(props) {
  return (
    <For each={props.gamesList}>
      {(gameId, index) => {
        const game = () => libraryData.games[gameId];

        const [gridImageFile] = createResource(
          // track changes from the image path
          () => game().gridImagePath,
          async (path) => {
            if (!path) {
              return null;
            }
            const fullPath = await getImagePath({ type: "grid", fileName: path });
            return convertFileSrc(fullPath);
          },
        );

        const grid = () => gridImageFile();
        const preloadModalAssets = () => preloadGameModalImages(game());

        return (
          <button
            type="button"
            class="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={index() === 0 ? "firstGameCard" : ""}
            onPointerEnter={async () => {
              await preloadModalAssets();
            }}
            onFocus={async () => {
              await preloadModalAssets();
            }}
            onPointerMove={(e) => {
              if (e.metaKey) {
                console.log("holding meta");
              }
            }}
            data-tooltip={game().gameLocation ? translateText("common.play") : translateText("game.no_file")}
            onDragStart={(e) => {
              e.preventDefault();
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
            <Show
              when={game().favourite}
              fallback={
                <div class="relative w-full">
                  <Show
                    when={game().gridImagePath}
                    fallback={
                      <div class="relative flex items-center justify-center">
                        <Show when={!libraryData.userSettings.gameTitle}>
                          <span class="absolute z-100 max-w-[50%]!">{gameId}</span>
                        </Show>

                        <div class="relative z-10 mb-[7px] aspect-2/3 w-full bg-media-placeholder group-hover:outline-2 group-hover:outline-game-outline-group group-hover:outline-hidden" />
                      </div>
                    }
                  >
                    <div class="relative flex items-center justify-center">
                      <img
                        class="relative z-10 mb-[7px] aspect-2/3 w-full group-hover:outline-2 group-hover:outline-game-outline-group group-hover:outline-hidden"
                        src={grid()}
                        alt=""
                      />
                    </div>
                  </Show>
                </div>
              }
            >
              <div class="relative w-full">
                <Show
                  when={grid()}
                  fallback={
                    <div class="relative flex items-center justify-center">
                      <Show when={!libraryData.userSettings.gameTitle}>
                        <span class="absolute z-100 max-w-[50%]!">{gameId}</span>
                      </Show>
                      <div class="relative z-10 mb-[7px] aspect-2/3 w-full bg-media-placeholder outline-4 outline-game-outline outline-hidden duration-200 hover:outline-game-outline-hover motion-reduce:duration-100 group-hover:outline-game-outline-hover" />
                    </div>
                  }
                >
                  <img
                    class="relative z-10 mb-[7px] outline-4 outline-game-outline outline-hidden duration-200 hover:outline-game-outline-hover motion-reduce:duration-100 group-hover:outline-game-outline-hover"
                    src={grid()}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div class="absolute inset-0 opacity-80 duration-500 motion-reduce:duration-100 dark:bg-blend-screen dark:blur-[30px] dark:group-hover:blur-[50px]">
                  <img
                    class="absolute inset-0 opacity-0 duration-500 motion-reduce:duration-100 dark:opacity-40 dark:group-hover:opacity-60"
                    src={grid()}
                    alt=""
                  />
                  <div class="aspect-2/3 w-full bg-media-glow" alt="" />
                </div>
              </div>
            </Show>
            <Show when={libraryData.userSettings.gameTitle}>
              <div class="flex items-start justify-between">
                <span class="text-left text-foreground">{game().name}</span>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
