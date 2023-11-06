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
} from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";

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
            extensions: ["png", "jpg", "jpeg"],
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
            extensions: ["png", "jpg", "jpeg"],
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
            extensions: ["png", "jpg", "jpeg"],
          },
        ],
      }),
    );
  }

  async function updateGame() {
    console.log(editedGameName());

    delete libraryData().games[selectedGame().name.replaceAll(" ", "_")];

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
      let gridImageFileName =
        "grid+ " +
        editedGameName() +
        "." +
        editedLocatedGridImage().split(".")[
          editedLocatedGridImage().split(".").length - 1
        ];
      await copyFile(editedLocatedGridImage(), gridImageFileName, {
        dir: BaseDirectory.AppData,
      }).then(() => {
        setEditedLocatedGridImage(gridImageFileName);
      });
    }

    if (!editedLocatedHeroImage()) {
      setEditedLocatedHeroImage(selectedGame().heroImage);
    } else {
      let heroImageFileName =
        "hero+ " +
        editedGameName() +
        "." +
        editedLocatedHeroImage().split(".")[
          editedLocatedHeroImage().split(".").length - 1
        ];
      await copyFile(editedLocatedHeroImage(), heroImageFileName, {
        dir: BaseDirectory.AppData,
      }).then(() => {
        setEditedLocatedHeroImage(heroImageFileName);
      });
    }

    if (!editedLocatedLogo()) {
      setEditedLocatedLogo(selectedGame().logo);
    } else {
      let logoFileName =
        "logo+ " +
        editedGameName() +
        "." +
        editedLocatedLogo().split(".")[
          editedLocatedLogo().split(".").length - 1
        ];

      await copyFile(editedLocatedLogo(), logoFileName, {
        dir: BaseDirectory.AppData,
      }).then(() => {
        setEditedLocatedLogo(logoFileName);
      });
    }

    libraryData().games[editedGameName().replaceAll(" ", "_")] = {
      location: editedLocatedGame(),
      name: editedGameName(),
      heroImage: editedLocatedHeroImage(),
      gridImage: editedLocatedGridImage(),
      logo: editedLocatedLogo(),
      favourite: editedFavouriteGame(),
    };

    for (let i = 0; i < Object.values(libraryData().folders).length; i++) {
      console.log(Object.values(libraryData().folders)[i].games);

      for (
        let j = 0;
        j < Object.values(libraryData().folders)[i].games.length;
        j++
      ) {
        if (
          Object.values(libraryData().folders)[i].games[j] ==
          selectedGame().name.replaceAll(" ", "_")
        ) {
          Object.values(libraryData().folders)[i].games.splice(j, 1);

          Object.values(libraryData().folders)[i].games.push(
            editedGameName().replaceAll(" ", "_"),
          );
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
    ).then(() => {
      getData();
      document.querySelector("[data-editGameModal]").close();
    });
  }

  async function deleteGame() {
    delete libraryData().games[selectedGame().name.replaceAll(" ", "_")];

    for (let i = 0; i < Object.values(libraryData().folders).length; i++) {
      console.log(Object.values(libraryData().folders)[i].games);

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

  return (
    <dialog
      data-editGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#ffffffcc]">
      <div className="flex flex-col gap-3 newGameDiv">
        <div className="flex justify-between w-[61rem]">
          <div>
            <h1>edit {selectedGame().name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div
              onClick={() => {
                if (editedFavouriteGame() == undefined) {
                  setEditedFavouriteGame(!selectedGame().favourite);
                } else {
                  setEditedFavouriteGame(!editedFavouriteGame());
                }

                console.log(editedFavouriteGame());
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
              className="flex items-center gap-1 functionalInteractables">
              save
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 3V8H15V3"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 21V15H17V21"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <button
              onClick={deleteGame}
              className="flex items-center gap-1 functionalInteractables">
              <span className="text-[#FF3636]">delete</span>
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
              className="flex items-center functionalInteractables"
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
        <div className="flex gap-[13.5rem]">
          <div>
            <button
              onClick={locateEditedGridImage}
              className="locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
              aria-label="grid/cover">
              <Show when={!editedLocatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(
                    appDataDirPath() + selectedGame().gridImage,
                  )}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show>
              <Show when={editedLocatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(editedLocatedGridImage())}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative ">
              <div>
                <button
                  onClick={locateEditedHeroImage}
                  className="h-[250px] aspect-[67/26] group relative p-0 m-0"
                  aria-label="hero">
                  <Show
                    when={!editedLocatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(
                        appDataDirPath() + selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0 h-[254px] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(
                        appDataDirPath() + selectedGame().heroImage,
                      )}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.4]"
                    />
                  </Show>
                  <Show
                    when={editedLocatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(editedLocatedHeroImage())}
                      alt=""
                      className="absolute inset-0 h-[254px] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(editedLocatedHeroImage())}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.4]"
                    />
                  </Show>

                  <span class="absolute tooltip group-hover:opacity-100 left-[42%] top-[45%] opacity-0">
                    hero image
                  </span>
                </button>
              </div>

              <button
                onClick={locateEditedLogo}
                className="locatedHeroImg group  absolute bottom-[20px] left-[20px] "
                aria-label="logo">
                <Show when={!editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(appDataDirPath() + selectedGame().logo)}
                    alt=""
                    className="h-[60px] "
                  />
                </Show>
                <Show when={editedLocatedLogo()}>
                  <img
                    src={convertFileSrc(editedLocatedLogo())}
                    alt=""
                    className="h-[60px] "
                  />
                </Show>
                <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                  logo
                </span>
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                style="flex-grow: 1"
                name=""
                id=""
                onInput={(e) => {
                  setEditedGameName(e.currentTarget.value);
                }}
                className="functionalInteractables bgBlur"
                placeholder="name of game"
                value={selectedGame().name}
              />
              <button
                onClick={locateEditedGame}
                className="functionalInteractables">
                locate game
              </button>
            </div>
          </div>
        </div>
      </div>
      damn
    </dialog>
  );
}
