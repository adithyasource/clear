import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, For, Show } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame } from "@/Globals.jsx";
import { openModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { libraryData } from "@/stores/libraryStore";
import { selectedGame, setSelectedGame } from "../../stores/selectedGameStore";

export function GameCards(props) {
  return (
    <For each={props.gamesList}>
      {(gameId, index) => {
        const game = libraryData.games[gameId];

        const [gridImageFile] = createResource(
          () => gameId,
          async () => {
            if (!game.gridImagePath) {
              return null;
            }
            const path = await getImagePath({ type: "grid", fileName: game.gridImagePath });
            return convertFileSrc(path);
          },
        );

        const grid = () => gridImageFile();

        return (
          <button
            type="button"
            class="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={index() === 0 ? "firstGameCard" : ""}
            data-tooltip={game.location ? translateText("play") : translateText("no game file")}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={async (e) => {
              if (e.ctrlKey && game.location) {
                openGame(game.location);
                return;
              }
              await setSelectedGame(gameId);

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
              when={game.favourite}
              fallback={
                <div class="relative w-full">
                  <Show
                    when={game.gridImagePath}
                    fallback={
                      <div class="relative flex items-center justify-center">
                        <Show when={!libraryData.userSettings.gameTitle}>
                          <span class="!max-w-[50%] absolute z-[100]">{gameId}</span>
                        </Show>

                        <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] group-hover:outline-none group-hover:outline-[#0000001f] group-hover:outline-[2px] dark:bg-[#1C1C1C] dark:group-hover:outline-[#ffffff1f]" />
                      </div>
                    }
                  >
                    <div class="relative flex items-center justify-center">
                      <img
                        class="relative z-10 mb-[7px] aspect-[2/3] w-full group-hover:outline-none group-hover:outline-[#0000001f] group-hover:outline-[2px] dark:group-hover:outline-[#ffffff1f]"
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
                        <span class="!max-w-[50%] absolute z-[100]">{gameId}</span>
                      </Show>
                      <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] outline-none outline-[#0000001c] outline-[4px] duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:bg-[#1C1C1C] dark:outline-[#ffffff1a] dark:outline-[2px] dark:group-hover:outline-[#ffffff3b]" />
                    </div>
                  }
                >
                  <img
                    class="relative z-10 mb-[7px] outline-none outline-[#0000001c] outline-[4px] duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:outline-[#ffffff1a] dark:outline-[2px] dark:group-hover:outline-[#ffffff3b]"
                    src={grid()}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div class="absolute inset-0 duration-500 motion-reduce:duration-100 dark:bg-blend-screen dark:blur-[30px] dark:group-hover:blur-[50px]">
                  <img
                    class="absolute inset-0 opacity-0 duration-500 motion-reduce:duration-100 dark:opacity-[40%] dark:group-hover:opacity-60"
                    src={imagePath(gameId) ? convertFileSrc(imagePath(gameId)) : ""}
                    alt=""
                  />
                  <div class="aspect-[2/3] w-full bg-[#000] opacity-[0%] dark:bg-[#fff] dark:opacity-[10%]" alt="" />
                </div>
              </div>
            </Show>
            <Show when={libraryData.userSettings.gameTitle}>
              <div class="flex items-start justify-between">
                <span class="text-[#000000] dark:text-white">{game.name}</span>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
