/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */

import { createMemo, createSignal, For, onMount, Show, useContext } from "solid-js";
import { produce } from "solid-js/store";
import { NewFolderModal } from "@/components/modal/NewFolderModal.jsx";
import { NewGameModal } from "@/components/modal/NewGameModal.jsx";
import { NotepadModal } from "@/components/modal/NotepadModal.jsx";
import { SettingsModal } from "@/components/modal/SettingsModal.jsx";
import { GameCardSideBar } from "@/components/sidebar/GameCardSideBar.jsx";
import { ApplicationStateContext, openDialog, SelectedDataContext, triggerToast, UIContext } from "@/Globals.jsx";
import {
  ChevronArrows,
  Edit,
  EyeClosed,
  Folder,
  GameController,
  Notepad,
  Settings,
  UpdateDownload,
} from "@/libraries/Icons.jsx";
import { writeUpdateData } from "@/services/libraryService";
import { libraryData, setLibraryData } from "@/stores/libraryStore.js";
import { openModal } from "@/stores/modalStore";
import { translateText } from "@/utils/translateText";
import { setSelectedFolder } from "../../stores/selectedFolderStore";
import { EditFolderModal } from "../modal/EditFolderModal";
import { toggleSideBar } from "../../services/userSettingsService";

export function SideBar() {
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  const [showContentSkipButton, setShowContentSkipButton] = createSignal(false);

  let scrollY = " ";

  const uncategorizedGames = createMemo(() => {
    const inFolders = new Set();

    for (const folder of libraryData.folders) {
      for (const gameId of folder.games) {
        inFolders.add(gameId);
      }
    }

    return Object.entries(libraryData.games).filter(([id]) => !inFolders.has(id));
  });

  function clearDragStyles() {
    document.querySelectorAll(".sideBarGame").forEach((el) => {
      el.classList.remove("currentlyDragging");
      el.classList.remove("dragging");
    });

    document.querySelectorAll(".sideBarFolder").forEach((el) => {
      el.classList.remove("currentlyDragging");
      el.classList.remove("dragging");
    });
  }

  function parseTransferIndex(val) {
    return val === "undefined" ? undefined : Number(val);
  }

  async function moveGame({ gameId, toGameIndex, toFolderIndex, fromFolderIndex }) {
    const movingFromUncategorized = fromFolderIndex === undefined;

    setLibraryData(
      produce((data) => {
        if (!movingFromUncategorized) {
          const fromGameIndex = data.folders[fromFolderIndex].games.indexOf(gameId);

          data.folders[fromFolderIndex].games.splice(fromGameIndex, 1);

          if (fromFolderIndex === toFolderIndex && fromGameIndex < toGameIndex) {
            toGameIndex--;
          }
        }
        console.log(data);

        if (toGameIndex === -1) {
          data.folders[toFolderIndex].games.push(gameId);
        } else {
          data.folders[toFolderIndex].games.splice(toGameIndex, 0, gameId);
        }

        return data;
      }),
    );
  }

  async function moveFolder({ fromIndex, toIndex }) {
    // removing folder from its past position
    console.log(fromIndex, toIndex);
    if (fromIndex === toIndex) return;

    setLibraryData(
      produce((data) => {
        const copyOfFolder = data.folders[fromIndex];
        data.folders.splice(fromIndex, 1);

        if (toIndex > fromIndex) {
          toIndex--;
        }

        if (toIndex === -1 || toIndex >= data.folders.length) {
          data.folders.push(copyOfFolder);
        } else {
          data.folders.splice(toIndex, 0, copyOfFolder);
        }

        console.log(data.folders);
        return data;
      }),
    );

    await writeUpdateData();
    clearDragStyles();
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
      } catch (_error) {
        // do nothing
      }
    }
  }

  async function folderContainerDropHandler(e) {
    const fromIndex = parseTransferIndex(e.dataTransfer.getData("folderIndex"));

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !== undefined) {
      const siblings = [...e.srcElement.querySelectorAll(".sideBarFolder:not(.dragging)")];

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      const toIndex = Number(nextSibling.dataset.folderIndex);

      try {
        moveFolder({ fromIndex, toIndex });
        document.querySelector("#uncategorizedFolder").classList.remove("currentlyDragging");
      } catch (_error) {}
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
      } catch (_error) {
        // do nothing
      }
    }
  }

  async function gamesFolderDropHandler(e, toFolderIndex) {
    const fromFolderIndex = parseTransferIndex(e.dataTransfer.getData("fromFolderIndex"));
    const gameId = e.dataTransfer.getData("gameId");

    if (document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] === undefined) {
      const siblings = [...e.srcElement.querySelectorAll(".sideBarGame:not(.dragging)")];

      const nextSibling = siblings.find((sibling) => {
        let compensatedY = "";
        compensatedY = e.clientY + scrollY;

        return compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      let nextSiblingItem;
      let toGameIndex;

      try {
        nextSiblingItem = nextSibling.dataset.gameId;
        toGameIndex = parseTransferIndex(libraryData.folders[toFolderIndex].games.indexOf(nextSiblingItem));
      } catch {
        toGameIndex = -1;
      }

      await moveGame({ gameId, toGameIndex, toFolderIndex, fromFolderIndex });
    }

    await writeUpdateData();
    clearDragStyles();
  }

  onMount(() => {
    document.getElementById("sideBarFolders").addEventListener("scroll", () => {
      scrollY = document.getElementById("sideBarFolders").scrollTop;
    });
  });

  return (
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
              class="hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] w-full bg-[#E8E8E8] text-black dark:bg-[#232323] dark:text-white"
              placeholder={translateText("search")}
              onInput={(e) => {
                applicationStateContext.setSearchValue(e.currentTarget.value);
              }}
            />
          </form>
          <button
            type="button"
            class="tooltip-delayed-bottom w-[28px] cursor-pointer p-2 duration-150 hover:bg-[#D6D6D6] motion-reduce:duration-0 dark:hover:bg-[#232323]"
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
            class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] mt-[12px] bg-[#E8E8E8] dark:bg-[#232323]"
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
          class={`mt-[20px] overflow-auto ${
            libraryData.userSettings.language === "fr"
              ? "large:h-[calc(100vh-275px)] medium:h-[calc(100vh-330px)]"
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

          <For each={libraryData.folders}>
            {(folder, folderIndex) => {
              return (
                <div
                  class="sideBarFolder !py-2 bg-[#f1f1f1] dark:bg-[#1c1c1c]"
                  id={folder.name}
                  draggable={true}
                  data-folder-index={folderIndex()}
                  // drag start and drag end are triggered when the folder itself is dragged
                  onDragStart={(e) => {
                    setTimeout(() => {
                      e.srcElement.classList.add("dragging");
                    }, 0);
                    e.dataTransfer.setData("folderName", folder.name);
                    e.dataTransfer.setData("folderIndex", folderIndex());
                  }}
                  onDragEnd={(e) => {
                    e.srcElement.classList.remove("dragging");
                  }}
                  // drag over and drop are triggered when other items are dragged over and dropped
                  onDragOver={(e) => {
                    gamesFolderDragOverHandler(e);
                  }}
                  onDrop={async (e) => {
                    await gamesFolderDropHandler(e, folderIndex());
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
                      class="tooltip-delayed-bottom w-[25.25px] p-2 duration-150 hover:bg-[#D6D6D6] motion-reduce:duration-0 dark:hover:bg-[#232323]"
                      onClick={() => {
                        setSelectedFolder(folderIndex());

                        openModal({
                          type: "editFolder",
                          component: EditFolderModal,
                          confirmWhileClosing: true,
                          onClose: () => {
                            setSelectedFolder();
                          },
                        });
                      }}
                      onKeyDown={(e) => {
                        if (folderIndex() === 0) {
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
                      {(gameId, gameIndex) => (
                        <GameCardSideBar
                          gameId={gameId}
                          game={libraryData.games[gameId]}
                          gameIndex={gameIndex()}
                          folderName={folder.name}
                          folderIndex={folderIndex()}
                        />
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
            data-folder-index={-1}
            onDrop={async (e) => {
              const gameId = e.dataTransfer.getData("gameId");
              const oldFolderName = e.dataTransfer.getData("oldFolderName");

              const fromIndex = libraryData.folders.findIndex((f) => f.name === oldFolderName);

              const index = libraryData.folders[fromIndex].games.indexOf(gameId);

              setLibraryData(
                produce((data) => {
                  data.folders[fromIndex].games.splice(index, 1);
                  return data;
                }),
              );

              await writeUpdateData();
            }}
          >
            <div class="flex cursor-default items-center gap-[10px]">
              <p class="pd-3 text-[#00000080] dark:text-[#ffffff80]">{translateText("uncategorized")}</p>
            </div>

            <For each={uncategorizedGames()}>
              {(currentGame, index) => {
                return (
                  <GameCardSideBar
                    gameId={currentGame[0]}
                    game={currentGame[1]}
                    gameIndex={index()}
                    folderName="uncategorized"
                    folderIndex={undefined}
                  />
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
            class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] mt-[12px] bg-[#E8E8E8] dark:bg-[#232323]"
            onClick={() => {
              openModal({ type: "newGame", component: NewGameModal, confirmWhileClosing: true });

              console.log(JSON.stringify(libraryData.games));
            }}
          >
            {translateText("add game")}
            <div class="opacity-50">
              <GameController />
            </div>
          </button>
          <button
            type="button"
            class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] mt-[12px] bg-[#E8E8E8] dark:bg-[#232323]"
            onClick={() => {
              openModal({ type: "newFolder", component: NewFolderModal, confirmWhileClosing: true });
            }}
          >
            {translateText("add folder")}
            <div class="opacity-50">
              <Folder />
            </div>
          </button>
        </div>

        <div
          class={`flex ${
            libraryData.userSettings.language === "fr"
              ? "large:flex-row flex-col medium:flex-col gap-0 large:gap-3 medium:gap-0"
              : "gap-3"
          }`}
        >
          <button
            type="button"
            class={`standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] mt-[12px] bg-[#E8E8E8] dark:bg-[#232323] ${
              uiContext.showNewVersionAvailable() ? "!w-[80%]" : ""
            } whitespace-nowrap`}
            onClick={() => {
              openModal({ type: "notepad", component: NotepadModal, confirmWhileClosing: false });
            }}
          >
            {translateText("notepad")}
            <div class="opacity-50">
              <Notepad />
            </div>
          </button>
          <button
            type="button"
            class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] mt-[12px] bg-[#E8E8E8] dark:bg-[#232323]"
            onClick={() => {
              openModal({ type: "settings", component: SettingsModal, confirmWhileClosing: false });
            }}
          >
            {translateText("settings")}
            <Show when={uiContext.showNewVersionAvailable()}>
              <div class="tooltip-delayed-top" data-tooltip={translateText("new update available!")}>
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
  );
}
