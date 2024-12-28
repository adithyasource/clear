// importing globals
import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  UIContext,
  getData,
  openDialog,
  toggleSideBar,
  translateText,
  triggerToast,
  updateData,
} from "./Globals";

// importing components
import { GameCardSideBar } from "./components/GameCardSideBar";

// importing code snippets and library functions
import { For, Show, onMount, useContext, createSignal } from "solid-js";
import { produce } from "solid-js/store";

// importing style related files
import {
  ChevronArrows,
  Edit,
  EyeClosed,
  GameController,
  Folder,
  Notepad,
  UpdateDownload,
  Settings,
} from "./libraries/Icons";

export function SideBar() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  const [showContentSkipButton, setShowContentSkipButton] = createSignal(false);

  let scrollY = " ";

  async function moveFolder(folderName, toPosition) {
    const pastPositionOfFolder = applicationStateContext.currentFolders().indexOf(folderName);

    applicationStateContext.currentFolders().splice(pastPositionOfFolder, 1);

    if (toPosition === -1) {
      applicationStateContext.currentFolders().push(folderName);
    } else {
      if (toPosition > pastPositionOfFolder) {
        applicationStateContext.currentFolders().splice(toPosition - 1, 0, folderName);
      } else {
        applicationStateContext.currentFolders().splice(toPosition, 0, folderName);
      }
    }

    for (const currentFolderName of applicationStateContext.currentFolders()) {
      for (const folderName of Object.keys(globalContext.libraryData.folders)) {
        if (currentFolderName === folderName) {
          globalContext.setLibraryData(
            produce((data) => {
              Object.values(data.folders)[Object.keys(globalContext.libraryData.folders).indexOf(folderName)].index =
                applicationStateContext.currentFolders().indexOf(currentFolderName);

              return data;
            }),
          );
        }
      }
    }

    await updateData();
  }

  async function moveGameInCurrentFolder(gameName, toPosition, currentFolderName) {
    const pastPositionOfGame = globalContext.libraryData.folders[currentFolderName].games.indexOf(gameName);

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[currentFolderName].games.splice(data.folders[currentFolderName].games.indexOf(gameName), 1);
        return data;
      }),
    );

    if (toPosition === -1) {
      globalContext.setLibraryData(
        produce((data) => {
          data.folders[currentFolderName].games.push(gameName);
          return data;
        }),
      );
    } else {
      if (toPosition > pastPositionOfGame) {
        globalContext.setLibraryData(
          produce((data) => {
            data.folders[currentFolderName].games.splice(toPosition - 1, 0, gameName);
            return data;
          }),
        );
      } else {
        globalContext.setLibraryData(
          produce((data) => {
            data.folders[currentFolderName].games.splice(toPosition, 0, gameName);
            return data;
          }),
        );
      }
    }
  }

  async function moveGameToAnotherFolder(gameName, toPosition, currentFolderName, destinationFolderName) {
    if (currentFolderName !== "uncategorized") {
      globalContext.setLibraryData(
        produce((data) => {
          data.folders[currentFolderName].games.splice(data.folders[currentFolderName].games.indexOf(gameName), 1);
          return data;
        }),
      );
    }

    if (toPosition === -1) {
      globalContext.setLibraryData(
        produce((data) => {
          data.folders[destinationFolderName].games.push(gameName);
          return data;
        }),
      );
    } else {
      globalContext.setLibraryData(
        produce((data) => {
          data.folders[destinationFolderName].games.splice(toPosition, 0, gameName);
          return data;
        }),
      );
    }
  }

  function folderContainerDragOverHandler(e) {
    e.preventDefault();

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !== undefined) {
      const siblings = [...e.srcElement.querySelectorAll(".sideBarFolder:not(.dragging)")];

      const allGames = document.querySelectorAll(".sideBarFolder");

      for (const game of allGames) {
        game.classList.remove("currentlyDragging");
      }

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      try {
        nextSibling.classList.add("currentlyDragging");
      } catch (error) {
        // do nothing
      }
    }
  }

  async function folderContainerDropHandler(e) {
    const folderName = e.dataTransfer.getData("folderName");

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !== undefined) {
      const siblings = [...e.srcElement.querySelectorAll(".sideBarFolder:not(.dragging)")];

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      try {
        moveFolder(folderName, applicationStateContext.currentFolders().indexOf(nextSibling.id));
        document.querySelector("#uncategorizedFolder").classList.remove("currentlyDragging");
        setTimeout(() => {
          getData();
        }, 100);
      } catch (error) {
        getData();
      }

      await updateData();
    }
  }

  function gamesFolderDragOverHandler(e) {
    e.preventDefault();

    console.log("dragging over game");

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] === undefined) {
      const siblings = [...e.srcElement.querySelectorAll(".sideBarGame:not(.dragging)")];

      const allGames = document.querySelectorAll(".sideBarGame");

      for (const game of allGames) {
        game.classList.remove("currentlyDragging");
      }

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      try {
        nextSibling.classList.add("currentlyDragging");
      } catch (error) {
        // do nothing
      }
    }
  }

  async function gamesFolderDropHandler(e, folderName) {
    const oldFolderName = e.dataTransfer.getData("oldFolderName");

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] === undefined) {
      const draggingItem = document.querySelector(".dragging");
      const siblings = [...e.srcElement.querySelectorAll(".sideBarGame:not(.dragging)")];

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      const currentDraggingItem = draggingItem.textContent;

      let nextSiblingItem;
      let toPosition;

      try {
        nextSiblingItem = nextSibling.textContent;
        toPosition = globalContext.libraryData.folders[folderName].games.indexOf(nextSiblingItem);
      } catch {
        toPosition = -1;
      }

      if (oldFolderName === folderName) {
        moveGameInCurrentFolder(currentDraggingItem, toPosition, folderName);
      } else {
        moveGameToAnotherFolder(currentDraggingItem, toPosition, oldFolderName, folderName);
      }
    }

    await updateData();
  }

  onMount(() => {
    document.getElementById("sideBarFolders").addEventListener("scroll", () => {
      scrollY = document.getElementById("sideBarFolders").scrollTop;
    });
  });

  return (
    <>
      <div class="sideBar relative z-10 flex h-[100vh] w-[20%] flex-col py-[20px] pl-[20px] text-black min-[1500px]:w-[15%]">
        <div id="sideBarTop">
          <div class="flex items-center justify-between gap-[15px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("firstGameCard").focus();
                document.body.classList.add("user-is-tabbing");
              }}
              class="w-full"
            >
              <input
                aria-autocomplete="none"
                type="text"
                id="searchInput"
                name=""
                class="w-full bg-[#E8E8E8] text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:text-white dark:hover:!bg-[#2b2b2b]"
                placeholder={translateText("search")}
                onInput={(e) => {
                  applicationStateContext.setSearchValue(e.currentTarget.value);
                }}
              />
            </form>
            <button
              type="button"
              class="w-[28px] cursor-pointer p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323] tooltip-delayed-bottom"
              onClick={() => {
                toggleSideBar();
              }}
              data-tooltip={translateText("close sidebar")}
              onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey === false) {
                  setShowContentSkipButton(true);
                }
              }}
            >
              <ChevronArrows />
            </button>
          </div>

          <Show when={showContentSkipButton()}>
            <button
              type="button"
              class="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                setShowContentSkipButton(false);

                const firstGameCard = document.getElementById("firstGameCard");

                if (firstGameCard !== undefined) {
                  firstGameCard.focus();
                } else {
                  triggerToast(translateText("no games found"));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  setShowContentSkipButton(false);
                }
              }}
              onBlur={() => {
                setShowContentSkipButton(false);
              }}
            >
              {translateText("skip to games")}
            </button>
          </Show>

          {/* container for all the folders */}

          <div
            id="sideBarFolders"
            class={`overflow-auto mt-[20px]
              ${globalContext.libraryData.userSettings.language === "fr"
                ? "medium:h-[calc(100vh-330px)] large:h-[calc(100vh-275px)]"
                : "h-[calc(100vh-275px)]"
              } `}
            // drag over and drop are triggered when folders inside are dragged over and dropped in the sidebar
            onDragOver={(e) => {
              folderContainerDragOverHandler(e);
            }}
            onDrop={async (e) => {
              await folderContainerDropHandler(e);
            }}
          >
            <p class="mt-[5px]" />

            <For each={applicationStateContext.currentFolders()}>
              {(folderName, index) => {
                const folder = globalContext.libraryData.folders[folderName];

                return (
                  <div
                    class="sideBarFolder bg-[#f1f1f1] !py-2 dark:bg-[#1c1c1c]"
                    id={folderName}
                    draggable={true}
                    // drag start and drag end are triggered when the folder itself is dragged
                    onDragStart={(e) => {
                      setTimeout(() => {
                        e.srcElement.classList.add("dragging");
                      }, 0);
                      e.dataTransfer.setData("folderName", folderName);
                    }}
                    onDragEnd={(e) => {
                      e.srcElement.classList.remove("dragging");
                    }}
                    // drag over and drop are triggered when other items are dragged over and dropped
                    onDragOver={(e) => {
                      gamesFolderDragOverHandler(e);
                    }}
                    onDrop={async (e) => {
                      await gamesFolderDropHandler(e, folderName);
                    }}
                  >
                    <div class="flex cursor-move items-center gap-[10px]">
                      <Show
                        when={folder.games.length > 0}
                        fallback={<s class="cursor-move break-all text-black dark:text-white">{folder.name}</s>}
                      >
                        <span class="break-all text-black dark:text-white">{folder.name}</span>
                      </Show>

                      <Show when={folder.hide === true}>
                        <div class="tooltip-delayed-bottom" data-tooltip={translateText("hidden")}>
                          <EyeClosed />
                        </div>
                      </Show>

                      <button
                        type="button"
                        class="w-[25.25px] p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323] tooltip-delayed-bottom"
                        onClick={() => {
                          openDialog("editFolder");
                          selectedDataContext.setSelectedFolder(folder);
                        }}
                        onKeyDown={(e) => {
                          if (index() === 0) {
                            if (e.key === "Tab" && e.shiftKey === true) {
                              setShowContentSkipButton(true);
                            }
                          }
                        }}
                        data-tooltip={translateText("edit")}
                      >
                        <Edit />
                      </button>
                    </div>

                    <Show when={folder.games.length > 0}>
                      <For each={folder.games}>
                        {(gameName, index) => (
                          <GameCardSideBar gameName={gameName} index={index()} folderName={folderName} />
                        )}
                      </For>
                      <p class="sideBarGame mt-[10px] h-[3px] w-full cursor-grab">&nbsp;</p>
                    </Show>
                  </div>
                );
              }}
            </For>

            {/* uncategorized games */}

            <div
              class="sideBarFolder bg-[#f1f1f1] dark:bg-[#1c1c1c]"
              id="uncategorizedFolder"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={async (e) => {
                const gameName = e.dataTransfer.getData("gameName");
                const oldFolderName = e.dataTransfer.getData("oldFolderName");
                const index = globalContext.libraryData.folders[oldFolderName].games.indexOf(gameName);

                globalContext.setLibraryData(
                  produce((data) => {
                    data.folders[oldFolderName].games.splice(index, 1);
                    return data;
                  }),
                );

                await updateData();
              }}
            >
              <div class=" flex cursor-default items-center gap-[10px]">
                <p class="pd-3 text-[#00000080] dark:text-[#ffffff80] ">{translateText("uncategorized")}</p>
              </div>

              <For each={applicationStateContext.currentGames()}>
                {(currentGame, index) => {
                  const gamesInFolders = [];
                  for (const folder of Object.values(globalContext.libraryData.folders)) {
                    for (const game of folder.games) {
                      gamesInFolders.push(game);
                    }
                  }
                  return (
                    <Show when={!gamesInFolders.includes(currentGame)}>
                      <GameCardSideBar gameName={currentGame} index={index()} folderName="uncategorized" />
                    </Show>
                  );
                }}
              </For>
            </div>
          </div>
        </div>

        <div id="sideBarBottom" class="absolute bottom-[20px] w-[calc(100%-2px)] pr-[20px]">
          <div class="">
            <button
              type="button"
              class="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("newGame");
              }}
            >
              {translateText("add game")}
              <div class="opacity-50">
                <GameController />
              </div>
            </button>
            <button
              type="button"
              class="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("newFolder");
              }}
            >
              {translateText("add folder")}
              <div class="opacity-50">
                <Folder />
              </div>
            </button>
          </div>

          <div
            class={`flex
              ${globalContext.libraryData.userSettings.language === "fr"
                ? "flex-col gap-0 medium:flex-col medium:gap-0 large:flex-row large:gap-3"
                : "gap-3"
              }`}
          >
            <button
              type="button"
              class={`standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ${uiContext.showNewVersionAvailable() ? "!w-[80%]" : ""} whitespace-nowrap`}
              onClick={() => {
                openDialog("notepad");
              }}
            >
              {translateText("notepad")}
              <div class="opacity-50">
                <Notepad />
              </div>
            </button>
            <button
              type="button"
              class="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("settings");
              }}
            >
              {translateText("settings")}
              <Show when={uiContext.showNewVersionAvailable()}>
                <div class=" tooltip-delayed-top" data-tooltip={translateText("new update available!")}>
                  <div class="opacity-50">
                    <UpdateDownload />
                  </div>
                </div>
              </Show>
              <div class="opacity-50">
                <Settings />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
