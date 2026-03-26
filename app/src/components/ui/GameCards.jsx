import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, For, Show, useContext } from "solid-js";
import { GamePopUpModal } from "@/components/modal/GamePopUp.jsx";
import { openGame, SelectedDataContext } from "@/Globals.jsx";
import { openModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { libraryData } from "../../stores/libraryStore";

export function GameCards(props) {
  const selectedDataContext = useContext(SelectedDataContext);

  return (
    <For each={props.gamesList}>
      {(gameName, index) => {
        const [imagePath] = createResource(() =>
          getImagePath({ type: "grid", fileName: libraryData.games[gameName].gridImagePath }),
        );

        return (
          <button
            type="button"
            class="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={index() === 0 ? "firstGameCard" : ""}
            data-tooltip={libraryData.games[gameName].location ? translateText("play") : translateText("no game file")}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={async (e) => {
              if (e.ctrlKey && libraryData.games[gameName].location) {
                openGame(libraryData.games[gameName].location);
                return;
              }

              await selectedDataContext.setSelectedGame(libraryData.games[gameName]);

              openModal({ type: "gamePopUp", component: GamePopUpModal, confirmWhileClosing: false });
            }}
          >
            <Show
              when={libraryData.games[gameName].favourite}
              fallback={
                <div class="relative w-full">
                  <Show
                    when={libraryData.games[gameName].gridImagePath}
                    fallback={
                      <div class="relative flex items-center justify-center">
                        <Show when={!libraryData.userSettings.gameTitle}>
                          <span class="!max-w-[50%] absolute z-[100]">{gameName}</span>
                        </Show>

                        <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] group-hover:outline-none group-hover:outline-[#0000001f] group-hover:outline-[2px] dark:bg-[#1C1C1C] dark:group-hover:outline-[#ffffff1f]" />
                      </div>
                    }
                  >
                    <div class="relative flex items-center justify-center">
                      <img
                        class="relative z-10 mb-[7px] aspect-[2/3] w-full group-hover:outline-none group-hover:outline-[#0000001f] group-hover:outline-[2px] dark:group-hover:outline-[#ffffff1f]"
                        src={imagePath(gameName) ? convertFileSrc(imagePath(gameName)) : ""}
                        alt=""
                      />
                    </div>
                  </Show>
                </div>
              }
            >
              <div class="relative w-full">
                <Show
                  when={libraryData.games[gameName].gridImagePath}
                  fallback={
                    <div class="relative flex items-center justify-center">
                      <Show when={!libraryData.userSettings.gameTitle}>
                        <span class="!max-w-[50%] absolute z-[100]">{gameName}</span>
                      </Show>
                      <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] outline-none outline-[#0000001c] outline-[4px] duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:bg-[#1C1C1C] dark:outline-[#ffffff1a] dark:outline-[2px] dark:group-hover:outline-[#ffffff3b]" />
                    </div>
                  }
                >
                  <img
                    class="relative z-10 mb-[7px] outline-none outline-[#0000001c] outline-[4px] duration-200 hover:outline-[#0000003b] motion-reduce:duration-100 dark:outline-[#ffffff1a] dark:outline-[2px] dark:group-hover:outline-[#ffffff3b]"
                    src={imagePath(gameName) ? convertFileSrc(imagePath(gameName)) : ""}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div class="absolute inset-0 duration-500 motion-reduce:duration-100 dark:bg-blend-screen dark:blur-[30px] dark:group-hover:blur-[50px]">
                  <img
                    class="absolute inset-0 opacity-0 duration-500 motion-reduce:duration-100 dark:opacity-[40%] dark:group-hover:opacity-60"
                    src={imagePath(gameName) ? convertFileSrc(imagePath(gameName)) : ""}
                    alt=""
                  />
                  <div class="aspect-[2/3] w-full bg-[#000] opacity-[0%] dark:bg-[#fff] dark:opacity-[10%]" alt="" />
                </div>
              </div>
            </Show>
            <Show when={libraryData.userSettings.gameTitle}>
              <div class="flex items-start justify-between">
                <span class="text-[#000000] dark:text-white">{libraryData.games[gameName].name}</span>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
