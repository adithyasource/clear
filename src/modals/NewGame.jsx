import {
  libraryData,
  setLibraryData,
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
  foundGridImage,
  foundHeroImage,
  foundLogoImage,
  setFoundGridImage,
  setFoundHeroImage,
  setFoundLogoImage,
  roundedBorders,
} from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";

import { getData } from "../App";

import { open } from "@tauri-apps/api/dialog";

import { open as shellOpen } from "@tauri-apps/api/shell";

import { fetch, getClient, ResponseType } from "@tauri-apps/api/http";

import Fuse from "fuse.js";

export function NewGame() {
  async function addGame() {
    console.log(locatedHeroImage());

    let heroImageFileName =
      gameName() +
      "." +
      locatedHeroImage().split(".")[locatedHeroImage().split(".").length - 1];

    let gridImageFileName =
      gameName() +
      "." +
      locatedGridImage().split(".")[locatedGridImage().split(".").length - 1];

    let logoFileName =
      gameName() +
      "." +
      locatedLogo().split(".")[locatedLogo().split(".").length - 1];

    await copyFile(locatedHeroImage(), "heroes\\" + heroImageFileName, {
      dir: BaseDirectory.AppData,
    });

    await copyFile(locatedGridImage(), "grids\\" + gridImageFileName, {
      dir: BaseDirectory.AppData,
    });

    await copyFile(locatedLogo(), "logos\\" + logoFileName, {
      dir: BaseDirectory.AppData,
    });

    libraryData().games[gameName().replaceAll(" ", "_")] = {
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

  async function getGameAssets() {
    let steamAppId;
    let gridsUrls = [];
    let heroesUrls = [];
    let logosUrls = [];
    let allGames = [];

    const response = await fetch(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
      {
        method: "GET",
        timeout: 30,
        contentType: "application/json",
      },
    );

    for (let x = 0; x < response.data.applist["apps"].length; x++) {
      allGames.push(response.data.applist["apps"][x].name);
    }

    let fuse = new Fuse(allGames, {
      threshold: 0.3,
    });

    async function iterateGames(iteration) {
      let closestMatchingName = fuse.search(gameName())[iteration].item;

      for (let x = 0; x < response.data.applist["apps"].length; x++) {
        if (response.data.applist["apps"][x].name == closestMatchingName) {
          steamAppId = response.data.applist["apps"][x].appid;
          console.log(closestMatchingName);
        }
      }

      const client = await getClient();

      const grids = await client.get(
        `https://www.steamgriddb.com/api/v2/grids/steam/${steamAppId}`,
        {
          timeout: 30,
          responseType: ResponseType.JSON,
          headers: {
            Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
          },
        },
      );

      const heroes = await client.get(
        `https://www.steamgriddb.com/api/v2/heroes/steam/${steamAppId}`,
        {
          timeout: 30,
          responseType: ResponseType.JSON,
          headers: {
            Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
          },
        },
      );

      const logos = await client.get(
        `https://www.steamgriddb.com/api/v2/logos/steam/${steamAppId}`,
        {
          timeout: 30,
          responseType: ResponseType.JSON,
          headers: {
            Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
          },
        },
      );

      setFoundGridImage(grids.data["data"][0].thumb);

      setFoundHeroImage(heroes.data["data"][0].thumb);

      setFoundLogoImage(logos.data["data"][0].thumb);
    }

    try {
      iterateGames(0);
      console.log("failed");
    } catch (error) {
      iterateGames(1);
    }
  }

  return (
    <dialog
      data-newGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#ffffffcc]">
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
              onClick={locateGridImage}
              className="locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
              aria-label="grid/cover">
              <Show when={foundGridImage()}>
                <img
                  className="absolute inset-0"
                  src={foundGridImage()}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show>
              <Show when={!foundGridImage()}>
                {" "}
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
                    when={foundHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <img
                      src={foundHeroImage()}
                      alt=""
                      className="absolute inset-0 h-[100%] rounded-[6px]"
                    />
                    <img
                      src={foundHeroImage()}
                      alt=""
                      className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.4]"
                    />
                    <span class="absolute tooltip group-hover:opacity-100 left-[42%] top-[45%] opacity-0">
                      hero image
                    </span>
                  </Show>
                  <Show when={!foundHeroImage()}>
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
                        className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px] opacity-[0.4]"
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
                  </Show>
                </button>
              </div>

              <Show when={foundLogoImage()}>
                <button
                  onClick={locateLogo}
                  className="locatedHeroImg group  absolute bottom-[20px] left-[20px] "
                  aria-label="logo">
                  <img src={foundLogoImage()} alt="" className="h-[60px] " />
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    logo
                  </span>
                </button>
              </Show>

              <Show when={!foundLogoImage()}>
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
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 mr-2 cursor-pointer w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}
                  onClick={async () => {
                    gameName() == undefined
                      ? await shellOpen("https://www.steamgriddb.com/")
                      : gameName() == ""
                      ? await shellOpen("https://www.steamgriddb.com/")
                      : await shellOpen(
                          "https://www.steamgriddb.com/search/grids?term=" +
                            gameName().replaceAll(" ", "+"),
                        );
                  }}>
                  find assets
                </div>
                <div
                  aria-label="not that accurate"
                  className={`bg-[#1c1c1c] py-1 px-3 mr-2 cursor-pointer w-[max-content] text-[#ffffff80] hint--left hint--no-animate hint--rounded hint--no-arrow rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}
                  onClick={getGameAssets}>
                  auto find assets
                </div>
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
