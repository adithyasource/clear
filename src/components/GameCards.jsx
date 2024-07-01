import { Show, useContext, For } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import {
  GlobalContext,
  ApplicationStateContext,
  translateText,
  openDialog,
  SelectedDataContext,
  openGame
} from "../Globals";

export function GameCards(props) {
  const globalContext = useContext(GlobalContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const selectedDataContext = useContext(SelectedDataContext);

  return (
    <For each={props.gamesList}>
      {(gameName, index) => {
        return (
          <button
            type="button"
            class="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={`${index() === 0 ? "firstGameCard" : ""}`}
            data-tooltip={
              globalContext.libraryData.games[gameName].location
                ? translateText("play")
                : translateText("no game file")
            }
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={async (e) => {
              if (e.ctrlKey) {
                openGame(globalContext.libraryData.games[gameName].location);
                return;
              }
              await selectedDataContext.setSelectedGame(
                globalContext.libraryData.games[gameName]
              );

              openDialog("gamePopUp");
            }}>
            <Show
              when={globalContext.libraryData.games[gameName].favourite}
              fallback={
                <div class="relative w-full">
                  <Show
                    when={globalContext.libraryData.games[gameName].gridImage}
                    fallback={
                      <div class="relative flex items-center justify-center">
                        <Show
                          when={
                            !globalContext.libraryData.userSettings.gameTitle
                          }>
                          <span class="absolute z-[100] !max-w-[50%]">
                            {gameName}
                          </span>
                        </Show>

                        <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] group-hover:outline-none group-hover:outline-[2px] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] dark:group-hover:outline-[#ffffff1f]" />
                      </div>
                    }>
                    <div class="relative flex items-center justify-center">
                      <img
                        class="relative z-10 mb-[7px] aspect-[2/3] w-full group-hover:outline-none group-hover:outline-[2px] group-hover:outline-[#0000001f] dark:group-hover:outline-[#ffffff1f]"
                        src={convertFileSrc(
                          `${applicationStateContext.appDataDirPath()}grids\\${
                            globalContext.libraryData.games[gameName].gridImage
                          }`
                        )}
                        alt=""
                      />
                    </div>
                  </Show>
                </div>
              }>
              <div class="relative w-full">
                <Show
                  when={globalContext.libraryData.games[gameName].gridImage}
                  fallback={
                    <div class="relative flex items-center justify-center">
                      <Show
                        when={
                          !globalContext.libraryData.userSettings.gameTitle
                        }>
                        <span class="absolute z-[100] !max-w-[50%]">
                          {gameName}
                        </span>
                      </Show>
                      <div class="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] outline-none outline-[4px]  outline-[#0000001c] duration-200 motion-reduce:duration-100 hover:outline-[#0000003b] dark:bg-[#1C1C1C] dark:outline-[2px] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b]" />
                    </div>
                  }>
                  <img
                    class="relative z-10 mb-[7px] outline-none outline-[4px] outline-[#0000001c] duration-200 motion-reduce:duration-100 hover:outline-[#0000003b] dark:outline-[2px] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b]"
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}grids\\${
                        globalContext.libraryData.games[gameName].gridImage
                      }`
                    )}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div class="absolute inset-0 duration-500 motion-reduce:duration-100 dark:bg-blend-screen dark:blur-[30px] dark:group-hover:blur-[50px] ">
                  <img
                    class="absolute inset-0 opacity-0 duration-500 motion-reduce:duration-100 dark:opacity-[40%] dark:group-hover:opacity-60"
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}grids\\${
                        globalContext.libraryData.games[gameName].gridImage
                      }`
                    )}
                    alt=""
                  />
                  <div
                    class="aspect-[2/3] w-full  bg-[#000] opacity-[0%] dark:bg-[#fff] dark:opacity-[10%]"
                    alt=""
                  />
                </div>
              </div>
            </Show>
            <Show when={globalContext.libraryData.userSettings.gameTitle}>
              <div class="flex items-start justify-between">
                <span class="text-[#000000] dark:text-white">{gameName}</span>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
