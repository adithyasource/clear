import { For, Show, onMount, useContext } from "solid-js";
import { produce } from "solid-js/store";
import {
  getData,
  openDialog,
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
  onMount(() => {
    document
      .getElementById("sideBarFolders")
      .addEventListener("scroll", function () {
        scrollY = document.getElementById("sideBarFolders").scrollTop;
      });
  });

  async function toggleSideBar() {
    globalContext.setLibraryData("userSettings", "showSideBar", (x) => !x);

    await updateData();
    getData();
  }

  async function moveFolder(folderName, toPosition) {
    let pastPositionOfFolder = applicationStateContext
      .currentFolders()
      .indexOf(folderName);

    applicationStateContext.currentFolders().splice(pastPositionOfFolder, 1);

    if (toPosition == -1) {
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

    for (let x = 0; x < applicationStateContext.currentFolders().length; x++) {
      for (
        let y = 0;
        y < Object.keys(globalContext.libraryData["folders"]).length;
        y++
      ) {
        if (
          applicationStateContext.currentFolders()[x] ==
          Object.keys(globalContext.libraryData["folders"])[y]
        ) {
          globalContext.setLibraryData(
            produce((data) => {
              Object.values(data["folders"])[y].index = x;

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
    let pastPositionOfGame =
      globalContext.libraryData.folders[currentFolderName]["games"].indexOf(
        gameName,
      );

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[currentFolderName]["games"].splice(
          data.folders[currentFolderName]["games"].indexOf(gameName),
          1,
        );
        return data;
      }),
    );

    if (toPosition == -1) {
      globalContext.setLibraryData(
        produce((data) => {
          data.folders[currentFolderName]["games"].push(gameName);
          return data;
        }),
      );
    } else {
      if (toPosition > pastPositionOfGame) {
        globalContext.setLibraryData(
          produce((data) => {
            data.folders[currentFolderName]["games"].splice(
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
            data.folders[currentFolderName]["games"].splice(
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

  return (
    <>
      <div className="flex sideBar flex-col h-[100vh] text-black z-10 py-[20px] pl-[20px] relative overflow-hidden w-[20%] min-[1500px]:w-[15%]">
        <div id="sideBarTop">
          <div className="flex justify-between items-center gap-[15px]">
            <input
              aria-autocomplete="none"
              type="text"
              id="searchInput"
              name=""
              className="dark:bg-[#232323] bg-[#E8E8E8] dark:text-white text-black w-full hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b]"
              placeholder={translateText("search")}
              onInput={(e) => {
                applicationStateContext.setSearchValue(e.currentTarget.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("firstGameCard").focus();
                  console.log(document.getElementById("firstGameCard"));
                  let body = document.body;
                  body.classList.add("user-is-tabbing");
                }
              }}
            />
            <button
              className="cursor-pointer hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[28px]"
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
              className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
              onClick={() => {
                uiContext.setShowContentSkipButton(false);

                let firstGameCard = document.getElementById("firstGameCard");

                if (firstGameCard != undefined) {
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
                document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !=
                undefined
              ) {
                let siblings = [
                  ...e.srcElement.querySelectorAll(
                    ".sideBarFolder:not(.dragging)",
                  ),
                ];

                let allGames = document.querySelectorAll(".sideBarFolder");

                allGames.forEach((game) => {
                  game.classList.remove("currentlyDragging");
                });

                let nextSibling = siblings.find((sibling) => {
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
              let folderName = e.dataTransfer.getData("folderName");

              if (
                document.querySelectorAll(".sideBarFolder:is(.dragging)")[0] !=
                undefined
              ) {
                let siblings = [
                  ...e.srcElement.querySelectorAll(
                    ".sideBarFolder:not(.dragging)",
                  ),
                ];

                let nextSibling = siblings.find((sibling) => {
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
                getData();
              }
            }}
            class={` ${
              globalContext.libraryData.userSettings.language == "fr"
                ? "medium:h-[calc(100vh-330px)] large:h-[calc(100vh-275px)]"
                : "h-[calc(100vh-275px)]"
            } overflow-auto`}>
            <p className="mt-[5px]"></p>
            <For each={applicationStateContext.currentFolders()}>
              {(folderName, index) => {
                let folder = globalContext.libraryData.folders[folderName];

                if (folder.games.length > 0) {
                  return (
                    <div
                      className="!py-2 sideBarFolder bg-[#f1f1f1] dark:bg-[#1c1c1c]"
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
                          )[0] == undefined
                        ) {
                          let siblings = [
                            ...e.srcElement.querySelectorAll(
                              ".sideBarGame:not(.dragging)",
                            ),
                          ];

                          let allGames =
                            document.querySelectorAll(".sideBarGame");

                          allGames.forEach((game) => {
                            game.classList.remove("currentlyDragging");
                          });

                          let nextSibling = siblings.find((sibling) => {
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
                        let gameName = e.dataTransfer.getData("gameName");
                        let oldFolderName =
                          e.dataTransfer.getData("oldFolderName");

                        if (
                          document.querySelectorAll(
                            ".sideBarFolder:is(.dragging)",
                          )[0] == undefined
                        ) {
                          if (oldFolderName == folderName) {
                            const draggingItem =
                              document.querySelector(".dragging");
                            let siblings = [
                              ...e.srcElement.querySelectorAll(
                                ".sideBarGame:not(.dragging)",
                              ),
                            ];

                            let nextSibling = siblings.find((sibling) => {
                              let compensatedY = "";
                              compensatedY = e.clientY + scrollY;

                              return (
                                compensatedY <=
                                sibling.offsetTop + sibling.offsetHeight / 2
                              );
                            });

                            try {
                              let currentDraggingItem =
                                draggingItem.textContent;

                              let nextSiblingItem = nextSibling.textContent;

                              moveGameInCurrentFolder(
                                currentDraggingItem,
                                globalContext.libraryData.folders[folderName][
                                  "games"
                                ].indexOf(nextSiblingItem),
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

                          if (oldFolderName != "uncategorized") {
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
                          getData();
                        }
                      }}>
                      <div className="flex gap-[10px] items-center cursor-move  ">
                        <span className="text-black dark:text-white break-all">
                          {folder.name}
                        </span>
                        <Show when={folder.hide == true}>
                          <EyeClosed />
                        </Show>
                        <button
                          className="hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px]"
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
                      <p className="mt-[10px] w-full h-[3px] sideBarGame cursor-grab">
                        &nbsp;
                      </p>
                    </div>
                  );
                } else {
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
                        let gameName = e.dataTransfer.getData("gameName");
                        let oldFolderName =
                          e.dataTransfer.getData("oldFolderName");
                        if (oldFolderName != "uncategorized") {
                          const index =
                            globalContext.libraryData.folders[
                              oldFolderName
                            ].games.indexOf(gameName);

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
                        getData();
                      }}>
                      <div className="flex gap-[10px] items-center cursor-move my-[-4px]">
                        <s className="text-black cursor-move dark:text-white break-all">
                          {folder.name}
                        </s>
                        <Show when={folder.hide == true}>
                          <EyeClosed />
                        </Show>
                        <button
                          className="hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px]"
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
                }
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
                let gameName = e.dataTransfer.getData("gameName");
                let oldFolderName = e.dataTransfer.getData("oldFolderName");

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

                getData();
              }}>
              <div className=" flex gap-[10px] items-center cursor-default">
                <p className="pd-3 text-[#00000080] dark:text-[#ffffff80] ">
                  {translateText("uncategorized")}
                </p>
              </div>
              <For each={applicationStateContext.currentGames()}>
                {(currentGame, index) => {
                  let gamesInFolders = [];

                  for (
                    let x = 0;
                    x < Object.values(globalContext.libraryData.folders).length;
                    x++
                  ) {
                    for (
                      let y = 0;
                      y <
                      Object.values(globalContext.libraryData.folders)[x].games
                        .length;
                      y++
                    ) {
                      gamesInFolders.push(
                        Object.values(globalContext.libraryData.folders)[x]
                          .games[y],
                      );
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
              className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
              onClick={() => {
                openDialog("newGameModal");
              }}>
              {translateText("add game")}
              <div className="opacity-50">
                <GameController />
              </div>
            </button>
            <button
              className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
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
              globalContext.libraryData.userSettings.language == "fr"
                ? "medium:flex-col flex-col large:flex-row gap-0 medium:gap-0 large:gap-3"
                : "gap-3"
            }`}>
            <button
              className={`standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px] ${
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
              className=" standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
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
