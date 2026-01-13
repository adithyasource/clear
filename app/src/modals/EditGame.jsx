// importing globals
import {
  ApplicationStateContext,
  GlobalContext,
  SelectedDataContext,
  UIContext,
  closeDialog,
  closeDialogImmediately,
  generateRandomString,
  getExecutableFileName,
  getExecutableParentFolder,
  locationJoin,
  translateText,
  triggerToast,
  updateData,
} from "../Globals.jsx";

import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
// importing code snippets and library functions
import { Match, Show, Switch, createSignal, onMount, useContext } from "solid-js";
import { produce } from "solid-js/store";

// importing style related files
import { Close, OpenExternal, SaveDisk, TrashDelete } from "../libraries/Icons.jsx";

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

  const [showCloseConfirm, setShowCloseConfirm] = createSignal(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

  async function locateEditedGame() {
    setEditedlocatedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk", "url", "app"],
          },
        ],
      }),
    );
  }

  async function locateEditedHeroImage() {
    setEditedLocatedHeroImage(
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
    setEditedLocatedGridImage(
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
    setEditedLocatedLogo(
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
    setEditedLocatedIcon(
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
        triggerToast(`${editedGameName()} ${translateText("is already in your library")}`);
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
        const gridImageFileName = `${generateRandomString()}.${
          editedLocatedGridImage().split(".")[editedLocatedGridImage().split(".").length - 1]
        }`;

        await copyFile(editedLocatedGridImage(), locationJoin(["grids", gridImageFileName]), {
          dir: BaseDirectory.AppData,
        }).then(() => {
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
        const heroImageFileName = `${generateRandomString()}.${
          editedLocatedHeroImage().split(".")[editedLocatedHeroImage().split(".").length - 1]
        }`;

        await copyFile(editedLocatedHeroImage(), locationJoin(["heroes", heroImageFileName]), {
          dir: BaseDirectory.AppData,
        }).then(() => {
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
        const logoFileName = `${generateRandomString()}.${
          editedLocatedLogo().split(".")[editedLocatedLogo().split(".").length - 1]
        }`;

        await copyFile(editedLocatedLogo(), locationJoin(["logos", logoFileName]), {
          dir: BaseDirectory.AppData,
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
        const iconFileName = `${generateRandomString()}.${
          editedLocatedIcon().split(".")[editedLocatedIcon().split(".").length - 1]
        }`;

        await copyFile(editedLocatedIcon(), locationJoin(["icons", iconFileName]), {
          dir: BaseDirectory.AppData,
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
      favourite: editedFavouriteGame(),
    });

    for (const folder of Object.values(globalContext.libraryData.folders)) {
      for (const gameName of folder.games) {
        if (gameName === selectedDataContext.selectedGame().name) {
          if (gameName === selectedDataContext.selectedGame().name) {
            globalContext.setLibraryData(
              produce((data) => {
                data.folders[folder.name].games.splice(folder.games.indexOf(gameName), 1);
                data.folders[folder.name].games.splice(previousIndex, 0, editedGameName());

                return data;
              }),
            );
          }
        }
      }
    }

    await updateData();
    closeDialog("editGame");
  }

  async function deleteGame() {
    await invoke("delete_assets", {
      heroImage: locationJoin([
        applicationStateContext.appDataDirPath(),
        "heroes",
        selectedDataContext.selectedGame().heroImage,
      ]),
      gridImage: locationJoin([
        applicationStateContext.appDataDirPath(),
        "grids",
        selectedDataContext.selectedGame().gridImage,
      ]),
      logo: locationJoin([applicationStateContext.appDataDirPath(), "logos", selectedDataContext.selectedGame().logo]),
      icon: locationJoin([applicationStateContext.appDataDirPath(), "icons", selectedDataContext.selectedGame().icon]),
    });

    setTimeout(async () => {
      globalContext.setLibraryData((data) => {
        delete data.games[selectedDataContext.selectedGame().name];
        return data;
      });

      for (const folder of Object.values(globalContext.libraryData.folders)) {
        for (const gameName of folder.games) {
          if (gameName === selectedDataContext.selectedGame().name) {
            globalContext.setLibraryData(
              produce((data) => {
                data.folders[folder.name].games.splice(folder.games.indexOf(gameName), 1);

                return data;
              }),
            );
          }
        }
      }

      await updateData();
      closeDialog("editGame");
    }, 100);
  }

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showCloseConfirm()) {
          closeDialogImmediately(document.querySelector("[data-modal='editGame']"));

          setShowCloseConfirm(false);
        } else {
          setShowCloseConfirm(true);

          const closeConfirmTimer = setTimeout(() => {
            clearTimeout(closeConfirmTimer);

            setShowCloseConfirm(false);
          }, 1500);
        }
      }
    });
  });

  return (
    <dialog
      data-modal="editGame"
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        uiContext.setShowEditGameModal(false);
      }}
      class="!p-0 h-screen w-screen overflow-visible backdrop:bg-transparent"
    >
      <div class="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-[#d1d1d1cc] dark:bg-[#121212cc]">
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">
              {translateText("edit")} {selectedDataContext.selectedGame().name}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="cursor-pointer"
              onClick={() => {
                if (editedFavouriteGame() === undefined) {
                  setEditedFavouriteGame(!selectedDataContext.selectedGame().favourite);
                } else {
                  setEditedFavouriteGame((x) => !x);
                }
              }}
            >
              <Switch>
                <Match when={editedFavouriteGame() === undefined}>
                  <Show
                    when={selectedDataContext.selectedGame().favourite}
                    fallback={<div class="!w-max">{translateText("favourite")}</div>}
                  >
                    <div class="relative">
                      <div class="!w-max">{translateText("favourite")}</div>
                      <div class="-z-10 !w-max absolute inset-0 opacity-70 blur-[5px]">
                        {translateText("favourite")}
                      </div>
                    </div>
                  </Show>
                </Match>

                <Match when={editedFavouriteGame() === true}>
                  <div class="relative">
                    <div class="!w-max">{translateText("favourite")}</div>
                    <div class="-z-10 !w-max absolute inset-0 opacity-70 blur-[5px]">{translateText("favourite")}</div>
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
              class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
            >
              <div class="!w-max">{translateText("save")}</div>
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
              class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
            >
              <span class="w-max text-[#FF3636]">
                {showDeleteConfirm() ? translateText("confirm?") : translateText("delete")}
              </span>
              <TrashDelete />
            </button>
            <button
              type="button"
              class="standardButton !w-max !h-full !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
              onClick={() => {
                if (showCloseConfirm()) {
                  closeDialog("editGame");
                } else {
                  setShowCloseConfirm(true);
                }
                setTimeout(() => {
                  setShowCloseConfirm(false);
                }, 1500);
              }}
              data-tooltip={translateText("close")}
            >
              {showCloseConfirm() ? (
                <span class="whitespace-nowrap text-[#FF3636]">{translateText("hit again to confirm")}</span>
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
            data-tooltip={translateText("grid/cover")}
          >
            <Switch>
              <Match when={editedLocatedGridImage() === undefined}>
                <img
                  class="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(
                    locationJoin([
                      applicationStateContext.appDataDirPath(),
                      "grids",
                      selectedDataContext.selectedGame().gridImage,
                    ]),
                  )}
                  alt=""
                />
                <span class="absolute top-[47%] left-[35%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[30%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={editedLocatedGridImage()}>
                <img class="absolute inset-0 aspect-[2/3]" src={convertFileSrc(editedLocatedGridImage())} alt="" />
                <span class="absolute top-[47%] left-[35%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[30%]">
                  {translateText("grid/cover")}
                </span>
              </Match>
              <Match when={editedLocatedGridImage() === null}>
                <span class="absolute top-[47%] left-[35%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[30%]">
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
              class="panelButton group relative m-0 aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 max-large:h-[250px] dark:bg-[#1c1c1c]"
              data-tooltip={translateText("hero")}
            >
              <Switch>
                <Match when={editedLocatedHeroImage() === null} class="absolute inset-0 overflow-hidden">
                  <span class=" absolute top-[47%] left-[45%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[42%]">
                    {translateText("hero")}
                  </span>
                </Match>
                <Match when={editedLocatedHeroImage() === undefined} class="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(
                      locationJoin([
                        applicationStateContext.appDataDirPath(),
                        "heroes",
                        selectedDataContext.selectedGame().heroImage,
                      ]),
                    )}
                    alt=""
                    class="absolute inset-0 aspect-[96/31] h-full"
                  />
                  <img
                    src={convertFileSrc(
                      locationJoin([
                        applicationStateContext.appDataDirPath(),
                        "heroes",
                        selectedDataContext.selectedGame().heroImage,
                      ]),
                    )}
                    alt=""
                    class="-z-10 absolute inset-0 aspect-[96/31] h-full opacity-[0.6] blur-[80px]"
                  />
                </Match>
                <Match when={editedLocatedHeroImage()} class="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(editedLocatedHeroImage())}
                    alt=""
                    class="absolute inset-0 aspect-[96/31] h-full"
                  />
                  <img
                    src={convertFileSrc(editedLocatedHeroImage())}
                    alt=""
                    class="-z-10 absolute inset-0 aspect-[96/31] h-full opacity-[0.6] blur-[80px]"
                  />
                </Match>
              </Switch>

              <span class="absolute top-[47%] left-[45%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[42%]">
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
                  class={`panelButton group !bg-[#27272700] absolute bottom-[60px] left-[20px] cursor-pointer bg-[#f1f1f1] max-large:bottom-[40px] dark:bg-[#1c1c1c] ${selectedDataContext.selectedGame().logo ? "" : "!h-[65px] !w-[200px]"} `}
                  data-tooltip={translateText("logo")}
                >
                  <Show
                    when={editedLocatedLogo()}
                    fallback={
                      <div class="dark:!bg-[#272727] relative h-[90px] w-[250px] bg-[#E8E8E8] max-large:h-[70px] max-large:w-[170px]" />
                    }
                  >
                    <img
                      src={convertFileSrc(editedLocatedLogo())}
                      alt=""
                      class="relative max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                    />
                  </Show>

                  <span class=" absolute top-[65%] left-[55%] opacity-0 group-hover:opacity-100 max-large:top-[45%] max-large:left-[35%]">
                    {translateText("logo")}
                  </span>
                </button>
              }
            >
              <button
                type="button"
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  setEditedLocatedLogo(null);
                }}
                class={`panelButton group !bg-[#27272700] absolute bottom-[70px] left-[20px] cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] ${selectedDataContext.selectedGame().logo ? "" : "!h-[65px] !w-[200px]"} `}
                data-tooltip={translateText("logo")}
              >
                <Switch>
                  <Match when={editedLocatedLogo() === undefined}>
                    <img
                      src={convertFileSrc(
                        locationJoin([
                          applicationStateContext.appDataDirPath(),
                          "logos",
                          selectedDataContext.selectedGame().logo,
                        ]),
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
                    <div class="dark:!bg-[#272727] relative h-[90px] w-[250px] bg-[#E8E8E8] max-large:h-[70px] max-large:w-[170px]" />
                  </Match>
                </Switch>

                <span class=" absolute top-[35%] left-[40%] opacity-0 group-hover:opacity-100 max-large:top-[30%] max-large:left-[35%]">
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
                class="group !bg-[#27272700] relative p-0"
                data-tooltip={translateText("logo")}
              >
                <Switch>
                  <Match when={editedLocatedIcon() === undefined}>
                    <Show
                      when={selectedDataContext.selectedGame().icon}
                      fallback={<div class="!bg-[#E8E8E8] dark:!bg-[#272727] h-[40px] w-[40px]" />}
                    >
                      <img
                        src={convertFileSrc(
                          locationJoin([
                            applicationStateContext.appDataDirPath(),
                            "icons",
                            selectedDataContext.selectedGame().icon,
                          ]),
                        )}
                        alt=""
                        class="h-[40px] w-[40px] "
                      />
                    </Show>
                  </Match>
                  <Match when={editedLocatedIcon()}>
                    <img src={convertFileSrc(editedLocatedIcon())} alt="" class="h-[40px] w-[40px]" />
                  </Match>
                  <Match when={editedLocatedIcon() === null}>
                    <div class="!bg-[#E8E8E8] dark:!bg-[#272727] h-[40px] w-[40px]" />
                  </Match>
                </Switch>
                <span class=" absolute top-[120%] left-[-10%] z-[10000] opacity-0 group-hover:opacity-100">
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
                class="standardButton !mt-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] bg-[#E8E8E8] dark:bg-[#232323]"
              >
                <Switch>
                  <Match when={editedLocatedGame() === undefined}>
                    <Show when={selectedDataContext.selectedGame().location} fallback={translateText("locate game")}>
                      {getExecutableFileName(selectedDataContext.selectedGame().location)}
                    </Show>
                  </Match>
                  <Match when={editedLocatedGame() === null}>{translateText("locate game")}</Match>
                  <Match when={editedLocatedGame()}>{getExecutableFileName(editedLocatedGame())}</Match>
                </Switch>
              </button>

              <Show
                when={
                  selectedDataContext.selectedGame().location &&
                  selectedDataContext.selectedGame().location.split("//")[0] !== "steam:"
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    invoke("open_location", {
                      location: getExecutableParentFolder(selectedDataContext.selectedGame().location),
                    });
                  }}
                  class="standardButton group !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] relative bg-[#E8E8E8] dark:bg-[#232323]"
                  data-tooltip={translateText("logo")}
                >
                  <OpenExternal />

                  <span class="absolute top-[120%] left-[-150%] opacity-0 group-hover:opacity-100">
                    {translateText("open containing folder")}
                  </span>
                </button>
              </Show>
            </div>
          </div>
        </div>
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <span class="opacity-50">{translateText("right click to empty image selection")}</span>
        </div>
      </div>
    </dialog>
  );
}
