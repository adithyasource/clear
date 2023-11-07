import {
  libraryData,
  selectedFolder,
  setSelectedFolder,
  currentGames,
  currentFolders,
  searchValue,
  setSearchValue,
  setNotificaitonGameName,
  gameName,
  setEditedFolderName,
  setEditedHideFolder,
  roundedBorders,
} from "./Signals";

import { For, Show, onMount } from "solid-js";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData, openGame } from "./App";

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
        path: "lib.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(getData());
  }

  async function moveFolder(folderName, toPosition) {
    let pastPositionOfFolder = currentFolders().indexOf(folderName);

    console.log(currentFolders());
    currentFolders().splice(pastPositionOfFolder, 1);

    if (toPosition == -1) {
      currentFolders().push(folderName);
    } else {
      if (toPosition > pastPositionOfFolder) {
        currentFolders().splice(toPosition - 1, 0, folderName);
        console.log("greater than");
      } else {
        currentFolders().splice(toPosition, 0, folderName);
        console.log("less than");
      }
    }

    console.log(currentFolders());

    for (let x = 0; x < currentFolders().length; x++) {
      for (let y = 0; y < Object.keys(libraryData()["folders"]).length; y++) {
        if (currentFolders()[x] == Object.keys(libraryData()["folders"])[y]) {
          Object.values(libraryData()["folders"])[y].index = x;
        }
      }
    }

    await writeTextFile(
      {
        path: "lib.json",
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

    console.log(toPosition, pastPositionOfGame);

    if (toPosition == -1) {
      libraryData().folders[currentFolderName]["games"].push(gameName);
    } else {
      if (toPosition > pastPositionOfGame) {
        libraryData().folders[currentFolderName]["games"].splice(
          toPosition - 1,
          0,
          gameName,
        );
        console.log("greater than");
      } else {
        libraryData().folders[currentFolderName]["games"].splice(
          toPosition,
          0,
          gameName,
        );
        console.log("less than");
      }
    }

    await writeTextFile(
      {
        path: "lib.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {});
  }

  return (
    <>
      <div
        id="sideBar"
        className="text-black z-10 py-[20px] pl-[20px] relative overflow-hidden w-[20%] min-[1500px]:w-[15%]">
        <div id="sideBarTop ">
          <div id="searchAndDestroy">
            <input
              type="text"
              name=""
              id="searchInput"
              className="dark:bg-[#232323] bg-[#E8E8E8] dark:text-white text-black"
              placeholder="search"
              onInput={(e) => {
                setSearchValue(e.currentTarget.value);
                console.log(searchValue());
              }}
            />
            <svg
              onClick={toggleSideBar}
              style="cursor: pointer;"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 11L1 6L6 1"
                className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 11L6 6L11 1"
                className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div
            id="sideBarFolders"
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
                    compensatedY <=
                    sibling.offsetTop + sibling.offsetHeight / 2 + 32
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
                    compensatedY <=
                    sibling.offsetTop + sibling.offsetHeight / 2 + 32
                  );
                });

                console.log(folderName);

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
                  console.log(error);
                  getData();
                }

                libraryData().folders[folder.name].games.push(gameName);
                await writeTextFile(
                  {
                    path: "lib.json",
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
            class={`h-[calc(100vh-275px-32px)] overflow-auto  rounded-[${
              roundedBorders() ? "6px" : "0px"
            }]`}>
            <p className="mt-[5px]"></p>
            <For each={currentFolders()}>
              {(folderName) => {
                let folder = libraryData().folders[folderName];

                if (folder.games.length > 0) {
                  return (
                    <div
                      className="sideBarFolder"
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
                              sibling.offsetTop + sibling.offsetHeight / 2 + 32
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
                                sibling.offsetTop +
                                  sibling.offsetHeight / 2 +
                                  32
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
                              console.log(error);
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
                              path: "lib.json",
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
                      <div className="folderTitleBar">
                        <span className="text-black dark:text-white">
                          {folder.name}
                        </span>
                        <button
                          className="editButton"
                          onClick={() => {
                            document
                              .querySelector("[data-editFolderModal]")
                              .show();
                            setSelectedFolder(folder);

                            setEditedFolderName(selectedFolder().name);
                            setEditedHideFolder(selectedFolder().hide);
                          }}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M2.5 11.5L12.5 1.50002C13.3284 0.671585 14.6716 0.671585 15.5 1.50002C16.3284 2.32845 16.3284 3.67159 15.5 4.50002L5.5 14.5L1.5 15.5L2.5 11.5Z"
                              className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <For each={folder.games}>
                        {(gameName) => (
                          <p
                            className="mt-5 sideBarGame text-[#00000080] dark:text-[#ffffff80]"
                            aria-label="play"
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
                            onClick={(e) => {
                              if (e.ctrlKey) {
                                setNotificaitonGameName(gameName);
                                openGame(
                                  libraryData().games[gameName].location,
                                );
                              }
                            }}>
                            {gameName}
                          </p>
                        )}
                      </For>
                      <p className="mt-2 sideBarGame"></p>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="sideBarFolder"
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
                            path: "lib.json",
                            contents: JSON.stringify(libraryData(), null, 4),
                          },
                          {
                            dir: BaseDirectory.AppData,
                          },
                        ).then(() => {
                          getData();
                        });
                      }}>
                      <div className="folderTitleBar">
                        <s className="text-black emptyFolderTitleBar dark:text-white">
                          {folder.name}
                        </s>
                        <button
                          className="editButton"
                          onClick={() => {
                            document
                              .querySelector("[data-editFolderModal]")
                              .show();
                            setSelectedFolder(folder);

                            setEditedFolderName(selectedFolder().name);
                            setEditedHideFolder(selectedFolder().hide);
                          }}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M2.5 11.5L12.5 1.50002C13.3284 0.671585 14.6716 0.671585 15.5 1.50002C16.3284 2.32845 16.3284 3.67159 15.5 4.50002L5.5 14.5L1.5 15.5L2.5 11.5Z"
                              className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                }
              }}
            </For>
            {/* uncategorized */}

            <div
              className="sideBarFolder"
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
                    path: "lib.json",
                    contents: JSON.stringify(libraryData(), null, 4),
                  },
                  {
                    dir: BaseDirectory.AppData,
                  },
                ).then(() => {
                  getData();
                });
              }}>
              <div id="uncategorizedTitleBar" className=" folderTitleBar">
                <p className=" pd-3 text-[#00000080] dark:text-[#ffffff80]">
                  uncategorized
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
                        className="mt-5 sideBarGame"
                        aria-label="play"
                        onClick={(e) => {
                          if (e.ctrlKey) {
                            setNotificaitonGameName(currentGame);
                            openGame(libraryData().games[currentGame].location);
                          }
                        }}>
                        {currentGame}
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
          class="absolute bottom-[20px] w-[100%] pr-[20px]">
          <button
            className="standardButton dark:bg-[#232323] text-black dark:text-white bg-[#E8E8E8]"
            onClick={() => {
              document.querySelector("[data-newGameModal]").show();
            }}>
            add game
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 9V13M6 11H10M17 10.0161L17.0161 10M14 12.0161L14.0161 12M16.1836 5H7.81641C5.60774 5 3.71511 6.57359 3.32002 8.73845L2.0451 15.7241C1.84609 16.8145 2.31653 17.9185 3.24219 18.5333C4.3485 19.268 5.82159 19.1227 6.76177 18.1861L7.99615 16.9563C8.36513 16.5887 8.86556 16.3822 9.38737 16.3822H14.6126C15.1344 16.3822 15.6349 16.5887 16.0038 16.9563L17.2382 18.1861C18.1784 19.1227 19.6515 19.268 20.7578 18.5333C21.6835 17.9185 22.1539 16.8145 21.9549 15.7241L20.68 8.73845C20.2849 6.57359 18.3923 5 16.1836 5Z"
                className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </button>
          <button
            className="standardButton dark:bg-[#232323] text-black dark:text-white bg-[#E8E8E8]"
            onClick={() => {
              document.querySelector("[data-newFolderModal]").show();
            }}>
            add folder
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 21H20C21.1046 21 22 20.1046 22 19V8C22 6.89543 21.1046 6 20 6H11L9.29687 3.4453C9.1114 3.1671 8.79917 3 8.46482 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21Z"
                className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M12 10V16M9 13H15"
                className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </button>

          <div className="flex gap-3">
            <button
              className=" standardButton dark:bg-[#232323] text-black dark:text-white bg-[#E8E8E8]"
              onClick={() => {
                document.querySelector("[data-notepadModal]").show();
              }}>
              notepad
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 22H18C19.1046 22 20 21.1046 20 20V9.82843C20 9.29799 19.7893 8.78929 19.4142 8.41421L13.5858 2.58579C13.2107 2.21071 12.702 2 12.1716 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22Z"
                  className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M13 2.5V9H19"
                  className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <button
              className=" standardButton dark:bg-[#232323] text-black dark:text-white bg-[#E8E8E8]"
              onClick={() => {
                document.querySelector("[data-settingsModal]").show();
              }}>
              settings
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.0761 3.16311C10.136 2.50438 10.6883 2 11.3497 2H12.6503C13.3117 2 13.864 2.50438 13.9239 3.16311C13.9731 3.70392 14.3623 4.14543 14.8708 4.336C15.0015 4.38499 15.1307 4.43724 15.2582 4.49263C15.7613 4.71129 16.3531 4.66938 16.7745 4.31818C17.2953 3.8842 18.0611 3.91894 18.5404 4.39829L19.4584 5.31623C19.9154 5.77326 19.9485 6.50338 19.5347 6.99992C19.1901 7.41349 19.158 7.99745 19.3897 8.48341C19.49 8.69386 19.5816 8.90926 19.664 9.12916C19.8546 9.63767 20.2961 10.0269 20.8369 10.0761C21.4956 10.136 22 10.6883 22 11.3497V12.6503C22 13.3117 21.4956 13.864 20.8369 13.9239C20.2961 13.9731 19.8546 14.3623 19.664 14.8708C19.59 15.0682 19.5086 15.262 19.4202 15.4518C19.2053 15.913 19.2401 16.4637 19.5658 16.8546C19.962 17.33 19.9303 18.0291 19.4927 18.4667L18.4667 19.4927C18.0291 19.9303 17.33 19.962 16.8546 19.5658C16.4637 19.2401 15.913 19.2053 15.4518 19.4202C15.262 19.5086 15.0682 19.59 14.8708 19.664C14.3623 19.8546 13.9731 20.2961 13.9239 20.8369C13.864 21.4956 13.3117 22 12.6503 22H11.3497C10.6883 22 10.136 21.4956 10.0761 20.8369C10.0269 20.2961 9.63767 19.8546 9.12917 19.664C8.90927 19.5816 8.69387 19.49 8.48343 19.3897C7.99746 19.158 7.4135 19.1901 6.99992 19.5347C6.50338 19.9485 5.77325 19.9154 5.31622 19.4584L4.39829 18.5404C3.91893 18.0611 3.8842 17.2953 4.31818 16.7745C4.66939 16.3531 4.71129 15.7613 4.49263 15.2582C4.43724 15.1307 4.385 15.0016 4.336 14.8708C4.14544 14.3623 3.70392 13.9731 3.16311 13.9239C2.50438 13.864 2 13.3117 2 12.6503V11.3497C2 10.6883 2.50438 10.136 3.16311 10.0761C3.70393 10.0269 4.14544 9.63768 4.33601 9.12917C4.3936 8.9755 4.45568 8.82402 4.52209 8.67489C4.7571 8.14716 4.71804 7.52257 4.34821 7.07877C3.89722 6.53758 3.93332 5.74179 4.43145 5.24365L5.24364 4.43146C5.74178 3.93332 6.53757 3.89722 7.07876 4.34822C7.52256 4.71805 8.14715 4.7571 8.67488 4.52209C8.82401 4.45568 8.97549 4.3936 9.12916 4.33601C9.63767 4.14544 10.0269 3.70393 10.0761 3.16311Z"
                  className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
