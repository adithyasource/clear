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
            className="relative w-full bg-transparent cursor-pointer gameCard group p-0"
            id={`${index() == 0 ? "firstGameCard" : ""}`}
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
                          <span className="!max-w-[50%] absolute z-[100]">
                            {gameName}
                          </span>

                          <Show
                            when={
                              !globalContext.libraryData.games[gameName]
                                .location
                            }>
                            <span class="absolute tooltip z-[100] bottom-[30px]">
                              {translateText("no game file")}
                            </span>
                          </Show>
                        </Show>

                        <div className="z-10 mb-[7px] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] bg-[#F1F1F1] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none" />
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
                          <span class="absolute tooltip z-[100] bottom-[30px]">
                            {translateText("no game file")}
                          </span>
                        </Show>
                      </Show>

                      <img
                        className="z-10 mb-[7px] group-hover:outline-[#0000001f] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none"
                        src={convertFileSrc(
                          applicationStateContext.appDataDirPath() +
                            "grids\\" +
                            globalContext.libraryData.games[gameName].gridImage,
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
                          <span class="absolute tooltip z-[100] bottom-[30px]">
                            {translateText("no game file")}
                          </span>
                        </Show>
                      </Show>
                      <div className="relative z-10 mb-[7px] outline-[#0000001c] w-full aspect-[2/3] dark:bg-[#1C1C1C] bg-[#F1F1F1]  hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200" />
                    </div>
                  }>
                  <img
                    className="relative z-10 mb-[7px] outline-[#0000001c] hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200"
                    src={convertFileSrc(
                      applicationStateContext.appDataDirPath() +
                        "grids\\" +
                        globalContext.libraryData.games[gameName].gridImage,
                    )}
                    alt=""
                    width="100%"
                  />
                </Show>

                <div className="absolute inset-0 dark:blur-[30px]  dark:group-hover:blur-[50px] duration-500 dark:bg-blend-screen ">
                  <img
                    className="absolute inset-0 duration-500 opacity-0 dark:opacity-[40%] dark:group-hover:opacity-60"
                    src={convertFileSrc(
                      applicationStateContext.appDataDirPath() +
                        "grids\\" +
                        globalContext.libraryData.games[gameName].gridImage,
                    )}
                    alt=""
                  />
                  <div
                    className="dark:bg-[#fff] bg-[#000]  opacity-[0%] dark:opacity-[10%] w-full aspect-[2/3]"
                    alt=""
                  />
                </div>
              </div>
            </Show>
            <Show when={globalContext.libraryData.userSettings.gameTitle}>
              <div className="flex justify-between items-start">
                <Show
                  when={globalContext.libraryData.games[gameName].location}
                  fallback={
                    <>
                      <span className="text-[#000000] dark:text-white !max-w-[50%]">
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
