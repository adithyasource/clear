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
  locatedHeroImage,
  editedLocatedIcon,
  setEditedLocatedIcon,
  roundedBorders,
  setShowToast,
  setToastMessage,
  setShowDeleteConfirm,
  showDeleteConfirm,
} from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import YAML from "yamljs";

import { getData } from "../App";

import { open } from "@tauri-apps/api/dialog";
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

    if (editedGameName() != undefined || editedGameName() == "") {
      setShowToast(true);
      setToastMessage("no game name");
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    let gameOccurances = 0;

    for (let x = 0; x < Object.keys(libraryData().games).length; x++) {
      if (editedGameName() == Object.keys(libraryData().games)[x]) {
        gameOccurances += 1;
      }
    }

    if (gameOccurances == 1) {
      setShowToast(true);
      setToastMessage(`${editedGameName()} is already in your library`);
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
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
    if (!editedLocatedGame()) {
      setEditedlocatedGame(selectedGame().location);
    }
    if (editedFavouriteGame() == undefined) {
      setEditedFavouriteGame(selectedGame().favourite);
    }

    if (!editedLocatedGridImage()) {
      setEditedLocatedGridImage(selectedGame().gridImage);
    } else {
      if (editedLocatedGridImage() == true) {
        setEditedLocatedGridImage(undefined);
      } else {
        let gridImageFileName =
          editedGameName() +
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

    if (!editedLocatedHeroImage()) {
      setEditedLocatedHeroImage(selectedGame().heroImage);
    } else {
      let heroImageFileName =
        editedGameName() +
        "." +
        editedLocatedHeroImage().split(".")[
          editedLocatedHeroImage().split(".").length - 1
        ];
      await copyFile(editedLocatedHeroImage(), "heroes\\" + heroImageFileName, {
        dir: BaseDirectory.AppData,
      }).then(() => {
        setEditedLocatedHeroImage(heroImageFileName);
      });
    }

    if (!editedLocatedLogo()) {
      setEditedLocatedLogo(selectedGame().logo);
    } else {
      let logoFileName =
        editedGameName() +
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

    if (!editedLocatedIcon()) {
      setEditedLocatedIcon(selectedGame().icon);
    } else {
      let iconFileName =
        editedGameName() +
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

    console.log(previousIndex);

    await writeTextFile(
      {
        path: "data.yaml",
        contents: YAML.stringify(libraryData(), 4),
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
        path: "data.yaml",
        contents: YAML.stringify(libraryData(), 4),
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
        setEditedGameName("");
        setEditedLocatedGridImage("");
        setEditedLocatedHeroImage("");
        setEditedLocatedLogo("");
        setEditedLocatedIcon("");
        setShowDeleteConfirm(false);
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#d1d1d1cc]">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-3">
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <div>
            <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
              edit {selectedGame().name}
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
                    <div className="">favourite</div>
                    <div className="absolute blur-[5px] opacity-70 -z-10 inset-0">
                      favourite
                    </div>
                  </div>
                </Show>
                <Show when={!selectedGame().favourite}>
                  <div className="">favourite</div>
                </Show>
              </Show>

              <Show when={editedFavouriteGame() == true}>
                <div className="relative">
                  <div className="">favourite</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0">
                    favourite
                  </div>
                </div>
              </Show>

              <Show when={editedFavouriteGame() == false}>
                <div className="">favourite</div>
              </Show>
            </div>
            <button
              onClick={updateGame}
              className="flex items-center standardButton ">
              save
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                  className="dark:stroke-white stroke-black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 3V8H15V3"
                  className="dark:stroke-white stroke-black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 21V15H17V21"
                  className="dark:stroke-white stroke-black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <button
              onClick={() => {
                showDeleteConfirm() ? deleteGame() : setShowDeleteConfirm(true);

                setTimeout(() => {
                  setShowDeleteConfirm(false);
                }, 1500);
              }}
              className="flex items-center standardButton ">
              <span className="text-[#FF3636]">
                {showDeleteConfirm() ? "confim?" : "delete"}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
                  stroke="#FF3636"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M14 11V17"
                  stroke="#FF3636"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M10 11V17"
                  stroke="#FF3636"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <button
              className="flex items-center standardButton !gap-0 "
              onClick={() => {
                document.querySelector("[data-editGameModal]").close();
                getData();
              }}>
              ​
              <svg
                width="16"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 1L11 10.3369M1 10.3369L11 1"
                  stroke="#FF3636"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex max-large:gap-[13.5rem] gap-[18.5rem]">
          <div>
            <div
              onClick={locateEditedGridImage}
              onContextMenu={() => {
                setEditedLocatedGridImage(true);
              }}
              className="panelButton locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
              aria-label="grid/cover">
              <Show when={!editedLocatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(
                    appDataDirPath() + "grids\\" + selectedGame().gridImage,
                  )}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                  grid/cover
                </span>
              </Show>
              <Show when={editedLocatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(editedLocatedGridImage())}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                  grid/cover
                </span>
              </Show>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative ">
              <div>
                <div
                  onClick={locateEditedHeroImage}
                  onContextMenu={() => {
                    setEditedLocatedHeroImage(null);
                  }}
                  className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton"
                  aria-label="hero">
                  <Show
                    when={!editedLocatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(
                        appDataDirPath() +
                          "heroes\\" +
                          selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0  aspect-[67/26] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(
                        appDataDirPath() +
                          "heroes\\" +
                          selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.6]"
                    />
                  </Show>
                  <Show
                    when={editedLocatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(
                        appDataDirPath() +
                          "heroes\\" +
                          selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0  aspect-[67/26] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(
                        appDataDirPath() +
                          "heroes\\" +
                          selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.6]"
                    />
                  </Show>
                  <Show
                    when={editedLocatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(editedLocatedHeroImage())}
                      alt=""
                      className="absolute inset-0  aspect-[67/26] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(editedLocatedHeroImage())}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.6]"
                    />
                  </Show>

                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                    hero image
                  </span>
                </div>
              </div>

              <div
                onClick={locateEditedLogo}
                onContextMenu={() => {
                  setEditedLocatedLogo(true);
                }}
                className={`panelButton !bg-[#27272700] group  absolute bottom-[20px] left-[20px] ${
                  selectedGame().logo ? "" : "w-[200px] h-[65px]"
                } `}
                aria-label="logo">
                <Show when={!editedLocatedLogo()}>
                  <Show when={selectedGame().logo}>
                    <img
                      src={convertFileSrc(
                        appDataDirPath() + "logos\\" + selectedGame().logo,
                      )}
                      alt=""
                      className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                    />
                  </Show>
                  <Show when={!selectedGame().logo}>
                    <div
                      className={`max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] absolute bottom-[-5px] bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                        roundedBorders() ? "6px" : "0px"
                      }]`}
                    />
                  </Show>
                </Show>
                <Show when={editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(editedLocatedLogo())}
                    alt=""
                    className="relative max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                </Show>
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                  logo
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-center cursor-pointer">
              <div
                onClick={locateEditedIcon}
                onContextMenu={() => {
                  setEditedLocatedIcon(undefined);
                }}
                className="relative !bg-[#27272700] group "
                aria-label="logo">
                <Show when={!editedLocatedIcon()}>
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
                      className={`w-[40px] h-[40px] bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
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
                <span class="absolute tooltip group-hover:opacity-100 left-[-10%] top-[120%] opacity-0">
                  icon
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
                placeholder="name of game"
                value={selectedGame().name}
              />
              <button
                onClick={locateEditedGame}
                onContextMenu={() => {
                  setEditedlocatedGame(undefined);
                }}
                className="standardButton !w-max !mt-0">
                {editedLocatedGame() == undefined
                  ? selectedGame().location == undefined
                    ? "locate game"
                    : "..." + selectedGame()["location"].slice(-25)
                  : "..." + editedLocatedGame().slice(-25)}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-start max-large:w-[61rem] w-[84rem]">
          <span className="text-[12px] opacity-50">
            right click to empty image selection
          </span>
        </div>
      </div>
    </dialog>
  );
}
