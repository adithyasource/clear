import { Show, useContext } from "solid-js";
import { produce } from "solid-js/store";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import {
  getData,
  generateRandomString,
  translateText,
  updateData,
} from "../Globals";
import {
  Close,
  OpenExternal,
  SaveDisk,
  TrashDelete,
} from "../components/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataUpdateContext,
  UIContext,
} from "../Globals";

export function EditGame() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataUpdateContext = useContext(DataUpdateContext);

  async function locateEditedGame() {
    dataUpdateContext.setEditedlocatedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk"],
          },
        ],
      }),
    );
  }

  async function locateEditedHeroImage() {
    dataUpdateContext.setEditedLocatedHeroImage(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"],
          },
        ],
      }),
    );
  }

  async function locateEditedGridImage() {
    dataUpdateContext.setEditedLocatedGridImage(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"],
          },
        ],
      }),
    );
  }

  async function locateEditedLogo() {
    dataUpdateContext.setEditedLocatedLogo(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"],
          },
        ],
      }),
    );
  }

  async function locateEditedIcon() {
    dataUpdateContext.setEditedLocatedIcon(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "ico"],
          },
        ],
      }),
    );
  }

  async function updateGame() {
    let previousIndex;

    if (dataUpdateContext.editedGameName() == "") {
      uiContext.setShowToast(true);
      applicationStateContext.setToastMessage(translateText("no game name"));
      setTimeout(() => {
        uiContext.setShowToast(false);
      }, 1500);
      return;
    }

    if (
      selectedDataContext.selectedGame().name !=
      dataUpdateContext.editedGameName()
    ) {
      let gameOccurances = 0;

      for (
        let x = 0;
        x < Object.keys(globalContext.libraryData.games).length;
        x++
      ) {
        if (
          dataUpdateContext.editedGameName() ==
          Object.keys(globalContext.libraryData.games)[x]
        ) {
          gameOccurances += 1;
        }
      }

      if (gameOccurances == 1) {
        uiContext.setShowToast(true);
        applicationStateContext.setToastMessage(
          dataUpdateContext.editedGameName() +
            " " +
            translateText("is already in your library"),
        );
        setTimeout(() => {
          uiContext.setShowToast(false);
        }, 1500);
        return;
      }
    }

    for (
      let i = 0;
      i < Object.values(globalContext.libraryData.folders).length;
      i++
    ) {
      for (
        let j = 0;
        j < Object.values(globalContext.libraryData.folders)[i].games.length;
        j++
      ) {
        if (
          Object.values(globalContext.libraryData.folders)[i].games[j] ==
          selectedDataContext.selectedGame().name
        ) {
          previousIndex = j;
        }
      }
    }

    globalContext.setLibraryData((data) => {
      delete data.games[selectedDataContext.selectedGame().name];
      return data;
    });

    if (!dataUpdateContext.editedGameName()) {
      dataUpdateContext.setEditedGameName(
        selectedDataContext.selectedGame().name,
      );
    }

    if (dataUpdateContext.editedFavouriteGame() == undefined) {
      dataUpdateContext.setEditedFavouriteGame(
        selectedDataContext.selectedGame().favourite,
      );
    }

    if (dataUpdateContext.editedLocatedGame() === undefined) {
      dataUpdateContext.setEditedlocatedGame(
        selectedDataContext.selectedGame().location,
      );
    } else {
      if (dataUpdateContext.editedLocatedGame() === null) {
        dataUpdateContext.setEditedlocatedGame(undefined);
      }
    }

    if (dataUpdateContext.editedLocatedGridImage() === undefined) {
      dataUpdateContext.setEditedLocatedGridImage(
        selectedDataContext.selectedGame().gridImage,
      );
    } else {
      if (dataUpdateContext.editedLocatedGridImage() === null) {
        dataUpdateContext.setEditedLocatedGridImage(undefined);
      } else {
        let gridImageFileName =
          generateRandomString() +
          "." +
          dataUpdateContext.editedLocatedGridImage().split(".")[
            dataUpdateContext.editedLocatedGridImage().split(".").length - 1
          ];
        await copyFile(
          dataUpdateContext.editedLocatedGridImage(),
          "grids\\" + gridImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          dataUpdateContext.setEditedLocatedGridImage(gridImageFileName);
        });
      }
    }

    if (dataUpdateContext.editedLocatedHeroImage() === undefined) {
      dataUpdateContext.setEditedLocatedHeroImage(
        selectedDataContext.selectedGame().heroImage,
      );
    } else {
      if (dataUpdateContext.editedLocatedHeroImage() === null) {
        dataUpdateContext.setEditedLocatedHeroImage(undefined);
      } else {
        let heroImageFileName =
          generateRandomString() +
          "." +
          dataUpdateContext.editedLocatedHeroImage().split(".")[
            dataUpdateContext.editedLocatedHeroImage().split(".").length - 1
          ];
        await copyFile(
          dataUpdateContext.editedLocatedHeroImage(),
          "heroes\\" + heroImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          dataUpdateContext.setEditedLocatedHeroImage(heroImageFileName);
        });
      }
    }

    if (dataUpdateContext.editedLocatedLogo() === undefined) {
      dataUpdateContext.setEditedLocatedLogo(
        selectedDataContext.selectedGame().logo,
      );
    } else {
      if (dataUpdateContext.editedLocatedLogo() === null) {
        dataUpdateContext.setEditedLocatedLogo(undefined);
      } else {
        let logoFileName =
          generateRandomString() +
          "." +
          dataUpdateContext.editedLocatedLogo().split(".")[
            dataUpdateContext.editedLocatedLogo().split(".").length - 1
          ];

        await copyFile(
          dataUpdateContext.editedLocatedLogo(),
          "logos\\" + logoFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          dataUpdateContext.setEditedLocatedLogo(logoFileName);
        });
      }
    }

    if (dataUpdateContext.editedLocatedIcon() === undefined) {
      dataUpdateContext.setEditedLocatedIcon(
        selectedDataContext.selectedGame().icon,
      );
    } else {
      if (dataUpdateContext.editedLocatedIcon() === null) {
        dataUpdateContext.setEditedLocatedIcon(undefined);
      } else {
        let iconFileName =
          generateRandomString() +
          "." +
          dataUpdateContext.editedLocatedIcon().split(".")[
            dataUpdateContext.editedLocatedIcon().split(".").length - 1
          ];

        await copyFile(
          dataUpdateContext.editedLocatedIcon(),
          "icons\\" + iconFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          dataUpdateContext.setEditedLocatedIcon(iconFileName);
        });
      }
    }

    globalContext.setLibraryData("games", dataUpdateContext.editedGameName(), {
      location: dataUpdateContext.editedLocatedGame(),
      name: dataUpdateContext.editedGameName(),
      heroImage: dataUpdateContext.editedLocatedHeroImage(),
      gridImage: dataUpdateContext.editedLocatedGridImage(),
      logo: dataUpdateContext.editedLocatedLogo(),
      icon: dataUpdateContext.editedLocatedIcon(),
      favourite: dataUpdateContext.editedFavouriteGame(),
    });

    function getCurrentFolder() {
      let folders = Object.values(globalContext.libraryData.folders);

      for (let i = 0; i < folders.length; i++) {
        let games = folders[i].games;
        for (let j = 0; j < games.length; j++) {
          if (games[j] == selectedDataContext.selectedGame().name) {
            let currentFolder = folders[i].name;
            return currentFolder;
          }
        }
      }
    }

    let currentFolder = getCurrentFolder();

    for (
      let j = 0;
      j < globalContext.libraryData.folders[currentFolder].games.length;
      j++
    ) {
      if (
        globalContext.libraryData.folders[currentFolder].games[j] ==
        selectedDataContext.selectedGame().name
      ) {
        globalContext.setLibraryData(
          produce((data) => {
            data.folders[currentFolder].games.splice(j, 1);
            data.folders[currentFolder].games.splice(
              previousIndex,
              0,
              dataUpdateContext.editedGameName(),
            );

            return data;
          }),
        );
      }
    }

    await updateData();
    selectedDataContext.setSelectedGame({});
    getData();
    document.querySelector("[data-editGameModal]").close();
  }

  async function deleteGame() {
    globalContext.setLibraryData((data) => {
      delete data.games[selectedDataContext.selectedGame().name];
      return data;
    });

    let folders = Object.values(globalContext.libraryData.folders);

    for (let i = 0; i < folders.length; i++) {
      for (let j = 0; j < folders[i].games.length; j++) {
        if (folders[i].games[j] == selectedDataContext.selectedGame().name) {
          globalContext.setLibraryData(
            produce((data) => {
              Object.values(data.folders)[i].games.splice(j, 1);
              return data;
            }),
          );
        }
      }
    }

    await updateData();

    getData();
  }

  return (
    <dialog
      data-editGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      ref={(ref) => {
        function handleTab(e) {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }

        ref.addEventListener("keydown", handleTab);

        ref.addEventListener("close", () => {
          previouslyFocusedElement.focus();
        });
      }}
      onClose={() => {
        dataUpdateContext.setEditedFavouriteGame();
        dataUpdateContext.setEditedGameName(undefined);
        dataUpdateContext.setEditedLocatedGridImage(undefined);
        dataUpdateContext.setEditedLocatedHeroImage(undefined);
        dataUpdateContext.setEditedLocatedLogo(undefined);
        dataUpdateContext.setEditedLocatedIcon(undefined);
        uiContext.setShowDeleteConfirm(false);
        dataUpdateContext.setEditedlocatedGame(undefined);
        getData();
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#d1d1d1cc]">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-3">
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <div>
            <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
              {translateText("edit")} {selectedDataContext.selectedGame().name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="cursor-pointer"
              onClick={() => {
                if (dataUpdateContext.editedFavouriteGame() == undefined) {
                  dataUpdateContext.setEditedFavouriteGame(
                    !selectedDataContext.selectedGame().favourite,
                  );
                } else {
                  dataUpdateContext.setEditedFavouriteGame((x) => !x);
                }
              }}>
              <Show when={dataUpdateContext.editedFavouriteGame() == undefined}>
                <Show when={selectedDataContext.selectedGame().favourite}>
                  <div className="relative">
                    <div className="!w-max"> {translateText("favourite")}</div>
                    <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                      {translateText("favourite")}
                    </div>
                  </div>
                </Show>
                <Show when={!selectedDataContext.selectedGame().favourite}>
                  <div className="!w-max"> {translateText("favourite")}</div>
                </Show>
              </Show>

              <Show when={dataUpdateContext.editedFavouriteGame() == true}>
                <div className="relative">
                  <div className="!w-max"> {translateText("favourite")}</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                    {translateText("favourite")}
                  </div>
                </div>
              </Show>

              <Show when={dataUpdateContext.editedFavouriteGame() == false}>
                <div className="!w-max">favourite</div>
              </Show>
            </button>
            <button
              onClick={updateGame}
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] ">
              <div className="!w-max"> {translateText("save")}</div>
              <SaveDisk />
            </button>
            <button
              onClick={() => {
                uiContext.showDeleteConfirm()
                  ? deleteGame()
                  : uiContext.setShowDeleteConfirm(true);

                setTimeout(() => {
                  uiContext.setShowDeleteConfirm(false);
                }, 1500);
              }}
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] ">
              <span className="text-[#FF3636] w-max">
                {uiContext.showDeleteConfirm()
                  ? translateText("confirm?")
                  : translateText("delete")}
              </span>
              <TrashDelete />
            </button>
            <button
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !gap-0 "
              onClick={() => {
                document.querySelector("[data-editGameModal]").close();
                getData();
              }}>
              ​
              <Close />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={locateEditedGridImage}
            onContextMenu={() => {
              dataUpdateContext.setEditedLocatedGridImage(null);
            }}
            className="panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] locatingGridImg h-full aspect-[2/3] group relative overflow-hidden"
            aria-label="grid/cover">
            <Show
              when={dataUpdateContext.editedLocatedGridImage() === undefined}>
              <img
                className="absolute inset-0 aspect-[2/3]"
                src={convertFileSrc(
                  applicationStateContext.appDataDirPath() +
                    "grids\\" +
                    selectedDataContext.selectedGame().gridImage,
                )}
                alt=""
              />
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
            <Show when={dataUpdateContext.editedLocatedGridImage()}>
              <img
                className="absolute inset-0 aspect-[2/3]"
                src={convertFileSrc(dataUpdateContext.editedLocatedGridImage())}
                alt=""
              />
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
            <Show when={dataUpdateContext.editedLocatedGridImage() === null}>
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
          </button>

          <div className="flex flex-col gap-3 relative">
            <button
              onClick={locateEditedHeroImage}
              onContextMenu={() => {
                dataUpdateContext.setEditedLocatedHeroImage(null);
              }}
              className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
              aria-label="hero">
              <Show
                when={dataUpdateContext.editedLocatedHeroImage() === null}
                className="absolute inset-0 overflow-hidden">
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                  {translateText("hero")}
                </span>
              </Show>
              <Show
                when={dataUpdateContext.editedLocatedHeroImage() === undefined}
                className="absolute inset-0 overflow-hidden">
                <img
                  src={convertFileSrc(
                    applicationStateContext.appDataDirPath() +
                      "heroes\\" +
                      selectedDataContext.selectedGame().heroImage,
                  )}
                  alt=""
                  className="absolute inset-0  aspect-[96/31]  h-full  rounded-[6px]"
                />
                <img
                  src={convertFileSrc(
                    applicationStateContext.appDataDirPath() +
                      "heroes\\" +
                      selectedDataContext.selectedGame().heroImage,
                  )}
                  alt=""
                  className="absolute inset-0 aspect-[96/31]  -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.6]"
                />
              </Show>
              <Show
                when={dataUpdateContext.editedLocatedHeroImage()}
                className="absolute inset-0 overflow-hidden">
                <img
                  src={convertFileSrc(
                    dataUpdateContext.editedLocatedHeroImage(),
                  )}
                  alt=""
                  className="absolute inset-0  aspect-[96/31] h-full rounded-[6px]"
                />
                <img
                  src={convertFileSrc(
                    dataUpdateContext.editedLocatedHeroImage(),
                  )}
                  alt=""
                  className="absolute inset-0 -z-10 aspect-[96/31]  h-full rounded-[6px] blur-[80px] opacity-[0.6]"
                />
              </Show>

              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                {translateText("hero")}
              </span>
            </button>

            <Show when={selectedDataContext.selectedGame().logo}>
              <button
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  dataUpdateContext.setEditedLocatedLogo(null);
                }}
                className={`panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] !bg-[#27272700] group  absolute bottom-[70px] left-[20px] ${
                  selectedDataContext.selectedGame().logo
                    ? ""
                    : "!w-[200px] !h-[65px]"
                } `}
                aria-label="logo">
                <Show
                  when={dataUpdateContext.editedLocatedLogo() === undefined}>
                  <img
                    src={convertFileSrc(
                      applicationStateContext.appDataDirPath() +
                        "logos\\" +
                        selectedDataContext.selectedGame().logo,
                    )}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={dataUpdateContext.editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(dataUpdateContext.editedLocatedLogo())}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={dataUpdateContext.editedLocatedLogo() === null}>
                  <div
                    className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] relative bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      globalContext.libraryData.userSettings.roundedBorders
                        ? "6px"
                        : "0px"
                    }]`}
                  />
                </Show>

                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                  {translateText("logo")}
                </span>
              </button>
            </Show>
            <Show when={!selectedDataContext.selectedGame().logo}>
              <button
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  dataUpdateContext.setEditedLocatedLogo(null);
                }}
                className={`panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] !bg-[#27272700] group  absolute bottom-[60px] left-[20px] max-large:bottom-[40px] ${
                  selectedDataContext.selectedGame().logo
                    ? ""
                    : "!w-[200px] !h-[65px]"
                } `}
                aria-label="logo">
                <Show when={dataUpdateContext.editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(dataUpdateContext.editedLocatedLogo())}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={!dataUpdateContext.editedLocatedLogo()}>
                  <div
                    className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] relative bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      globalContext.libraryData.userSettings.roundedBorders
                        ? "6px"
                        : "0px"
                    }]`}
                  />
                </Show>

                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[45%] left-[55%] top-[65%] opacity-0">
                  {translateText("logo")}
                </span>
              </button>
            </Show>

            <div className="flex gap-3 items-center cursor-pointer">
              <button
                onClick={locateEditedIcon}
                onContextMenu={() => {
                  dataUpdateContext.setEditedLocatedIcon(null);
                }}
                className="relative !bg-[#27272700] group p-0"
                aria-label="logo">
                <Show
                  when={dataUpdateContext.editedLocatedIcon() === undefined}>
                  <Show when={selectedDataContext.selectedGame().icon}>
                    <img
                      src={convertFileSrc(
                        applicationStateContext.appDataDirPath() +
                          "icons\\" +
                          selectedDataContext.selectedGame().icon,
                      )}
                      alt=""
                      className="w-[40px] h-[40px] "
                    />
                  </Show>
                  <Show when={!selectedDataContext.selectedGame().icon}>
                    <div
                      className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                        globalContext.libraryData.userSettings.roundedBorders
                          ? "6px"
                          : "0px"
                      }]`}
                    />
                  </Show>
                </Show>
                <Show when={dataUpdateContext.editedLocatedIcon()}>
                  <img
                    src={convertFileSrc(dataUpdateContext.editedLocatedIcon())}
                    alt=""
                    className="w-[40px] h-[40px] "
                  />
                </Show>
                <Show when={dataUpdateContext.editedLocatedIcon() === null}>
                  <div
                    className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      globalContext.libraryData.userSettings.roundedBorders
                        ? "6px"
                        : "0px"
                    }]`}
                  />
                </Show>
                <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0">
                  {translateText("icon")}
                </span>
              </button>

              <input
                aria-autocomplete="none"
                type="text"
                style="flex-grow: 1"
                name=""
                id=""
                onInput={(e) => {
                  dataUpdateContext.setEditedGameName(e.currentTarget.value);
                }}
                className="dark:bg-[#272727cc] bg-[#E8E8E8cc] backdrop-blur-[10px]"
                placeholder={translateText("name of game")}
                value={selectedDataContext.selectedGame().name}
              />
              <button
                onClick={locateEditedGame}
                onContextMenu={() => {
                  dataUpdateContext.setEditedlocatedGame(null);
                }}
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0">
                <Show
                  when={dataUpdateContext.editedLocatedGame() === undefined}>
                  <Show when={selectedDataContext.selectedGame().location}>
                    {selectedDataContext
                      .selectedGame()
                      ["location"].toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                      ? "..." +
                        selectedDataContext
                          .selectedGame()
                          ["location"].toString()
                          .split("\\")
                          .slice(-1)
                          .toString()
                          .slice(0, 7) +
                        "..." +
                        selectedDataContext
                          .selectedGame()
                          ["location"].toString()
                          .slice(-7)
                      : "..." +
                        selectedDataContext
                          .selectedGame()
                          ["location"].toString()
                          .split("\\")
                          .slice(-1)
                          .toString()}
                  </Show>
                  <Show when={!selectedDataContext.selectedGame().location}>
                    {" "}
                    {translateText("locate game")}
                  </Show>
                </Show>
                <Show when={dataUpdateContext.editedLocatedGame() === null}>
                  {translateText("locate game")}
                </Show>
                <Show when={dataUpdateContext.editedLocatedGame()}>
                  {dataUpdateContext
                    .editedLocatedGame()
                    .toString()
                    .split("\\")
                    .slice(-1)
                    .toString().length > 17
                    ? "..." +
                      dataUpdateContext
                        .editedLocatedGame()
                        .toString()
                        .split("\\")
                        .slice(-1)
                        .toString()
                        .slice(0, 7) +
                      "..." +
                      dataUpdateContext.editedLocatedGame().toString().slice(-7)
                    : "..." +
                      dataUpdateContext
                        .editedLocatedGame()
                        .toString()
                        .split("\\")
                        .slice(-1)
                        .toString()}
                </Show>
              </button>

              <Show when={selectedDataContext.selectedGame().location}>
                <Show
                  when={
                    selectedDataContext
                      .selectedGame()
                      .location.split("//")[0] != "steam:"
                  }>
                  <button
                    onClick={() => {
                      invoke("open_location", {
                        location: selectedDataContext
                          .selectedGame()
                          .location.split("\\")
                          .slice(0, -1)
                          .join("\\"),
                      });
                    }}
                    className="relative group standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max"
                    aria-label="logo">
                    <OpenExternal />

                    <span class="absolute tooltip group-hover:opacity-100 left-[-150%] top-[120%] opacity-0">
                      {translateText("open containing folder")}
                    </span>
                  </button>
                </Show>
              </Show>
            </div>
          </div>
        </div>
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <span className=" opacity-50">
            {translateText("right click to empty image selection")}
          </span>
        </div>
      </div>
    </dialog>
  );
}
