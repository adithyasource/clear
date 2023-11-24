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
  roundedBorders,
  setShowToast,
  setToastMessage,
  setLocatedIcon,
  locatedIcon,
  setEditedLocatedIcon,
} from "../Signals";

import { Show } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";

import { getData, generateRandomString } from "../App";

import { open } from "@tauri-apps/api/dialog";

export function NewGame() {
  async function addGame() {
    if (gameName() == "" || gameName() == undefined) {
      setShowToast(true);
      setToastMessage("no game name");
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    for (let x = 0; x < Object.keys(libraryData().games).length; x++) {
      if (gameName() == Object.keys(libraryData().games)[x]) {
        setShowToast(true);
        setToastMessage(`${gameName()} is already in your library`);
        setTimeout(() => {
          setShowToast(false);
        }, 1500);
        return;
      }
    }

    let heroImageFileName;
    let gridImageFileName;
    let logoFileName;
    let iconFileName;

    if (locatedHeroImage()) {
      heroImageFileName =
        generateRandomString() +
        "." +
        locatedHeroImage().split(".")[locatedHeroImage().split(".").length - 1];

      await copyFile(locatedHeroImage(), "heroes\\" + heroImageFileName, {
        dir: BaseDirectory.AppData,
      });
    }

    if (locatedGridImage()) {
      gridImageFileName =
        generateRandomString() +
        "." +
        locatedGridImage().split(".")[locatedGridImage().split(".").length - 1];

      await copyFile(locatedGridImage(), "grids\\" + gridImageFileName, {
        dir: BaseDirectory.AppData,
      });
    }
    if (locatedLogo()) {
      logoFileName =
        generateRandomString() +
        "." +
        locatedLogo().split(".")[locatedLogo().split(".").length - 1];

      await copyFile(locatedLogo(), "logos\\" + logoFileName, {
        dir: BaseDirectory.AppData,
      });
    }
    if (locatedIcon()) {
      iconFileName =
        generateRandomString() +
        "." +
        locatedIcon().split(".")[locatedIcon().split(".").length - 1];

      await copyFile(locatedIcon(), "icons\\" + iconFileName, {
        dir: BaseDirectory.AppData,
      });
    }

    libraryData().games[gameName()] = {
      location: locatedGame(),
      name: gameName(),
      heroImage: heroImageFileName,
      gridImage: gridImageFileName,
      logo: logoFileName,
      icon: iconFileName,
      favourite: favouriteGame(),
    };
    setLibraryData(libraryData());

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
      document.querySelector("[data-newGameModal]").show();
    });
  }

  async function locateGame() {
    setlocatedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk", "url"],
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
            extensions: ["png", "jpg", "jpeg", "webp"],
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
            extensions: ["png", "jpg", "jpeg", "webp"],
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
            extensions: ["png", "jpg", "jpeg", "webp"],
          },
        ],
      }),
    );
  }

  async function locateIcon() {
    setLocatedIcon(
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

  // ! Scrapped code for auto fetching game assets
  // ! Will revisit this feature in a future update

  // async function getGameAssets() {
  //   let steamAppId;
  //   let gridsUrls = [];
  //   let heroesUrls = [];
  //   let logosUrls = [];
  //   let allGames = [];

  //   const response = await fetch(
  //     "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
  //     {
  //       method: "GET",
  //       timeout: 30,
  //       contentType: "application/json",
  //     },
  //   );

  //   for (let x = 0; x < response.data.applist["apps"].length; x++) {
  //     allGames.push(response.data.applist["apps"][x].name);
  //   }

  //   let fuse = new Fuse(allGames, {
  //     threshold: 0.3,
  //   });

  //   async function iterateGames(iteration) {
  //     let closestMatchingName = fuse.search(gameName())[iteration].item;

  //     for (let x = 0; x < response.data.applist["apps"].length; x++) {
  //       if (response.data.applist["apps"][x].name == closestMatchingName) {
  //         steamAppId = response.data.applist["apps"][x].appid;
  //       }
  //     }

  //     const client = await getClient();

  //     const grids = await client.get(
  //       `https://www.steamgriddb.com/api/v2/grids/steam/${steamAppId}`,
  //       {
  //         timeout: 30,
  //         responseType: ResponseType.JSON,
  //         headers: {
  //           Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
  //         },
  //       },
  //     );

  //     const heroes = await client.get(
  //       `https://www.steamgriddb.com/api/v2/heroes/steam/${steamAppId}`,
  //       {
  //         timeout: 30,
  //         responseType: ResponseType.JSON,
  //         headers: {
  //           Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
  //         },
  //       },
  //     );

  //     const logos = await client.get(
  //       `https://www.steamgriddb.com/api/v2/logos/steam/${steamAppId}`,
  //       {
  //         timeout: 30,
  //         responseType: ResponseType.JSON,
  //         headers: {
  //           Authorization: "Bearer 4e602b67332f3b8afff8d994b40dc1b7",
  //         },
  //       },
  //     );

  //     setFoundGridImage(grids.data["data"][0].thumb);

  //     setFoundHeroImage(heroes.data["data"][0].thumb);

  //     setFoundLogoImage(logos.data["data"][0].thumb);
  //   }

  //   try {
  //     iterateGames(0);
  //   } catch (error) {
  //     iterateGames(1);
  //   }
  // }

  return (
    <dialog
      data-newGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        setFavouriteGame();
        setGameName("");
        setLocatedGridImage("");
        setLocatedHeroImage("");
        setLocatedLogo("");
        setlocatedGame(undefined);
        setLocatedIcon("");
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#d1d1d1cc]">
      <div className="flex flex-col  justify-center items-center  w-screen h-screen gap-3">
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <div>
            <p className="dark:text-[#ffffff80] text-[#00000080] text-[25px]">
              add new game
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                setFavouriteGame(!favouriteGame());
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
              className="flex items-center gap-1 standardButton">
              save
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                  className="stroke-black dark:stroke-white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 3V8H15V3"
                  className="stroke-black dark:stroke-white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path
                  d="M7 21V15H17V21"
                  className="stroke-black dark:stroke-white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <button
              className="flex items-center standardButton !gap-0"
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
        <div className="flex max-large:gap-[13.5rem] gap-[18.5rem]">
          <div>
            <div
              onClick={locateGridImage}
              onContextMenu={() => {
                setLocatedGridImage(undefined);
              }}
              className="panelButton locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden">
              {/* <Show when={foundGridImage()}>
                <img
                  className="absolute inset-0"
                  src={foundGridImage()}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show> */}
              {/* <Show when={!foundGridImage()}> */}{" "}
              <Show when={locatedGridImage()}>
                <img
                  className="absolute inset-0"
                  src={convertFileSrc(locatedGridImage())}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0">
                  grid/cover <br />
                </span>
              </Show>
              <Show when={!locatedGridImage()}>
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                  grid/cover <br />
                </span>
              </Show>
              {/* </Show> */}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative ">
              <div>
                <div
                  onClick={locateHeroImage}
                  onContextMenu={() => {
                    setLocatedHeroImage(undefined);
                  }}
                  className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton"
                  aria-label="hero">
                  {/* <Show
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
                  </Show> */}
                  {/* <Show when={!foundHeroImage()}> */}
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
                    <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                      hero image
                    </span>
                  </Show>
                  <Show when={!locatedHeroImage()}>
                    <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                      hero image
                    </span>
                  </Show>
                  {/* </Show> */}
                </div>
              </div>

              {/* <Show when={foundLogoImage()}>
                <div
                  onClick={locateLogo}
                  className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[20px] left-[20px] panelButton"
                  aria-label="logo">
                  <img src={foundLogoImage()} alt="" className="h-[60px] " />
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    logo
                  </span>
                </div>
              </Show> */}

              {/* <Show when={!foundLogoImage()}> */}
              <Show when={locatedLogo()}>
                <div
                  onClick={locateLogo}
                  onContextMenu={() => {
                    setLocatedLogo(undefined);
                  }}
                  className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[20px] left-[20px] panelButton"
                  aria-label="logo">
                  <img
                    src={convertFileSrc(locatedLogo())}
                    alt=""
                    className="relative aspect-auto max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    logo
                  </span>
                </div>
              </Show>

              <Show when={!locatedLogo()}>
                <div
                  onClick={locateLogo}
                  onContextMenu={() => {
                    setLocatedLogo(undefined);
                  }}
                  className="panelButton bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[20px] left-[20px] max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] z-[100] "
                  aria-label="logo">
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                    logo
                  </span>
                </div>
              </Show>
              {/* </Show> */}
            </div>

            <div className="flex gap-3 items-center cursor-pointer ">
              <div
                onClick={locateIcon}
                onContextMenu={() => {
                  setLocatedIcon(undefined);
                }}
                className="relative !bg-[#27272700] group "
                aria-label="logo">
                <Show when={!locatedIcon()}>
                  <div
                    className={`w-[40px] h-[40px] bg-[#E8E8E8] dark:!bg-[#1C1C1C] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }]`}
                  />
                </Show>
                <Show when={locatedIcon()}>
                  <img
                    src={convertFileSrc(locatedIcon())}
                    alt=""
                    className="w-[40px] h-[40px]"
                  />
                </Show>
                <span class="absolute tooltip group-hover:opacity-100 left-[-10%] top-[120%] opacity-0 ">
                  icon
                </span>
              </div>
              <div
                className="flex items-center gameInput dark:bg-[#272727cc] bg-[#E8E8E8cc] backdrop-blur-[10px]"
                style="flex-grow: 1">
                <input
                  aria-autocomplete="none"
                  type="text"
                  name=""
                  style="flex-grow: 1;"
                  id=""
                  onInput={(e) => {
                    setGameName(e.currentTarget.value);
                  }}
                  value={gameName()}
                  className="!bg-transparent"
                  placeholder="name of game"
                />
                <button
                  className={`standardButton !w-max !mt-0 bg-[#f1f1f1] dark:!bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}
                  onClick={async () => {
                    gameName() == undefined
                      ? invoke("open_explorer", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : gameName() == ""
                      ? invoke("open_explorer", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : invoke("open_explorer", {
                          location:
                            "https://www.steamgriddb.com/search/grids?term=" +
                            gameName(),
                        });
                  }}>
                  find assets
                </button>
              </div>

              <button
                onClick={locateGame}
                onContextMenu={() => {
                  setlocatedGame(undefined);
                }}
                className="standardButton !w-max !mt-0">
                {locatedGame() == undefined
                  ? "locate game"
                  : "..." + locatedGame().slice(-25)}
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
