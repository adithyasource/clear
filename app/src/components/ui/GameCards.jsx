import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, For, Show } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame } from "@/Globals.jsx";
import { openModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { libraryData } from "@/stores/libraryStore";
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

        return (
          <button
            type="button"
            class="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={index() === 0 ? "firstGameCard" : ""}
            onPointerMove={(e) => {
              if (e.metaKey) {
                console.log("holding meta");
              }
            }}
            data-tooltip={game().gameLocation ? translateText("play") : translateText("no game file")}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={async (e) => {
              if (e.ctrlKey && game().gameLocation) {
                openGame(game().gameLocation);
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
              when={game().favourite}
              fallback={
                <div class="relative w-full">
                  <Show
                    when={game().gridImagePath}
                    fallback={
                      <div class="relative flex items-center justify-center">
                        <Show when={!libraryData.userSettings.gameTitle}>
                          <span class="max-w-[50%]! absolute z-100">{gameId}</span>
                        </Show>

                        <div class="relative z-10 mb-[7px] aspect-2/3 w-full bg-[#F1F1F1] group-hover:outline-hidden group-hover:outline-[#0000001f] group-hover:outline-2 dark:bg-[#1C1C1C] dark:group-hover:outline-[#ffffff1f]" />
                      </div>
                    }
                  >
                    <div class="relative flex items-center justify-center">
                      <img
                        class="relative z-10 mb-[7px] aspect-2/3 w-full group-hover:outline-hidden group-hover:outline-[#0000001f] group-hover:outline-2 dark:group-hover:outline-[#ffffff1f]"
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
                        <span class="max-w-[50%]! absolute z-100">{gameId}</span>
                      </Show>
                      <div class="relative z-10 mb-[7px] aspect-2/3 w-full bg-[#F1F1F1] outline-hidden outline-[#0000001c] outline-4 duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:bg-[#1C1C1C] dark:outline-[#ffffff1a] dark:outline-2 dark:group-hover:outline-[#ffffff3b]" />
                    </div>
                  }
                >
                  <img
                    class="relative z-10 mb-[7px] outline-hidden outline-[#0000001c] outline-4 duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:outline-[#ffffff1a] dark:outline-2 dark:group-hover:outline-[#ffffff3b]"
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
                  <div class="aspect-2/3 w-full bg-black opacity-0 dark:bg-white dark:opacity-10" alt="" />
                </div>
              </div>
            </Show>
            <Show when={libraryData.userSettings.gameTitle}>
              <div class="flex items-start justify-between">
                <span class="text-[#000000] dark:text-white">{game().name}</span>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
