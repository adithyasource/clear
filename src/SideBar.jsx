import {
  libraryData,
  selectedFolder,
  setSelectedFolder,
  currentGames,
  currentFolders,
  setSearchValue,
  gameName,
  setEditedFolderName,
  setEditedHideFolder,
  roundedBorders,
  setSelectedGame,
  appDataDirPath,
  newVersionAvailable,
  language,
} from "./Signals";

import {
  ChevronArrows,
  Edit,
  EyeClosed,
  GameController,
  Folder,
  Notepad,
  UpdateDownload,
  Settings,
} from "./components/Icons";

import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";

import { For, Show, onMount } from "solid-js";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData, openGame, translateText } from "./App";

export function SideBar() {
  let scrollY = " ";
  onMount(() => {
    document
      .getElementById("sideBarFolders")
      .addEventListener("scroll", function () {
        scrollY = document.getElementById("sideBarFolders").scrollTop;
      });
  });

  async function toggleSideBar() {
    if (
      libraryData().userSettings.showSideBar == true ||
      libraryData().userSettings.showSideBar == undefined
    ) {
      libraryData().userSettings.showSideBar = false;
    } else {
      libraryData().userSettings.showSideBar = true;
    }

    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(getData());
  }

  async function moveFolder(folderName, toPosition) {
    let pastPositionOfFolder = currentFolders().indexOf(folderName);

    currentFolders().splice(pastPositionOfFolder, 1);

    if (toPosition == -1) {
      currentFolders().push(folderName);
    } else {
      if (toPosition > pastPositionOfFolder) {
        currentFolders().splice(toPosition - 1, 0, folderName);
      } else {
        currentFolders().splice(toPosition, 0, folderName);
      }
    }

    for (let x = 0; x < currentFolders().length; x++) {
      for (let y = 0; y < Object.keys(libraryData()["folders"]).length; y++) {
        if (currentFolders()[x] == Object.keys(libraryData()["folders"])[y]) {
          Object.values(libraryData()["folders"])[y].index = x;
        }
      }
    }

    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {});
  }

  async function moveGameInCurrentFolder(
    gameName,
    toPosition,
    currentFolderName,
  ) {
    let pastPositionOfGame =
      libraryData().folders[currentFolderName]["games"].indexOf(gameName);

    libraryData().folders[currentFolderName]["games"].splice(
      libraryData().folders[currentFolderName]["games"].indexOf(gameName),
      1,
    );

    if (toPosition == -1) {
      libraryData().folders[currentFolderName]["games"].push(gameName);
    } else {
      if (toPosition > pastPositionOfGame) {
        libraryData().folders[currentFolderName]["games"].splice(
          toPosition - 1,
          0,
          gameName,
        );
      } else {
        libraryData().folders[currentFolderName]["games"].splice(
          toPosition,
          0,
          gameName,
        );
      }
    }

    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {});
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
                setSearchValue(e.currentTarget.value);
              }}
            />
            <div
              className={`cursor-pointer hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[28px] rounded-[${
                roundedBorders() ? "6px" : "0px"
              }]`}
              onClick={() => {
                toggleSideBar();
              }}>
              <ChevronArrows />
            </div>
          </div>
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
                    currentFolders().indexOf(
                      nextSibling.firstChild.textContent,
                    ),
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

                libraryData().folders[folder.name].games.push(gameName);
                await writeTextFile(
                  {
                    path: "data.json",
                    contents: JSON.stringify(libraryData(), null, 4),
                  },
                  {
                    dir: BaseDirectory.AppData,
                  },
                ).then(() => {
                  getData();
                });
              }
            }}
            class={` ${
              language() == "fr"
                ? "medium:h-[calc(100vh-330px)] large:h-[calc(100vh-275px)]"
                : "h-[calc(100vh-275px)]"
            } overflow-auto  rounded-[${roundedBorders() ? "6px" : "0px"}]`}>
            <p className="mt-[5px]"></p>
            <For each={currentFolders()}>
              {(folderName, i) => {
                let folder = libraryData().folders[folderName];

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
                                libraryData().folders[folderName][
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
                              libraryData().folders[
                                oldFolderName
                              ].games.indexOf(gameName);
                            libraryData().folders[oldFolderName].games.splice(
                              index,
                              1,
                            );
                          }
                          libraryData().folders[folder.name].games.push(
                            gameName,
                          );
                          await writeTextFile(
                            {
                              path: "data.json",
                              contents: JSON.stringify(libraryData(), null, 4),
                            },
                            {
                              dir: BaseDirectory.AppData,
                            },
                          ).then(() => {
                            getData();
                          });
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
                          className={` hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px] rounded-[${
                            roundedBorders() ? "6px" : "0px"
                          }]`}
                          onClick={() => {
                            document
                              .querySelector("[data-editFolderModal]")
                              .show();
                            setSelectedFolder(folder);
                            setEditedFolderName(selectedFolder().name);
                            setEditedHideFolder(selectedFolder().hide);
                          }}>
                          <Edit />
                        </button>
                      </div>
                      <For each={folder.games}>
                        {(gameName, i) => (
                          <span
                            className={`!flex gap-[5px] bg-transparent ${
                              i() == 0 ? "mt-4" : "mt-5"
                            }  sideBarGame cursor-grab `}
                            aria-label={translateText("play")}
                            draggable={true}
                            onDragStart={(e) => {
                              setTimeout(() => {
                                e.srcElement.classList.add("dragging");
                              }, 10);
                              e.dataTransfer.setData("gameName", gameName);

                              e.dataTransfer.setData(
                                "oldFolderName",
                                folderName,
                              );
                            }}
                            onDragEnd={(e) => {
                              e.srcElement.classList.remove("dragging");
                            }}
                            onClick={async (e) => {
                              await setSelectedGame(
                                libraryData().games[gameName],
                              );
                              document.querySelector("[data-gamePopup]").show();

                              if (e.ctrlKey) {
                                openGame(
                                  libraryData().games[gameName].location,
                                );
                              }
                            }}>
                            <Show when={libraryData().games[gameName].icon}>
                              <img
                                src={convertFileSrc(
                                  appDataDirPath() +
                                    "icons\\" +
                                    libraryData().games[gameName].icon,
                                )}
                                alt=""
                                className="h-[16px] aspect-square"
                              />
                            </Show>
                            <span className="text-[#00000080] dark:text-[#ffffff80] active:dark:text-[#ffffff3a] active:text-[#0000003a]">
                              {gameName}
                            </span>
                          </span>
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
                            libraryData().folders[oldFolderName].games.indexOf(
                              gameName,
                            );
                          libraryData().folders[oldFolderName].games.splice(
                            index,
                            1,
                          );
                        }
                        libraryData().folders[folder.name].games.push(gameName);
                        await writeTextFile(
                          {
                            path: "data.json",
                            contents: JSON.stringify(libraryData(), null, 4),
                          },
                          {
                            dir: BaseDirectory.AppData,
                          },
                        ).then(() => {
                          getData();
                        });
                      }}>
                      <div className="flex gap-[10px] items-center cursor-move my-[-4px]">
                        <s className="text-black cursor-move dark:text-white break-all">
                          {folder.name}
                        </s>
                        <Show when={folder.hide == true}>
                          <EyeClosed />
                        </Show>
                        <button
                          className={` hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px] rounded-[${
                            roundedBorders() ? "6px" : "0px"
                          }]`}
                          onClick={() => {
                            document
                              .querySelector("[data-editFolderModal]")
                              .show();
                            setSelectedFolder(folder);

                            setEditedFolderName(selectedFolder().name);
                            setEditedHideFolder(selectedFolder().hide);
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
                  libraryData().folders[oldFolderName].games.indexOf(gameName);

                libraryData().folders[oldFolderName].games.splice(index, 1);

                await writeTextFile(
                  {
                    path: "data.json",
                    contents: JSON.stringify(libraryData(), null, 4),
                  },
                  {
                    dir: BaseDirectory.AppData,
                  },
                ).then(() => {
                  getData();
                });
              }}>
              <div className=" flex gap-[10px] items-center cursor-default">
                <p className="pd-3 text-[#00000080] dark:text-[#ffffff80] ">
                  {translateText("uncategorized")}
                </p>
              </div>
              <For each={currentGames()}>
                {(currentGame, i) => {
                  let gamesInFolders = [];

                  for (
                    let x = 0;
                    x < Object.values(libraryData().folders).length;
                    x++
                  ) {
                    for (
                      let y = 0;
                      y < Object.values(libraryData().folders)[x].games.length;
                      y++
                    ) {
                      gamesInFolders.push(
                        Object.values(libraryData().folders)[x].games[y],
                      );
                    }
                  }
                  return (
                    <Show when={!gamesInFolders.includes(currentGame)}>
                      <p
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("gameName", currentGame);

                          e.dataTransfer.setData(
                            "oldFolderName",
                            "uncategorized",
                          );
                        }}
                        className={`!flex gap-[5px] bg-transparent ${
                          i() == 0 ? "mt-4" : "mt-5"
                        }  sideBarGame cursor-grab `}
                        aria-label={translateText("play")}
                        onClick={async (e) => {
                          await setSelectedGame(
                            libraryData().games[currentGame],
                          );
                          document.querySelector("[data-gamePopup]").show();

                          if (e.ctrlKey) {
                            openGame(libraryData().games[currentGame].location);
                          }
                        }}>
                        <Show when={libraryData().games[currentGame].icon}>
                          <img
                            src={convertFileSrc(
                              appDataDirPath() +
                                "icons\\" +
                                libraryData().games[currentGame].icon,
                            )}
                            alt=""
                            className="h-[16px] aspect-square"
                          />
                        </Show>

                        <span className="text-[#00000080] dark:text-[#ffffff80] active:dark:text-[#ffffff3a] active:text-[#0000003a]">
                          {currentGame}
                        </span>
                      </p>
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
                document.querySelector("[data-newGameModal]").show();
              }}>
              {translateText("add game")}
              <div className="opacity-50">
                <GameController />
              </div>
            </button>
            <button
              className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
              onClick={() => {
                document.querySelector("[data-newFolderModal]").show();
              }}>
              {translateText("add folder")}
              <div className="opacity-50">
                <Folder />
              </div>
            </button>
          </div>

          <div
            className={`flex ${
              language() == "fr"
                ? "medium:flex-col flex-col large:flex-row gap-0 medium:gap-0 large:gap-3"
                : "gap-3"
            }`}>
            <button
              className={`standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px] ${
                newVersionAvailable() ? "!w-[80%]" : ""
              } whitespace-nowrap`}
              onClick={() => {
                document.querySelector("[data-notepadModal]").show();
              }}>
              {translateText("notepad")}
              <div className="opacity-50">
                <Notepad />
              </div>
            </button>
            <button
              className=" standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] mt-[12px]"
              onClick={() => {
                document.querySelector("[data-settingsModal]").show();
              }}>
              {translateText("settings")}
              <Show when={newVersionAvailable()}>
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
