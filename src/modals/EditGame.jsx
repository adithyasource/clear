import { Match, Show, Switch, useContext, createSignal } from "solid-js";
import { produce } from "solid-js/store";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import {
  generateRandomString,
  translateText,
  updateData,
  closeDialog,
  locationJoin
} from "../Globals";
import { Close, OpenExternal, SaveDisk, TrashDelete } from "../libraries/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  UIContext
} from "../Globals";
import { triggerToast } from "../Globals";

export function EditGame() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  const [editedGameName, setEditedGameName] = createSignal();
  const [editedFavouriteGame, setEditedFavouriteGame] = createSignal();
  const [editedLocatedHeroImage, setEditedLocatedHeroImage] = createSignal();
  const [editedLocatedGridImage, setEditedLocatedGridImage] = createSignal();
  const [editedLocatedLogo, setEditedLocatedLogo] = createSignal();
  const [editedLocatedIcon, setEditedLocatedIcon] = createSignal();
  const [editedLocatedGame, setEditedlocatedGame] = createSignal();

  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

  async function locateEditedGame() {
    setEditedlocatedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk"]
          }
        ]
      })
    );
  }

  async function locateEditedHeroImage() {
    setEditedLocatedHeroImage(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"]
          }
        ]
      })
    );
  }

  async function locateEditedGridImage() {
    setEditedLocatedGridImage(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"]
          }
        ]
      })
    );
  }

  async function locateEditedLogo() {
    setEditedLocatedLogo(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "webp"]
          }
        ]
      })
    );
  }

  async function locateEditedIcon() {
    setEditedLocatedIcon(
      await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", "ico"]
          }
        ]
      })
    );
  }

  async function updateGame() {
    let previousIndex;

    if (editedGameName() === "") {
      triggerToast(translateText("no game name"));
      return;
    }

    if (selectedDataContext.selectedGame().name !== editedGameName()) {
      let gameNameAlreadyExists = false;

      for (const gameName of Object.keys(globalContext.libraryData.games)) {
        if (editedGameName() === gameName) {
          gameNameAlreadyExists = true;
        }
      }

      if (gameNameAlreadyExists) {
        triggerToast(
          `${editedGameName()} ${translateText("is already in your library")}`
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

    if (!editedGameName()) {
      setEditedGameName(selectedDataContext.selectedGame().name);
    }

    if (editedFavouriteGame() === undefined) {
      setEditedFavouriteGame(selectedDataContext.selectedGame().favourite);
    }

    if (editedLocatedGame() === undefined) {
      setEditedlocatedGame(selectedDataContext.selectedGame().location);
    } else {
      if (editedLocatedGame() === null) {
        setEditedlocatedGame(undefined);
      }
    }

    if (editedLocatedGridImage() === undefined) {
      setEditedLocatedGridImage(selectedDataContext.selectedGame().gridImage);
    } else {
      if (editedLocatedGridImage() === null) {
        setEditedLocatedGridImage(undefined);
      } else {
        const gridImageFileName = `${generateRandomString()}.${editedLocatedGridImage().split(".")[
          editedLocatedGridImage().split(".").length - 1
        ]
          }`;

        await copyFile(
          editedLocatedGridImage(),
          locationJoin(["grids", gridImageFileName]),
          {
            dir: BaseDirectory.AppData
          }
        ).then(() => {
          setEditedLocatedGridImage(gridImageFileName);
        });
      }
    }

    if (editedLocatedHeroImage() === undefined) {
      setEditedLocatedHeroImage(selectedDataContext.selectedGame().heroImage);
    } else {
      if (editedLocatedHeroImage() === null) {
        setEditedLocatedHeroImage(undefined);
      } else {
        const heroImageFileName = `${generateRandomString()}.${editedLocatedHeroImage().split(".")[
          editedLocatedHeroImage().split(".").length - 1
        ]
          }`;

        await copyFile(
          editedLocatedHeroImage(),
          locationJoin(["heroes", heroImageFileName]),
          {
            dir: BaseDirectory.AppData
          }
        ).then(() => {
          setEditedLocatedHeroImage(heroImageFileName);
        });
      }
    }

    if (editedLocatedLogo() === undefined) {
      setEditedLocatedLogo(selectedDataContext.selectedGame().logo);
    } else {
      if (editedLocatedLogo() === null) {
        setEditedLocatedLogo(undefined);
      } else {
        const logoFileName = `${generateRandomString()}.${editedLocatedLogo().split(".")[
          editedLocatedLogo().split(".").length - 1
        ]
          }`;

        await copyFile(editedLocatedLogo(), locationJoin(["logos", logoFileName]), {
          dir: BaseDirectory.AppData
        }).then(() => {
          setEditedLocatedLogo(logoFileName);
        });
      }
    }

    if (editedLocatedIcon() === undefined) {
      setEditedLocatedIcon(selectedDataContext.selectedGame().icon);
    } else {
      if (editedLocatedIcon() === null) {
        setEditedLocatedIcon(undefined);
      } else {
        const iconFileName = `${generateRandomString()}.${editedLocatedIcon().split(".")[
          editedLocatedIcon().split(".").length - 1
        ]
          }`;

        await copyFile(editedLocatedIcon(), locationJoin(["icons", iconFileName]), {
          dir: BaseDirectory.AppData
        }).then(() => {
          setEditedLocatedIcon(iconFileName);
        });
      }
    }

    globalContext.setLibraryData("games", editedGameName(), {
      location: editedLocatedGame(),
      name: editedGameName(),
      heroImage: editedLocatedHeroImage(),
      gridImage: editedLocatedGridImage(),
      logo: editedLocatedLogo(),
      icon: editedLocatedIcon(),
      favourite: editedFavouriteGame()
    });

    for (const folder of Object.values(globalContext.libraryData.folders)) {
      for (const gameName of folder.games) {
        if (gameName === selectedDataContext.selectedGame().name) {
          if (gameName === selectedDataContext.selectedGame().name) {
            globalContext.setLibraryData(
              produce((data) => {
                data.folders[folder.name].games.splice(
                  folder.games.indexOf(gameName),
                  1
                );
                data.folders[folder.name].games.splice(
                  previousIndex,
                  0,
                  editedGameName()
                );

                return data;
              })
            );
          }
        }
      }
    }

    await updateData();
    closeDialog("editGame");
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
                1
              );

              return data;
            })
          );
        }
      }
    }

    await updateData();
    closeDialog("editGame");
  }

  return (
    <dialog
      data-modal="editGame"
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        uiContext.setShowEditGameModal(false);
      }}
      class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible">
      <div class="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-[#d1d1d1cc] dark:bg-[#121212cc]">
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
              {translateText("edit")} {selectedDataContext.selectedGame().name}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="cursor-pointer"
              onClick={() => {
                if (editedFavouriteGame() === undefined) {
                  setEditedFavouriteGame(
                    !selectedDataContext.selectedGame().favourite
                  );
                } else {
                  setEditedFavouriteGame((x) => !x);
                }
              }}>
              <Switch>
                <Match when={editedFavouriteGame() === undefined}>
                  <Show
                    when={selectedDataContext.selectedGame().favourite}
                    fallback={
                      <div class="!w-max">{translateText("favourite")}</div>
                    }>
                    <div class="relative">
                      <div class="!w-max">{translateText("favourite")}</div>
                      <div class="absolute inset-0 -z-10 !w-max opacity-70 blur-[5px]">
                        {translateText("favourite")}
                      </div>
                    </div>
                  </Show>
                </Match>

                <Match when={editedFavouriteGame() === true}>
                  <div class="relative">
                    <div class="!w-max"> {translateText("favourite")}</div>
                    <div class="absolute inset-0 -z-10 !w-max opacity-70 blur-[5px]">
                      {translateText("favourite")}
                    </div>
                  </div>
                </Match>

                <Match when={editedFavouriteGame() === false}>
                  <div class="!w-max">favourite</div>
                </Match>
              </Switch>
            </button>
            <button
              type="button"
              onClick={updateGame}
              class="standardButton flex items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <div class="!w-max"> {translateText("save")}</div>
              <SaveDisk />
            </button>
            <button
              type="button"
              onClick={() => {
                showDeleteConfirm() ? deleteGame() : setShowDeleteConfirm(true);

                setTimeout(() => {
                  setShowDeleteConfirm(false);
                }, 1500);
              }}
              class="standardButton flex items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <span class="w-max text-[#FF3636]">
                {showDeleteConfirm()
                  ? translateText("confirm?")
                  : translateText("delete")}
              </span>
              <TrashDelete />
            </button>
            <button
              type="button"
              class="standardButton flex items-center !w-max !h-full !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
              onClick={() => {
                if (uiContext.showCloseConfirm()) {
                  closeDialog("editGame");
                } else {
                  uiContext.setShowCloseConfirm(true);
                }
                setTimeout(() => {
                  uiContext.setShowCloseConfirm(false);
                }, 1500);
              }}
              data-tooltip={translateText("close")}>
              {uiContext.showCloseConfirm() ? (
                <span class="text-[#FF3636] whitespace-nowrap">
                  {translateText("hit again to confirm")}
                </span>
              ) : (
                <Close />
              )}
            </button>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            onClick={locateEditedGridImage}
            onContextMenu={() => {
              setEditedLocatedGridImage(null);
            }}
            class="panelButton locatingGridImg group relative aspect-[2/3] h-full cursor-pointer overflow-hidden bg-[#f1f1f1] dark:bg-[#1c1c1c]"
            data-tooltip={translateText("grid/cover")}>
            <Switch>
              <Match when={editedLocatedGridImage() === undefined}>
                <img
                  class="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(
                    locationJoin([applicationStateContext.appDataDirPath(), "grids", selectedDataContext.selectedGame().gridImage])
                  )}
                  alt=""
                />
                <span class=" absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={editedLocatedGridImage()}>
                <img
                  class="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(editedLocatedGridImage())}
                  alt=""
                />
                <span class=" absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={editedLocatedGridImage() === null}>
                <span class=" absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
            </Switch>
          </button>

          <div class="relative flex flex-col gap-3">
            <button
              type="button"
              onClick={locateEditedHeroImage}
              onContextMenu={() => {
                setEditedLocatedHeroImage(null);
              }}
              class="panelButton group relative m-0 aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 dark:bg-[#1c1c1c] max-large:h-[250px]"
              data-tooltip={translateText("hero")}>
              <Switch>
                <Match
                  when={editedLocatedHeroImage() === null}
                  class="absolute inset-0 overflow-hidden">
                  <span class=" absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%]">
                    {translateText("hero")}
                  </span>
                </Match>
                <Match
                  when={editedLocatedHeroImage() === undefined}
                  class="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(
                      locationJoin([applicationStateContext.appDataDirPath(), "heroes", selectedDataContext.selectedGame().heroImage])
                    )}
                    alt=""
                    class="absolute inset-0  aspect-[96/31]  h-full  "
                  />
                  <img
                    src={convertFileSrc(
                      locationJoin([applicationStateContext.appDataDirPath(), "heroes", selectedDataContext.selectedGame().heroImage])
                    )}
                    alt=""
                    class="absolute inset-0 -z-10  aspect-[96/31] h-full  opacity-[0.6] blur-[80px]"
                  />
                </Match>
                <Match
                  when={editedLocatedHeroImage()}
                  class="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(editedLocatedHeroImage())}
                    alt=""
                    class="absolute inset-0  aspect-[96/31] h-full "
                  />
                  <img
                    src={convertFileSrc(editedLocatedHeroImage())}
                    alt=""
                    class="absolute inset-0 -z-10 aspect-[96/31]  h-full  opacity-[0.6] blur-[80px]"
                  />
                </Match>
              </Switch>

              <span class=" absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%]">
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
                    setEditedLocatedLogo(null);
                  }}
                  class={`panelButton group absolute bottom-[60px] left-[20px] cursor-pointer  !bg-[#27272700] bg-[#f1f1f1] dark:bg-[#1c1c1c] max-large:bottom-[40px] ${selectedDataContext.selectedGame().logo
                    ? ""
                    : "!h-[65px] !w-[200px]"
                    } `}
                  data-tooltip={translateText("logo")}>
                  <Show
                    when={editedLocatedLogo()}
                    fallback={
                      <div class="relative h-[90px] w-[250px] bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[70px] max-large:w-[170px]" />
                    }>
                    <img
                      src={convertFileSrc(editedLocatedLogo())}
                      alt=""
                      class="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Show>

                  <span class=" absolute left-[55%] top-[65%] opacity-0 group-hover:opacity-100 max-large:left-[35%] max-large:top-[45%]">
                    {translateText("logo")}
                  </span>
                </button>
              }>
              <button
                type="button"
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  setEditedLocatedLogo(null);
                }}
                class={`panelButton group absolute bottom-[70px] left-[20px] cursor-pointer  !bg-[#27272700] bg-[#f1f1f1] dark:bg-[#1c1c1c] ${selectedDataContext.selectedGame().logo
                  ? ""
                  : "!h-[65px] !w-[200px]"
                  } `}
                data-tooltip={translateText("logo")}>
                <Switch>
                  <Match when={editedLocatedLogo() === undefined}>
                    <img
                      src={convertFileSrc(
                        locationJoin([applicationStateContext.appDataDirPath(), "logos", selectedDataContext.selectedGame().logo])
                      )}
                      alt=""
                      class="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Match>
                  <Match when={editedLocatedLogo()}>
                    <img
                      src={convertFileSrc(editedLocatedLogo())}
                      alt=""
                      class="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Match>
                  <Match when={editedLocatedLogo() === null}>
                    <div class="relative h-[90px] w-[250px] bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[70px] max-large:w-[170px]" />
                  </Match>
                </Switch>

                <span class=" absolute left-[40%] top-[35%] opacity-0 group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%]">
                  {translateText("logo")}
                </span>
              </button>
            </Show>

            <div class="flex cursor-pointer items-center gap-3">
              <button
                type="button"
                onClick={locateEditedIcon}
                onContextMenu={() => {
                  setEditedLocatedIcon(null);
                }}
                class="group relative !bg-[#27272700] p-0"
                data-tooltip={translateText("logo")}>
                <Switch>
                  <Match when={editedLocatedIcon() === undefined}>
                    <Show
                      when={selectedDataContext.selectedGame().icon}
                      fallback={
                        <div class="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                      }>
                      <img
                        src={convertFileSrc(
                          locationJoin([applicationStateContext.appDataDirPath(), "icons", selectedDataContext.selectedGame().icon])
                        )}
                        alt=""
                        class="h-[40px] w-[40px] "
                      />
                    </Show>
                  </Match>
                  <Match when={editedLocatedIcon()}>
                    <img
                      src={convertFileSrc(editedLocatedIcon())}
                      alt=""
                      class="h-[40px] w-[40px] "
                    />
                  </Match>
                  <Match when={editedLocatedIcon() === null}>
                    <div class="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                  </Match>
                </Switch>
                <span class=" absolute left-[-10%] top-[120%] z-[10000] opacity-0 group-hover:opacity-100">
                  {translateText("icon")}
                </span>
              </button>

              <input
                aria-autocomplete="none"
                type="text"
                style={{ "flex-grow": "1" }}
                name=""
                id=""
                onInput={(e) => {
                  setEditedGameName(e.currentTarget.value);
                }}
                class="bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc]"
                placeholder={translateText("name of game")}
                value={selectedDataContext.selectedGame().name}
              />
              <button
                type="button"
                onClick={locateEditedGame}
                onContextMenu={() => {
                  setEditedlocatedGame(null);
                }}
                class="standardButton !mt-0 !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                <Switch>
                  <Match when={editedLocatedGame() === undefined}>
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
                  <Match when={editedLocatedGame() === null}>
                    {translateText("locate game")}
                  </Match>
                  <Match when={editedLocatedGame()}>
                    {editedLocatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                      ? `...${editedLocatedGame()
                        .toString()
                        .split("\\")
                        .slice(-1)
                        .toString()
                        .slice(0, 7)}...${editedLocatedGame()
                          .toString()
                          .slice(-7)}`
                      : `...${editedLocatedGame()
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
                        .join("\\")
                    });
                  }}
                  class="standardButton group relative !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                  data-tooltip={translateText("logo")}>
                  <OpenExternal />

                  <span class=" absolute left-[-150%] top-[120%] opacity-0 group-hover:opacity-100">
                    {translateText("open containing folder")}
                  </span>
                </button>
              </Show>
            </div>
          </div>
        </div>
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <span class=" opacity-50">
            {translateText("right click to empty image selection")}
          </span>
        </div>
      </div>
    </dialog>
  );
}
