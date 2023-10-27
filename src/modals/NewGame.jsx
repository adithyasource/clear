import {
  libraryData,
  setLibraryData,
  setModalBackground,
  gameName,
  setGameName,
  favouriteGame,
  setFavouriteGame,
  locatedHeroImage,
  setLocatedHeroImage,
  locatedGridImage,
  setLocatedGridImage,
  locatedLogo,
  setLocatedLogo,
  locatedGame,
  setlocatedGame,
} from "../Signals";

import { For, Show, createSignal, onMount } from "solid-js";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  writeTextFile,
  BaseDirectory,
  readTextFile,
  copyFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";

import { exit } from "@tauri-apps/api/process";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

import { appDataDir } from "@tauri-apps/api/path";

import { open } from "@tauri-apps/api/dialog";

export function NewGame() {
  async function addGame() {
    let heroImageFileName =
      "hero+ " +
      gameName() +
      "." +
      locatedHeroImage().split(".")[locatedHeroImage().split(".").length - 1];

    let gridImageFileName =
      "grid+ " +
      gameName() +
      "." +
      locatedGridImage().split(".")[locatedGridImage().split(".").length - 1];

    let logoFileName =
      "logo+ " +
      gameName() +
      "." +
      locatedLogo().split(".")[locatedLogo().split(".").length - 1];

    await copyFile(locatedHeroImage(), heroImageFileName, {
      dir: BaseDirectory.AppData,
    });

    await copyFile(locatedGridImage(), gridImageFileName, {
      dir: BaseDirectory.AppData,
    });

    await copyFile(locatedLogo(), logoFileName, {
      dir: BaseDirectory.AppData,
    });

    libraryData().games[gameName()] = {
      location: locatedGame(),
      name: gameName(),
      heroImage: heroImageFileName,
      gridImage: gridImageFileName,
      logo: logoFileName,
      favourite: favouriteGame(),
    };
    setLibraryData(libraryData());

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData(), null, 1),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      location.reload();
    });
  }

  async function locateGame() {
    setlocatedGame(
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
  async function locateHeroImage() {
    setLocatedHeroImage(
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
  async function locateGridImage() {
    setLocatedGridImage(
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
  async function locateLogo() {
    setLocatedLogo(
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

  function getGameMetaData() {
    // TODO Setup IGDB AWS Proxy
  }

  return (
    <dialog
      data-newGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        setModalBackground("#12121266");
      }}>
      <div className="flex flex-col gap-3 newGameDiv">
        <div className="flex justify-between w-[61rem]">
          <div>
            <h1>add new game</h1>
          </div>
          <div className="flex items-center gap-4">
            <div
              onClick={() => {
                setFavouriteGame(!favouriteGame());
                console.log(favouriteGame());
              }}>
              <Show when={favouriteGame()}>
                <div className="relative">
                  <div className="">favourite</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0">
                    favourite
                  </div>
                </div>
              </Show>

              <Show when={!favouriteGame()}>
                <div className="">favourite</div>
              </Show>
            </div>
            <button
              onClick={addGame}
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
              className="flex items-center functionalInteractables"
              onClick={() => {
                document.querySelector("[data-newGameModal]").close();
                location.reload();
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
              onClick={locateGridImage}
              className="locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
              aria-label="grid/cover">
              <Show when={locatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(locatedGridImage())}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show>
              <Show when={!locatedGridImage()}>
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
                  onClick={locateHeroImage}
                  className="h-[250px] aspect-[67/26] group relative p-0 m-0"
                  aria-label="hero">
                  <Show
                    when={locatedHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={convertFileSrc(locatedHeroImage())}
                      alt=""
                      className="absolute inset-0 h-[100%] rounded-[6px]"
                    />
                    <img
                      src={convertFileSrc(locatedHeroImage())}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px]"
                    />
                    <span class="absolute tooltip group-hover:opacity-100 left-[42%] top-[45%] opacity-0">
                      hero image
                    </span>
                  </Show>
                  <Show when={!locatedHeroImage()}>
                    <span class="absolute tooltip group-hover:opacity-100 left-[42%] top-[45%] opacity-0">
                      hero image
                    </span>
                  </Show>
                </button>
              </div>

              <Show when={locatedLogo()}>
                <button
                  onClick={locateLogo}
                  className="locatedHeroImg group  absolute bottom-[20px] left-[20px] "
                  aria-label="logo">
                  <img
                    src={convertFileSrc(locatedLogo())}
                    alt=""
                    className="h-[60px] "
                  />
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    logo
                  </span>
                </button>
              </Show>

              <Show when={!locatedLogo()}>
                <button
                  onClick={locateLogo}
                  className="locatingLogoImg group  absolute bottom-[20px] left-[20px] w-[170px] h-[70px]  functionalInteractables "
                  aria-label="logo">
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    logo
                  </span>
                </button>
              </Show>
            </div>

            <div className="flex gap-3 ">
              <div
                className="flex items-center functionalInteractables bgBlur"
                style="flex-grow: 1">
                <input
                  type="text"
                  name=""
                  style="flex-grow: 1; background-color: transparent;"
                  id=""
                  onInput={(e) => {
                    setGameName(e.currentTarget.value);
                  }}
                  className=""
                  placeholder="name of game"
                />
                <button
                  className="text-[10px] px-2 py-1 mr-3"
                  onClick={getGameMetaData}>
                  find assets
                </button>
              </div>

              <button onClick={locateGame} className="functionalInteractables ">
                locate game
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
