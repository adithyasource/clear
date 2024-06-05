import { Match, Show, Switch, useContext } from "solid-js";
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
  closeDialog,
} from "../Globals";
import { Close, OpenExternal, SaveDisk, TrashDelete } from "../libraries/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataUpdateContext,
  UIContext,
} from "../Globals";
import { triggerToast } from "../Globals";

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

    if (dataUpdateContext.editedGameName() === "") {
      triggerToast(translateText("no game name"));
      return;
    }

    if (
      selectedDataContext.selectedGame().name !==
      dataUpdateContext.editedGameName()
    ) {
      let gameNameAlreadyExists = false;

      for (gameName of Object.keys(globalContext.libraryData.games)) {
        if (dataUpdateContext.editedGameName() === gameName) {
          gameNameAlreadyExists = true;
        }
      }

      if (gameNameAlreadyExists) {
        triggerToast(
          `${dataUpdateContext.editedGameName()} ${translateText("is already in your library")}`,
        );
        return;
      }
    }

    for (const folder of Object.values(globalContext.libraryData.folders)) {
      for (const gameName of folder.games) {
        if (gameName === selectedDataContext.selectedGame().name) {
          previousIndex = folder.games.indexOf(gameName);
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

    if (dataUpdateContext.editedFavouriteGame() === undefined) {
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
        const gridImageFileName = `${generateRandomString()}.${
          dataUpdateContext.editedLocatedGridImage().split(".")[
            dataUpdateContext.editedLocatedGridImage().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataUpdateContext.editedLocatedGridImage()}grids\\${gridImageFileName}`,
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
        const heroImageFileName = `${generateRandomString()}.${
          dataUpdateContext.editedLocatedHeroImage().split(".")[
            dataUpdateContext.editedLocatedHeroImage().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataUpdateContext.editedLocatedHeroImage()}heroes\\${heroImageFileName}`,
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
        const logoFileName = `${generateRandomString()}.${
          dataUpdateContext.editedLocatedLogo().split(".")[
            dataUpdateContext.editedLocatedLogo().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataUpdateContext.editedLocatedLogo()}logos\\${logoFileName}`,
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
        const iconFileName = `${generateRandomString()}.${
          dataUpdateContext.editedLocatedIcon().split(".")[
            dataUpdateContext.editedLocatedIcon().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataUpdateContext.editedLocatedIcon()}icons\\${iconFileName}`,
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

    for (const folder of Object.values(globalContext.libraryData.folders)) {
      for (const gameName of folder.games) {
        if (gameName === selectedDataContext.selectedGame().name) {
          if (gameName === selectedDataContext.selectedGame().name) {
            globalContext.setLibraryData(
              produce((data) => {
                data.folders[folder.name].games.splice(
                  folder.games.indexOf(gameName),
                  1,
                );
                data.folders[folder.name].games.splice(
                  previousIndex,
                  0,
                  dataUpdateContext.editedGameName(),
                );

                return data;
              }),
            );
          }
        }
      }
    }

    await updateData();
    selectedDataContext.setSelectedGame({});
    getData();
    closeDialog("editGameModal");
  }

  async function deleteGame() {
    globalContext.setLibraryData((data) => {
      delete data.games[selectedDataContext.selectedGame().name];
      return data;
    });

    for (const folder of Object.values(globalContext.libraryData.folders)) {
      for (const gameName of folder.games) {
        if (gameName === selectedDataContext.selectedGame().name) {
          globalContext.setLibraryData(
            produce((data) => {
              data.folders[folder.name].games.splice(
                folder.games.indexOf(gameName),
                1,
              );

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
        closeDialog("editGameModal", ref);

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
      className="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d1cc] dark:bg-[#121212cc]">
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
        <div className="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p className="text-[25px] text-[#000000] dark:text-[#ffffff80]">
              {translateText("edit")} {selectedDataContext.selectedGame().name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                if (dataUpdateContext.editedFavouriteGame() === undefined) {
                  dataUpdateContext.setEditedFavouriteGame(
                    !selectedDataContext.selectedGame().favourite,
                  );
                } else {
                  dataUpdateContext.setEditedFavouriteGame((x) => !x);
                }
              }}>
              <Switch>
                <Match
                  when={dataUpdateContext.editedFavouriteGame() === undefined}>
                  <Show
                    when={selectedDataContext.selectedGame().favourite}
                    fallback={
                      <div className="!w-max">{translateText("favourite")}</div>
                    }>
                    <div className="relative">
                      <div className="!w-max">{translateText("favourite")}</div>
                      <div className="absolute inset-0 -z-10 !w-max opacity-70 blur-[5px]">
                        {translateText("favourite")}
                      </div>
                    </div>
                  </Show>
                </Match>

                <Match when={dataUpdateContext.editedFavouriteGame() === true}>
                  <div className="relative">
                    <div className="!w-max"> {translateText("favourite")}</div>
                    <div className="absolute inset-0 -z-10 !w-max opacity-70 blur-[5px]">
                      {translateText("favourite")}
                    </div>
                  </div>
                </Match>

                <Match when={dataUpdateContext.editedFavouriteGame() === false}>
                  <div className="!w-max">favourite</div>
                </Match>
              </Switch>
            </button>
            <button
              type="button"
              onClick={updateGame}
              className="standardButton flex items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <div className="!w-max"> {translateText("save")}</div>
              <SaveDisk />
            </button>
            <button
              type="button"
              onClick={() => {
                uiContext.showDeleteConfirm()
                  ? deleteGame()
                  : uiContext.setShowDeleteConfirm(true);

                setTimeout(() => {
                  uiContext.setShowDeleteConfirm(false);
                }, 1500);
              }}
              className="standardButton flex items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <span className="w-max text-[#FF3636]">
                {uiContext.showDeleteConfirm()
                  ? translateText("confirm?")
                  : translateText("delete")}
              </span>
              <TrashDelete />
            </button>
            <button
              type="button"
              className="standardButton flex items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] "
              onClick={() => {
                closeDialog("editGameModal");
                getData();
              }}>
              ​
              <Close />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={locateEditedGridImage}
            onContextMenu={() => {
              dataUpdateContext.setEditedLocatedGridImage(null);
            }}
            className="panelButton locatingGridImg group relative aspect-[2/3] h-full cursor-pointer overflow-hidden bg-[#f1f1f1] dark:bg-[#1c1c1c]"
            aria-label="grid/cover">
            <Switch>
              <Match
                when={dataUpdateContext.editedLocatedGridImage() === undefined}>
                <img
                  className="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(
                    `${applicationStateContext.appDataDirPath()}grids\\${selectedDataContext.selectedGame().gridImage}`,
                  )}
                  alt=""
                />
                <span class="tooltip absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={dataUpdateContext.editedLocatedGridImage()}>
                <img
                  className="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(
                    dataUpdateContext.editedLocatedGridImage(),
                  )}
                  alt=""
                />
                <span class="tooltip absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={dataUpdateContext.editedLocatedGridImage() === null}>
                <span class="tooltip absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
            </Switch>
          </button>

          <div className="relative flex flex-col gap-3">
            <button
              type="button"
              onClick={locateEditedHeroImage}
              onContextMenu={() => {
                dataUpdateContext.setEditedLocatedHeroImage(null);
              }}
              className="panelButton group relative m-0 aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 dark:bg-[#1c1c1c] max-large:h-[250px]"
              aria-label="hero">
              <Switch>
                <Match
                  when={dataUpdateContext.editedLocatedHeroImage() === null}
                  className="absolute inset-0 overflow-hidden">
                  <span class="tooltip absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%]">
                    {translateText("hero")}
                  </span>
                </Match>
                <Match
                  when={
                    dataUpdateContext.editedLocatedHeroImage() === undefined
                  }
                  className="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}heroes\\${selectedDataContext.selectedGame().heroImage}`,
                    )}
                    alt=""
                    className="absolute inset-0  aspect-[96/31]  h-full  rounded-[6px]"
                  />
                  <img
                    src={convertFileSrc(
                      `${applicationStateContext.appDataDirPath()}heroes\\${selectedDataContext.selectedGame().heroImage}`,
                    )}
                    alt=""
                    className="absolute inset-0 -z-10  aspect-[96/31] h-full rounded-[6px] opacity-[0.6] blur-[80px]"
                  />
                </Match>
                <Match
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
                    className="absolute inset-0 -z-10 aspect-[96/31]  h-full rounded-[6px] opacity-[0.6] blur-[80px]"
                  />
                </Match>
              </Switch>

              <span class="tooltip absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%]">
                {translateText("hero")}
              </span>
            </button>

            <Show
              when={selectedDataContext.selectedGame().logo}
              fallback={
                <button
                  type="button"
                  onClick={locateEditedLogo}
                  onContextMenu={() => {
                    dataUpdateContext.setEditedLocatedLogo(null);
                  }}
                  className={`panelButton group absolute bottom-[60px] left-[20px] cursor-pointer  !bg-[#27272700] bg-[#f1f1f1] dark:bg-[#1c1c1c] max-large:bottom-[40px] ${
                    selectedDataContext.selectedGame().logo
                      ? ""
                      : "!h-[65px] !w-[200px]"
                  } `}
                  aria-label="logo">
                  <Show
                    when={dataUpdateContext.editedLocatedLogo()}
                    fallback={
                      <div className="relative h-[90px] w-[250px] bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[70px] max-large:w-[170px]" />
                    }>
                    <img
                      src={convertFileSrc(
                        dataUpdateContext.editedLocatedLogo(),
                      )}
                      alt=""
                      className="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Show>

                  <span class="tooltip absolute left-[55%] top-[65%] opacity-0 group-hover:opacity-100 max-large:left-[35%] max-large:top-[45%]">
                    {translateText("logo")}
                  </span>
                </button>
              }>
              <button
                type="button"
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  dataUpdateContext.setEditedLocatedLogo(null);
                }}
                className={`panelButton group absolute bottom-[70px] left-[20px] cursor-pointer  !bg-[#27272700] bg-[#f1f1f1] dark:bg-[#1c1c1c] ${
                  selectedDataContext.selectedGame().logo
                    ? ""
                    : "!h-[65px] !w-[200px]"
                } `}
                aria-label="logo">
                <Switch>
                  <Match
                    when={dataUpdateContext.editedLocatedLogo() === undefined}>
                    <img
                      src={convertFileSrc(
                        `${applicationStateContext.appDataDirPath()}logos\\${selectedDataContext.selectedGame().logo}`,
                      )}
                      alt=""
                      className="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedLogo()}>
                    <img
                      src={convertFileSrc(
                        dataUpdateContext.editedLocatedLogo(),
                      )}
                      alt=""
                      className="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedLogo() === null}>
                    <div className="relative h-[90px] w-[250px] bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[70px] max-large:w-[170px]" />
                  </Match>
                </Switch>

                <span class="tooltip absolute left-[40%] top-[35%] opacity-0 group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%]">
                  {translateText("logo")}
                </span>
              </button>
            </Show>

            <div className="flex cursor-pointer items-center gap-3">
              <button
                type="button"
                onClick={locateEditedIcon}
                onContextMenu={() => {
                  dataUpdateContext.setEditedLocatedIcon(null);
                }}
                className="group relative !bg-[#27272700] p-0"
                aria-label="logo">
                <Switch>
                  <Match
                    when={dataUpdateContext.editedLocatedIcon() === undefined}>
                    <Show
                      when={selectedDataContext.selectedGame().icon}
                      fallback={
                        <div className="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                      }>
                      <img
                        src={convertFileSrc(
                          `${applicationStateContext.appDataDirPath()}icons\\${selectedDataContext.selectedGame().icon}`,
                        )}
                        alt=""
                        className="h-[40px] w-[40px] "
                      />
                    </Show>
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedIcon()}>
                    <img
                      src={convertFileSrc(
                        dataUpdateContext.editedLocatedIcon(),
                      )}
                      alt=""
                      className="h-[40px] w-[40px] "
                    />
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedIcon() === null}>
                    <div className="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                  </Match>
                </Switch>
                <span class="tooltip absolute left-[-10%] top-[120%] z-[10000] opacity-0 group-hover:opacity-100">
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
                className="bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc]"
                placeholder={translateText("name of game")}
                value={selectedDataContext.selectedGame().name}
              />
              <button
                type="button"
                onClick={locateEditedGame}
                onContextMenu={() => {
                  dataUpdateContext.setEditedlocatedGame(null);
                }}
                className="standardButton !mt-0 !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                <Switch>
                  <Match
                    when={dataUpdateContext.editedLocatedGame() === undefined}>
                    <Show
                      when={selectedDataContext.selectedGame().location}
                      fallback={translateText("locate game")}>
                      {selectedDataContext
                        .selectedGame()
                        .location.toString()
                        .split("\\")
                        .slice(-1)
                        .toString().length > 17
                        ? `...${selectedDataContext
                            .selectedGame()
                            .location.toString()
                            .split("\\")
                            .slice(-1)
                            .toString()
                            .slice(0, 7)}...${selectedDataContext
                            .selectedGame()
                            .location.toString()
                            .slice(-7)}`
                        : `...${selectedDataContext
                            .selectedGame()
                            .location.toString()
                            .split("\\")
                            .slice(-1)
                            .toString()}`}
                    </Show>
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedGame() === null}>
                    {translateText("locate game")}
                  </Match>
                  <Match when={dataUpdateContext.editedLocatedGame()}>
                    {dataUpdateContext
                      .editedLocatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                      ? `...${dataUpdateContext
                          .editedLocatedGame()
                          .toString()
                          .split("\\")
                          .slice(-1)
                          .toString()
                          .slice(0, 7)}...${dataUpdateContext
                          .editedLocatedGame()
                          .toString()
                          .slice(-7)}`
                      : `...${dataUpdateContext
                          .editedLocatedGame()
                          .toString()
                          .split("\\")
                          .slice(-1)
                          .toString()}`}
                  </Match>
                </Switch>
              </button>

              <Show
                when={
                  selectedDataContext.selectedGame().location &&
                  selectedDataContext.selectedGame().location.split("//")[0] !==
                    "steam:"
                }>
                <button
                  type="button"
                  onClick={() => {
                    invoke("open_location", {
                      location: selectedDataContext
                        .selectedGame()
                        .location.split("\\")
                        .slice(0, -1)
                        .join("\\"),
                    });
                  }}
                  className="standardButton group relative !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                  aria-label="logo">
                  <OpenExternal />

                  <span class="tooltip absolute left-[-150%] top-[120%] opacity-0 group-hover:opacity-100">
                    {translateText("open containing folder")}
                  </span>
                </button>
              </Show>
            </div>
          </div>
        </div>
        <div className="flex w-[84rem] justify-between max-large:w-[61rem]">
          <span className=" opacity-50">
            {translateText("right click to empty image selection")}
          </span>
        </div>
      </div>
    </dialog>
  );
}
