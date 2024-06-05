import { For, Show, onMount, useContext } from "solid-js";
import { produce } from "solid-js/store";
import {
  getData,
  openDialog,
  toggleSideBar,
  translateText,
  triggerToast,
  updateData,
} from "./Globals";
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

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataUpdateContext,
  UIContext,
} from "./Globals";
import { GameCardSideBar } from "./components/GameCardSideBar";

export function SideBar() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataUpdateContext = useContext(DataUpdateContext);

  let scrollY = " ";

  async function moveFolder(folderName, toPosition) {
    const pastPositionOfFolder = applicationStateContext
      .currentFolders()
      .indexOf(folderName);

    applicationStateContext.currentFolders().splice(pastPositionOfFolder, 1);

    if (toPosition === -1) {
      applicationStateContext.currentFolders().push(folderName);
    } else {
      if (toPosition > pastPositionOfFolder) {
        applicationStateContext
          .currentFolders()
          .splice(toPosition - 1, 0, folderName);
      } else {
        applicationStateContext
          .currentFolders()
          .splice(toPosition, 0, folderName);
      }
    }

    for (const currentFolderName of applicationStateContext.currentFolders()) {
      for (const folderName of Object.keys(globalContext.libraryData.folders)) {
        if (currentFolderName === folderName) {
          globalContext.setLibraryData(
            produce((data) => {
              Object.values(data.folders)[
                Object.keys(globalContext.libraryData.folders).indexOf(
                  folderName,
                )
              ].index = applicationStateContext
                .currentFolders()
                .indexOf(currentFolderName);

              return data;
            }),
          );
        }
      }
    }

    await updateData();
  }

  async function moveGameInCurrentFolder(
    gameName,
    toPosition,
    currentFolderName,
  ) {
    const pastPositionOfGame =
      globalContext.libraryData.folders[currentFolderName].games.indexOf(
        gameName,
      );

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[currentFolderName].games.splice(
          data.folders[currentFolderName].games.indexOf(gameName),
          1,
        );
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
            data.folders[currentFolderName].games.splice(
              toPosition - 1,
              0,
              gameName,
            );
            return data;
          }),
        );
      } else {
        globalContext.setLibraryData(
          produce((data) => {
            data.folders[currentFolderName].games.splice(
              toPosition,
              0,
              gameName,
            );
            return data;
          }),
        );
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
      <div className="sideBar relative z-10 flex h-[100vh] w-[20%] flex-col overflow-hidden py-[20px] pl-[20px] text-black min-[1500px]:w-[15%]">
        <div id="sideBarTop">
          <div className="flex items-center justify-between gap-[15px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("firstGameCard").focus();
                document.body.classList.add("user-is-tabbing");
              }}
              className="w-full">
              <input
                aria-autocomplete="none"
                type="text"
                id="searchInput"
                name=""
                className="w-full bg-[#E8E8E8] text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:text-white dark:hover:!bg-[#2b2b2b]"
                placeholder={translateText("search")}
                onInput={(e) => {
                  applicationStateContext.setSearchValue(e.currentTarget.value);
                }}
              />
            </form>
            <button
              type="button"
              className="w-[28px] cursor-pointer p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323]"
              onClick={() => {
                toggleSideBar();
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey === false) {
                  uiContext.setShowContentSkipButton(true);
                }
              }}>
              <ChevronArrows />
            </button>
          </div>
          <Show when={uiContext.showContentSkipButton()}>
            <button
              type="button"
              className="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                uiContext.setShowContentSkipButton(false);

                const firstGameCard = document.getElementById("firstGameCard");

                if (firstGameCard !== undefined) {
                  firstGameCard.focus();
                } else {
                  triggerToast(translateText("no games found"));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  uiContext.setShowContentSkipButton(false);
                }
              }}
              onBlur={() => {
                uiContext.setShowContentSkipButton(false);
              }}>
              {translateText("skip to games")}
            </button>
          </Show>

          <div
            id="sideBarFolders"
            className="mt-[20px]"
            onDragOver={(e) => {
              e.preventDefault();

              if (
                document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !==
                undefined
              ) {
                const siblings = [
                  ...e.srcElement.querySelectorAll(
                    ".sideBarFolder:not(.dragging)",
                  ),
                ];

                const allGames = document.querySelectorAll(".sideBarFolder");

                for (const game of allGames) {
                  game.classList.remove("currentlyDragging");
                }

                const nextSibling = siblings.find((sibling) => {
                  let compensatedY = "";
                  compensatedY = e.clientY + scrollY;

                  return (
                    compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2
                  );
                });

                try {
                  nextSibling.classList.add("currentlyDragging");
                } catch (error) {
                  // do nothing
                }
              }
            }}
            onDrop={async (e) => {
              const folderName = e.dataTransfer.getData("folderName");

              if (
                document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !==
                undefined
              ) {
                const siblings = [
                  ...e.srcElement.querySelectorAll(
                    ".sideBarFolder:not(.dragging)",
                  ),
                ];

                const nextSibling = siblings.find((sibling) => {
                  let compensatedY = "";
                  compensatedY = e.clientY + scrollY;

                  return (
                    compensatedY <= sibling.offsetTop + sibling.offsetHeight / 2
                  );
                });

                try {
                  moveFolder(
                    folderName,
                    applicationStateContext
                      .currentFolders()
                      .indexOf(nextSibling.firstChild.textContent),
                  );

                  document
                    .querySelector("#uncategorizedFolder")
                    .classList.remove("currentlyDragging");

                  setTimeout(() => {
                    getData();
                  }, 100);
                } catch (error) {
                  getData();
                }

                globalContext.setLibraryData((data) => {
                  data.folders[folderName].games.push(gameName);
                  return data;
                });

                await updateData();
              }
            }}
            class={` ${
              globalContext.libraryData.userSettings.language === "fr"
                ? "medium:h-[calc(100vh-330px)] large:h-[calc(100vh-275px)]"
                : "h-[calc(100vh-275px)]"
            } overflow-auto`}>
            <p className="mt-[5px]" />
            <For each={applicationStateContext.currentFolders()}>
              {(folderName, index) => {
                const folder = globalContext.libraryData.folders[folderName];

                if (folder.games.length > 0) {
                  return (
                    <div
                      className="sideBarFolder bg-[#f1f1f1] !py-2 dark:bg-[#1c1c1c]"
                      draggable={true}
                      onDragStart={(e) => {
                        setTimeout(
                          () => e.srcElement.classList.add("dragging"),
                          0,
                        );

                        e.dataTransfer.setData("folderName", folderName);
                      }}
                      onDragEnd={(e) => {
                        e.srcElement.classList.remove("dragging");
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();

                        if (
                          document.querySelectorAll(
                            ".sideBarFolder:is(.dragging)",
                          )[0] === undefined
                        ) {
                          const siblings = [
                            ...e.srcElement.querySelectorAll(
                              ".sideBarGame:not(.dragging)",
                            ),
                          ];

                          const allGames =
                            document.querySelectorAll(".sideBarGame");

                          for (const game of allGames) {
                            game.classList.remove("currentlyDragging");
                          }

                          const nextSibling = siblings.find((sibling) => {
                            let compensatedY = "";
                            compensatedY = e.clientY + scrollY;

                            return (
                              compensatedY <=
                              sibling.offsetTop + sibling.offsetHeight / 2
                            );
                          });

                          try {
                            nextSibling.classList.add("currentlyDragging");
                          } catch (error) {
                            // do nothing
                          }
                        }
                      }}
                      onDrop={async (e) => {
                        const gameName = e.dataTransfer.getData("gameName");
                        const oldFolderName =
                          e.dataTransfer.getData("oldFolderName");

                        if (
                          document.querySelectorAll(
                            ".sideBarFolder:is(.dragging)",
                          )[0] === undefined
                        ) {
                          if (oldFolderName === folderName) {
                            const draggingItem =
                              document.querySelector(".dragging");
                            const siblings = [
                              ...e.srcElement.querySelectorAll(
                                ".sideBarGame:not(.dragging)",
                              ),
                            ];

                            const nextSibling = siblings.find((sibling) => {
                              let compensatedY = "";
                              compensatedY = e.clientY + scrollY;

                              return (
                                compensatedY <=
                                sibling.offsetTop + sibling.offsetHeight / 2
                              );
                            });

                            try {
                              const currentDraggingItem =
                                draggingItem.textContent;

                              const nextSiblingItem = nextSibling.textContent;

                              moveGameInCurrentFolder(
                                currentDraggingItem,
                                globalContext.libraryData.folders[
                                  folderName
                                ].games.indexOf(nextSiblingItem),
                                folderName,
                              );

                              setTimeout(() => {
                                getData();
                              }, 100);
                            } catch (error) {
                              getData();
                            }
                            return;
                          }

                          if (oldFolderName !== "uncategorized") {
                            const index =
                              globalContext.libraryData.folders[
                                oldFolderName
                              ].games.indexOf(gameName);

                            // ! [test this]

                            globalContext.setLibraryData(
                              produce((data) => {
                                data.folders[oldFolderName].games.splice(
                                  index,
                                  1,
                                );
                                return data;
                              }),
                            );
                          }

                          globalContext.setLibraryData(
                            produce((data) => {
                              data.folders[folder.name].games.push(gameName);
                              return data;
                            }),
                          );

                          await updateData();
                        }
                      }}>
                      <div className="flex cursor-move items-center gap-[10px]  ">
                        <span className="break-all text-black dark:text-white">
                          {folder.name}
                        </span>
                        <Show when={folder.hide === true}>
                          <EyeClosed />
                        </Show>
                        <button
                          type="button"
                          className="w-[25.25px] p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323]"
                          onClick={() => {
                            openDialog("editFolderModal");
                            selectedDataContext.setSelectedFolder(folder);
                            dataUpdateContext.setEditedFolderName(
                              selectedDataContext.selectedFolder().name,
                            );
                            dataUpdateContext.setEditedHideFolder(
                              selectedDataContext.selectedFolder().hide,
                            );
                          }}
                          onKeyDown={(e) => {
                            if (index() === 0) {
                              if (e.key === "Tab" && e.shiftKey === true) {
                                uiContext.setShowContentSkipButton(true);
                              }
                            }
                          }}>
                          <Edit />
                        </button>
                      </div>
                      <For each={folder.games}>
                        {(gameName, index) => (
                          <GameCardSideBar
                            gameName={gameName}
                            index={index()}
                            folderName={folderName}
                          />
                        )}
                      </For>
                      <p className="sideBarGame mt-[10px] h-[3px] w-full cursor-grab">
                        &nbsp;
                      </p>
                    </div>
                  );
                }
                return (
                  <div
                    className="sideBarFolder bg-[#f1f1f1] dark:bg-[#1c1c1c]"
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    draggable={true}
                    onDragStart={(e) => {
                      setTimeout(
                        () => e.srcElement.classList.add("dragging"),
                        0,
                      );

                      e.dataTransfer.setData("folderName", folderName);
                    }}
                    onDragEnd={(e) => {
                      e.srcElement.classList.remove("dragging");
                    }}
                    onDrop={async (e) => {
                      const gameName = e.dataTransfer.getData("gameName");
                      const oldFolderName =
                        e.dataTransfer.getData("oldFolderName");
                      if (oldFolderName !== "uncategorized") {
                        const index =
                          globalContext.libraryData.folders[
                            oldFolderName
                          ].games.indexOf(gameName);

                        globalContext.setLibraryData(
                          produce((data) => {
                            data.folders[oldFolderName].games.splice(index, 1);

                            return data;
                          }),
                        );
                      }

                      globalContext.setLibraryData(
                        produce((data) => {
                          data.folders[folder.name].games.push(gameName);

                          return data;
                        }),
                      );
                      await updateData();
                    }}>
                    <div className="my-[-4px] flex cursor-move items-center gap-[10px]">
                      <s className="cursor-move break-all text-black dark:text-white">
                        {folder.name}
                      </s>
                      <Show when={folder.hide === true}>
                        <EyeClosed />
                      </Show>
                      <button
                        type="button"
                        className="w-[25.25px] p-2 duration-150 motion-reduce:duration-0 hover:bg-[#D6D6D6] dark:hover:bg-[#232323]"
                        onClick={() => {
                          openDialog("editFolderModal");
                          selectedDataContext.setSelectedFolder(folder);

                          dataUpdateContext.setEditedFolderName(
                            selectedDataContext.selectedFolder().name,
                          );
                          dataUpdateContext.setEditedHideFolder(
                            selectedDataContext.selectedFolder().hide,
                          );
                        }}>
                        <Edit />
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
            {/* uncategorized */}

            <div
              className="sideBarFolder bg-[#f1f1f1] dark:bg-[#1c1c1c]"
              id="uncategorizedFolder"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={async (e) => {
                const gameName = e.dataTransfer.getData("gameName");
                const oldFolderName = e.dataTransfer.getData("oldFolderName");

                const index =
                  globalContext.libraryData.folders[
                    oldFolderName
                  ].games.indexOf(gameName);

                globalContext.setLibraryData(
                  produce((data) => {
                    data.folders[oldFolderName].games.splice(index, 1);

                    return data;
                  }),
                );

                await updateData();
              }}>
              <div className=" flex cursor-default items-center gap-[10px]">
                <p className="pd-3 text-[#00000080] dark:text-[#ffffff80] ">
                  {translateText("uncategorized")}
                </p>
              </div>
              <For each={applicationStateContext.currentGames()}>
                {(currentGame, index) => {
                  const gamesInFolders = [];

                  for (const folder of Object.values(
                    globalContext.libraryData.folders,
                  )) {
                    for (const game of folder.games) {
                      gamesInFolders.push(game);
                    }
                  }

                  return (
                    <Show when={!gamesInFolders.includes(currentGame)}>
                      <GameCardSideBar
                        gameName={currentGame}
                        index={index()}
                        folderName="uncategorized"
                      />
                    </Show>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
        <div
          id="sideBarBottom"
          class="absolute bottom-[20px] w-[calc(100%-2px)] pr-[20px]">
          <div className="">
            <button
              type="button"
              className="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("newGameModal");
              }}>
              {translateText("add game")}
              <div className="opacity-50">
                <GameController />
              </div>
            </button>
            <button
              type="button"
              className="standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("newFolderModal");
              }}>
              {translateText("add folder")}
              <div className="opacity-50">
                <Folder />
              </div>
            </button>
          </div>

          <div
            className={`flex ${
              globalContext.libraryData.userSettings.language === "fr"
                ? "flex-col gap-0 medium:flex-col medium:gap-0 large:flex-row large:gap-3"
                : "gap-3"
            }`}>
            <button
              type="button"
              className={`standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ${
                uiContext.showNewVersionAvailable() ? "!w-[80%]" : ""
              } whitespace-nowrap`}
              onClick={() => {
                openDialog("notepadModal");
              }}>
              {translateText("notepad")}
              <div className="opacity-50">
                <Notepad />
              </div>
            </button>
            <button
              type="button"
              className=" standardButton mt-[12px] bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openDialog("settingsModal");
              }}>
              {translateText("settings")}
              <Show when={uiContext.showNewVersionAvailable()}>
                <div className="opacity-50">
                  <UpdateDownload />
                </div>
              </Show>
              <div className="opacity-50">
                <Settings />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
