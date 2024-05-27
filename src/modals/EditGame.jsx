import {
  appDataDirPath,
  libraryData,
  setLibraryData,
  selectedGame,
  editedGameName,
  setEditedGameName,
  editedFavouriteGame,
  setEditedFavouriteGame,
  editedLocatedHeroImage,
  setEditedLocatedHeroImage,
  editedLocatedGridImage,
  setEditedLocatedGridImage,
  editedLocatedLogo,
  setEditedLocatedLogo,
  editedLocatedGame,
  setEditedlocatedGame,
  setSelectedGame,
  editedLocatedIcon,
  setEditedLocatedIcon,
  roundedBorders,
  setShowToast,
  setToastMessage,
  setShowDeleteConfirm,
  showDeleteConfirm,
  language,
} from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";

import { getData, generateRandomString, openGame, translateText } from "../App";

import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import {
  Close,
  OpenExternal,
  SaveDisk,
  TrashDelete,
} from "../components/Icons";

export function EditGame() {
  async function locateEditedGame() {
    setEditedlocatedGame(
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

    if (editedGameName() == "") {
      setShowToast(true);
      setToastMessage(translateText("no game name"));
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    if (selectedGame().name != editedGameName()) {
      let gameOccurances = 0;

      for (let x = 0; x < Object.keys(libraryData().games).length; x++) {
        if (editedGameName() == Object.keys(libraryData().games)[x]) {
          gameOccurances += 1;
        }
      }

      if (gameOccurances == 1) {
        setShowToast(true);
        setToastMessage(
          editedGameName() + " " + translateText("is already in your library"),
        );
        setTimeout(() => {
          setShowToast(false);
        }, 1500);
        return;
      }
    }

    for (let i = 0; i < Object.values(libraryData().folders).length; i++) {
      for (
        let j = 0;
        j < Object.values(libraryData().folders)[i].games.length;
        j++
      ) {
        if (
          Object.values(libraryData().folders)[i].games[j] ==
          selectedGame().name
        ) {
          previousIndex = j;
        }
      }
    }

    delete libraryData().games[selectedGame().name];

    setLibraryData(libraryData());

    if (!editedGameName()) {
      setEditedGameName(selectedGame().name);
    }

    if (editedFavouriteGame() == undefined) {
      setEditedFavouriteGame(selectedGame().favourite);
    }

    if (editedLocatedGame() === undefined) {
      setEditedlocatedGame(selectedGame().location);
    } else {
      if (editedLocatedGame() === null) {
        setEditedlocatedGame(undefined);
      }
    }

    if (editedLocatedGridImage() === undefined) {
      setEditedLocatedGridImage(selectedGame().gridImage);
    } else {
      if (editedLocatedGridImage() === null) {
        setEditedLocatedGridImage(undefined);
      } else {
        let gridImageFileName =
          generateRandomString() +
          "." +
          editedLocatedGridImage().split(".")[
            editedLocatedGridImage().split(".").length - 1
          ];
        await copyFile(
          editedLocatedGridImage(),
          "grids\\" + gridImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          setEditedLocatedGridImage(gridImageFileName);
        });
      }
    }

    if (editedLocatedHeroImage() === undefined) {
      setEditedLocatedHeroImage(selectedGame().heroImage);
    } else {
      if (editedLocatedHeroImage() === null) {
        setEditedLocatedHeroImage(undefined);
      } else {
        let heroImageFileName =
          generateRandomString() +
          "." +
          editedLocatedHeroImage().split(".")[
            editedLocatedHeroImage().split(".").length - 1
          ];
        await copyFile(
          editedLocatedHeroImage(),
          "heroes\\" + heroImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        ).then(() => {
          setEditedLocatedHeroImage(heroImageFileName);
        });
      }
    }

    if (editedLocatedLogo() === undefined) {
      setEditedLocatedLogo(selectedGame().logo);
    } else {
      if (editedLocatedLogo() === null) {
        setEditedLocatedLogo(undefined);
      } else {
        let logoFileName =
          generateRandomString() +
          "." +
          editedLocatedLogo().split(".")[
            editedLocatedLogo().split(".").length - 1
          ];

        await copyFile(editedLocatedLogo(), "logos\\" + logoFileName, {
          dir: BaseDirectory.AppData,
        }).then(() => {
          setEditedLocatedLogo(logoFileName);
        });
      }
    }

    if (editedLocatedIcon() === undefined) {
      setEditedLocatedIcon(selectedGame().icon);
    } else {
      if (editedLocatedIcon() === null) {
        setEditedLocatedIcon(undefined);
      } else {
        let iconFileName =
          generateRandomString() +
          "." +
          editedLocatedIcon().split(".")[
            editedLocatedIcon().split(".").length - 1
          ];

        await copyFile(editedLocatedIcon(), "icons\\" + iconFileName, {
          dir: BaseDirectory.AppData,
        }).then(() => {
          setEditedLocatedIcon(iconFileName);
        });
      }
    }

    libraryData().games[editedGameName()] = {
      location: editedLocatedGame(),
      name: editedGameName(),
      heroImage: editedLocatedHeroImage(),
      gridImage: editedLocatedGridImage(),
      logo: editedLocatedLogo(),
      icon: editedLocatedIcon(),
      favourite: editedFavouriteGame(),
    };

    for (let i = 0; i < Object.values(libraryData().folders).length; i++) {
      for (
        let j = 0;
        j < Object.values(libraryData().folders)[i].games.length;
        j++
      ) {
        if (
          Object.values(libraryData().folders)[i].games[j] ==
          selectedGame().name
        ) {
          Object.values(libraryData().folders)[i].games.splice(j, 1);

          Object.values(libraryData().folders)[i].games.splice(
            previousIndex,
            0,
            editedGameName(),
          );
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
    ).then(() => {
      setSelectedGame({});
      getData();
      document.querySelector("[data-editGameModal]").close();
    });
  }

  async function deleteGame() {
    delete libraryData().games[selectedGame().name];

    for (let i = 0; i < Object.values(libraryData().folders).length; i++) {
      for (
        let j = 0;
        j < Object.values(libraryData().folders)[i].games.length;
        j++
      ) {
        if (
          Object.values(libraryData().folders)[i].games[j] ==
          selectedGame().name
        ) {
          Object.values(libraryData().folders)[i].games.splice(j, 1);
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
    ).then(() => {
      getData();
    });
  }

  return (
    <dialog
      data-editGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        setEditedFavouriteGame();
        setEditedGameName(undefined);
        setEditedLocatedGridImage(undefined);
        setEditedLocatedHeroImage(undefined);
        setEditedLocatedLogo(undefined);
        setEditedLocatedIcon(undefined);
        setShowDeleteConfirm(false);
        setEditedlocatedGame(undefined);
        getData();
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#d1d1d1cc]">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-3">
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <div>
            <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
              {translateText("edit")} {selectedGame().name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                if (editedFavouriteGame() == undefined) {
                  setEditedFavouriteGame(!selectedGame().favourite);
                } else {
                  setEditedFavouriteGame(!editedFavouriteGame());
                }
              }}>
              <Show when={editedFavouriteGame() == undefined}>
                <Show when={selectedGame().favourite}>
                  <div className="relative">
                    <div className="!w-max"> {translateText("favourite")}</div>
                    <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                      {translateText("favourite")}
                    </div>
                  </div>
                </Show>
                <Show when={!selectedGame().favourite}>
                  <div className="!w-max"> {translateText("favourite")}</div>
                </Show>
              </Show>

              <Show when={editedFavouriteGame() == true}>
                <div className="relative">
                  <div className="!w-max"> {translateText("favourite")}</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                    {translateText("favourite")}
                  </div>
                </div>
              </Show>

              <Show when={editedFavouriteGame() == false}>
                <div className="!w-max">favourite</div>
              </Show>
            </div>
            <button
              onClick={updateGame}
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] ">
              <div className="!w-max"> {translateText("save")}</div>
              <SaveDisk />
            </button>
            <button
              onClick={() => {
                showDeleteConfirm() ? deleteGame() : setShowDeleteConfirm(true);

                setTimeout(() => {
                  setShowDeleteConfirm(false);
                }, 1500);
              }}
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] ">
              <span className="text-[#FF3636] w-max">
                {showDeleteConfirm()
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
          <div
            onClick={locateEditedGridImage}
            onContextMenu={() => {
              setEditedLocatedGridImage(null);
            }}
            className="panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] locatingGridImg h-full aspect-[2/3] group relative overflow-hidden"
            aria-label="grid/cover">
            <Show when={editedLocatedGridImage() === undefined}>
              <img
                className="absolute inset-0 aspect-[2/3]"
                src={convertFileSrc(
                  appDataDirPath() + "grids\\" + selectedGame().gridImage,
                )}
                alt=""
              />
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
            <Show when={editedLocatedGridImage()}>
              <img
                className="absolute inset-0 aspect-[2/3]"
                src={convertFileSrc(editedLocatedGridImage())}
                alt=""
              />
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
            <Show when={editedLocatedGridImage() === null}>
              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
          </div>

          <div className="flex flex-col gap-3 relative">
            <div
              onClick={locateEditedHeroImage}
              onContextMenu={() => {
                setEditedLocatedHeroImage(null);
              }}
              className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
              aria-label="hero">
              <Show
                when={editedLocatedHeroImage() === null}
                className="absolute inset-0 overflow-hidden">
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                  {translateText("hero")}
                </span>
              </Show>
              <Show
                when={editedLocatedHeroImage() === undefined}
                className="absolute inset-0 overflow-hidden">
                <img
                  src={convertFileSrc(
                    appDataDirPath() + "heroes\\" + selectedGame().heroImage,
                  )}
                  alt=""
                  className="absolute inset-0  aspect-[96/31]  h-full  rounded-[6px]"
                />
                <img
                  src={convertFileSrc(
                    appDataDirPath() + "heroes\\" + selectedGame().heroImage,
                  )}
                  alt=""
                  className="absolute inset-0 aspect-[96/31]  -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.6]"
                />
              </Show>
              <Show
                when={editedLocatedHeroImage()}
                className="absolute inset-0 overflow-hidden">
                <img
                  src={convertFileSrc(editedLocatedHeroImage())}
                  alt=""
                  className="absolute inset-0  aspect-[96/31] h-full rounded-[6px]"
                />
                <img
                  src={convertFileSrc(editedLocatedHeroImage())}
                  alt=""
                  className="absolute inset-0 -z-10 aspect-[96/31]  h-full rounded-[6px] blur-[80px] opacity-[0.6]"
                />
              </Show>

              <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                {translateText("hero")}
              </span>
            </div>

            <Show when={selectedGame().logo}>
              <div
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  setEditedLocatedLogo(null);
                }}
                className={`panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] !bg-[#27272700] group  absolute bottom-[70px] left-[20px] ${
                  selectedGame().logo ? "" : "!w-[200px] !h-[65px]"
                } `}
                aria-label="logo">
                <Show when={editedLocatedLogo() === undefined}>
                  <img
                    src={convertFileSrc(
                      appDataDirPath() + "logos\\" + selectedGame().logo,
                    )}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(editedLocatedLogo())}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={editedLocatedLogo() === null}>
                  <div
                    className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] relative bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }]`}
                  />
                </Show>

                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                  {translateText("logo")}
                </span>
              </div>
            </Show>
            <Show when={!selectedGame().logo}>
              <div
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  setEditedLocatedLogo(null);
                }}
                className={`panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] !bg-[#27272700] group  absolute bottom-[60px] left-[20px] max-large:bottom-[40px] ${
                  selectedGame().logo ? "" : "!w-[200px] !h-[65px]"
                } `}
                aria-label="logo">
                <Show when={editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(editedLocatedLogo())}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <Show when={!editedLocatedLogo()}>
                  <div
                    className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] relative bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }]`}
                  />
                </Show>

                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[45%] left-[55%] top-[65%] opacity-0">
                  {translateText("logo")}
                </span>
              </div>
            </Show>

            <div className="flex gap-3 items-center cursor-pointer">
              <div
                onClick={locateEditedIcon}
                onContextMenu={() => {
                  setEditedLocatedIcon(null);
                }}
                className="relative !bg-[#27272700] group "
                aria-label="logo">
                <Show when={editedLocatedIcon() === undefined}>
                  <Show when={selectedGame().icon}>
                    <img
                      src={convertFileSrc(
                        appDataDirPath() + "icons\\" + selectedGame().icon,
                      )}
                      alt=""
                      className="w-[40px] h-[40px] "
                    />
                  </Show>
                  <Show when={!selectedGame().icon}>
                    <div
                      className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                        roundedBorders() ? "6px" : "0px"
                      }]`}
                    />
                  </Show>
                </Show>
                <Show when={editedLocatedIcon()}>
                  <img
                    src={convertFileSrc(editedLocatedIcon())}
                    alt=""
                    className="w-[40px] h-[40px] "
                  />
                </Show>
                <Show when={editedLocatedIcon() === null}>
                  <div
                    className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }]`}
                  />
                </Show>
                <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0">
                  {translateText("icon")}
                </span>
              </div>

              <input
                aria-autocomplete="none"
                type="text"
                style="flex-grow: 1"
                name=""
                id=""
                onInput={(e) => {
                  setEditedGameName(e.currentTarget.value);
                }}
                className="dark:bg-[#272727cc] bg-[#E8E8E8cc] backdrop-blur-[10px]"
                placeholder={translateText("name of game")}
                value={selectedGame().name}
              />
              <button
                onClick={locateEditedGame}
                onContextMenu={() => {
                  setEditedlocatedGame(null);
                }}
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0">
                <Show when={editedLocatedGame() === undefined}>
                  <Show when={selectedGame().location}>
                    {selectedGame()
                      ["location"].toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                      ? "..." +
                        selectedGame()
                          ["location"].toString()
                          .split("\\")
                          .slice(-1)
                          .toString()
                          .slice(0, 7) +
                        "..." +
                        selectedGame()["location"].toString().slice(-7)
                      : "..." +
                        selectedGame()
                          ["location"].toString()
                          .split("\\")
                          .slice(-1)
                          .toString()}
                  </Show>
                  <Show when={!selectedGame().location}>
                    {" "}
                    {translateText("locate game")}
                  </Show>
                </Show>
                <Show when={editedLocatedGame() === null}>
                  {translateText("locate game")}
                </Show>
                <Show when={editedLocatedGame()}>
                  {editedLocatedGame()
                    .toString()
                    .split("\\")
                    .slice(-1)
                    .toString().length > 17
                    ? "..." +
                      editedLocatedGame()
                        .toString()
                        .split("\\")
                        .slice(-1)
                        .toString()
                        .slice(0, 7) +
                      "..." +
                      editedLocatedGame().toString().slice(-7)
                    : "..." +
                      editedLocatedGame()
                        .toString()
                        .split("\\")
                        .slice(-1)
                        .toString()}
                </Show>
              </button>

              <Show when={selectedGame().location}>
                <Show when={selectedGame().location.split("//")[0] != "steam:"}>
                  <button
                    onClick={() => {
                      invoke("open_location", {
                        location: selectedGame()
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
