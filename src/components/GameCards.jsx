import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import {
  GlobalContext,
  ApplicationStateContext,
  translateText,
  openDialog,
  SelectedDataContext,
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
            className="gameCard group relative w-full cursor-pointer bg-transparent p-0"
            id={`${index() === 0 ? "firstGameCard" : ""}`}
            aria-label={translateText("play")}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={async (e) => {
              if (e.ctrlKey) {
                openGame(globalContext.libraryData.games[gameName].location);
                return;
              }
              await selectedDataContext.setSelectedGame(
                globalContext.libraryData.games[gameName],
              );

              openDialog("gamePopup");
            }}>
            <Show
              when={globalContext.libraryData.games[gameName].favourite}
              fallback={
                <div className="relative w-full">
                  <Show
                    when={globalContext.libraryData.games[gameName].gridImage}
                    fallback={
                      <div className="relative flex items-center justify-center">
                        <Show
                          when={
                            !globalContext.libraryData.userSettings.gameTitle
                          }>
                          <span className="absolute z-[100] !max-w-[50%]">
                            {gameName}
                          </span>

                          <Show
                            when={
                              !globalContext.libraryData.games[gameName]
                                .location
                            }>
                            <span class="tooltip absolute bottom-[30px] z-[100]">
                              {translateText("no game file")}
                            </span>
                          </Show>
                        </Show>

                        <div className="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] group-hover:outline-none group-hover:outline-[2px] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] dark:group-hover:outline-[#ffffff1f]" />
                      </div>
                    }>
                    <div className="relative flex items-center justify-center">
                      <Show
                        when={
                          !globalContext.libraryData.userSettings.gameTitle
                        }>
                        <Show
                          when={
                            !globalContext.libraryData.games[gameName].location
                          }>
                          <span class="tooltip absolute bottom-[30px] z-[100]">
                            {translateText("no game file")}
                          </span>
                        </Show>
                      </Show>

                      <img
                        className="relative z-10 mb-[7px] aspect-[2/3] w-full group-hover:outline-none group-hover:outline-[2px] group-hover:outline-[#0000001f] dark:group-hover:outline-[#ffffff1f]"
                        src={convertFileSrc(
                          `${applicationStateContext.appDataDirPath()}grids\\${globalContext.libraryData.games[gameName].gridImage}`,
                        )}
                        alt=""
                      />
                    </div>
                  </Show>
                </div>
              }>
              <div className="relative w-full">
                <Show
                  when={globalContext.libraryData.games[gameName].gridImage}
                  fallback={
                    <div className="relative flex items-center justify-center">
                      <Show
                        when={
                          !globalContext.libraryData.userSettings.gameTitle
                        }>
                        <span className="absolute z-[100] !max-w-[50%]">
                          {gameName}
                        </span>

                        <Show
                          when={
                            !globalContext.libraryData.games[gameName].location
                          }>
                          <span class="tooltip absolute bottom-[30px] z-[100]">
                            {translateText("no game file")}
                          </span>
                        </Show>
                      </Show>
                      <div className="relative z-10 mb-[7px] aspect-[2/3] w-full bg-[#F1F1F1] outline-none outline-[4px]  outline-[#0000001c] duration-200 motion-reduce:duration-100 hover:outline-[#0000003b] dark:bg-[#1C1C1C] dark:outline-[2px] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b]" />
                    </div>
                  }>
                  <img
                    className="relative z-10 mb-[7px] outline-none outline-[4px] outline-[#0000001c] duration-200 motion-reduce:duration-100 hover:outline-[#0000003b] dark:outline-[2px] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b]"
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}grids\\${globalContext.libraryData.games[gameName].gridImage}`,
                    )}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div className="absolute inset-0 duration-500 motion-reduce:duration-100 dark:bg-blend-screen dark:blur-[30px] dark:group-hover:blur-[50px] ">
                  <img
                    className="absolute inset-0 opacity-0 duration-500 motion-reduce:duration-100 dark:opacity-[40%] dark:group-hover:opacity-60"
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}grids\\${globalContext.libraryData.games[gameName].gridImage}`,
                    )}
                    alt=""
                  />
                  <div
                    className="aspect-[2/3] w-full  bg-[#000] opacity-[0%] dark:bg-[#fff] dark:opacity-[10%]"
                    alt=""
                  />
                </div>
              </div>
            </Show>
            <Show when={globalContext.libraryData.userSettings.gameTitle}>
              <div className="flex items-start justify-between">
                <Show
                  when={globalContext.libraryData.games[gameName].location}
                  fallback={
                    <>
                      <span className="!max-w-[50%] text-[#000000] dark:text-white">
                        {gameName}
                      </span>

                      <span class=" tooltip z-[100]">
                        {translateText("no game file")}
                      </span>
                    </>
                  }>
                  <span className="text-[#000000] dark:text-white">
                    {gameName}
                  </span>
                </Show>
              </div>
            </Show>
          </button>
        );
      }}
    </For>
  );
}
