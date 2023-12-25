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
  foundGridImage,
  setFoundGridImage,
  foundHeroImage,
  setFoundHeroImage,
  foundLogoImage,
  setFoundLogoImage,
  foundIconImage,
  setFoundIconImage,
  setSGDBGames,
  SGDBGames,
  selectedGameId,
  setSelectedGameId,
  foundGridImageIndex,
  setFoundGridImageIndex,
  foundHeroImageIndex,
  setFoundHeroImageIndex,
  foundLogoImageIndex,
  setFoundLogoImageIndex,
  foundIconImageIndex,
  setFoundIconImageIndex,
} from "../Signals";

import { Show, Suspense, createSignal } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import * as fs from "@tauri-apps/api/fs";

import { getData, generateRandomString, downloadImage } from "../App";

import { open } from "@tauri-apps/api/dialog";

export function NewGame() {
  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLeading, setShowIconImageLoading] = createSignal(false);

  async function addGame() {
    document.querySelector("[data-loadingModal]").show();

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

    if (foundGridImage() != undefined) {
      gridImageFileName = generateRandomString() + ".png";

      await fetch(
        `https://clear-api.vercel.app/?image=${
          foundGridImage()[foundGridImageIndex()]
        }`,
      ).then((res) =>
        res.json().then(async (jsonres) => {
          downloadImage("grids\\" + gridImageFileName, jsonres.image);
        }),
      );
    } else {
      if (locatedGridImage()) {
        gridImageFileName =
          generateRandomString() +
          "." +
          locatedGridImage().split(".")[
            locatedGridImage().split(".").length - 1
          ];

        await copyFile(locatedGridImage(), "grids\\" + gridImageFileName, {
          dir: BaseDirectory.AppData,
        });
      }
    }

    if (foundHeroImage() != undefined) {
      heroImageFileName = generateRandomString() + ".png";

      await fetch(
        `https://clear-api.vercel.app/?image=${
          foundHeroImage()[foundHeroImageIndex()]
        }`,
      ).then((res) =>
        res.json().then(async (jsonres) => {
          downloadImage("heroes\\" + heroImageFileName, jsonres.image);
        }),
      );
    } else {
      if (locatedHeroImage()) {
        heroImageFileName =
          generateRandomString() +
          "." +
          locatedHeroImage().split(".")[
            locatedHeroImage().split(".").length - 1
          ];

        await copyFile(locatedHeroImage(), "heroes\\" + heroImageFileName, {
          dir: BaseDirectory.AppData,
        });
      }
    }

    if (foundLogoImage() != undefined) {
      logoFileName = generateRandomString() + ".png";

      await fetch(
        `https://clear-api.vercel.app/?image=${
          foundLogoImage()[foundLogoImageIndex()]
        }`,
      ).then((res) =>
        res.json().then(async (jsonres) => {
          downloadImage("logos\\" + logoFileName, jsonres.image);
        }),
      );
    } else {
      if (locatedLogo()) {
        logoFileName =
          generateRandomString() +
          "." +
          locatedLogo().split(".")[locatedLogo().split(".").length - 1];

        await copyFile(locatedLogo(), "logos\\" + logoFileName, {
          dir: BaseDirectory.AppData,
        });
      }
    }

    if (foundIconImage() != undefined) {
      iconFileName = generateRandomString() + ".png";

      await fetch(
        `https://clear-api.vercel.app/?image=${
          foundIconImage()[foundIconImageIndex()]
        }`,
      ).then((res) =>
        res.json().then(async (jsonres) => {
          downloadImage("icons\\" + iconFileName, jsonres.image);
        }),
      );
    } else {
      if (locatedIcon()) {
        iconFileName =
          generateRandomString() +
          "." +
          locatedIcon().split(".")[locatedIcon().split(".").length - 1];

        await copyFile(locatedIcon(), "icons\\" + iconFileName, {
          dir: BaseDirectory.AppData,
        });
      }
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
      document.querySelector("[data-loadingModal]").close();
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
  async function locateGridImage() {
    setFoundGridImage(undefined);
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
  async function locateHeroImage() {
    setFoundHeroImage(undefined);
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
  async function locateLogo() {
    setFoundLogoImage(undefined);
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
    setFoundIconImage(undefined);
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

  async function searchGameName() {
    setSGDBGames(undefined);
    await fetch(`https://clear-api.vercel.app/?gameName=${gameName()}`).then(
      (res) =>
        res.json().then(async (jsonres) => {
          setSGDBGames(jsonres.data);
        }),
    );
  }

  async function getGameAssets() {
    setShowGridImageLoading(true);
    setFoundGridImage(undefined);
    setFoundHeroImage(undefined);
    setFoundLogoImage(undefined);
    setFoundIconImage(undefined);

    await fetch(
      `https://clear-api.vercel.app/?assets=${selectedGameId()}`,
    ).then((res) =>
      res.json().then(async (jsonres) => {
        console.log(jsonres);

        jsonres.grids
          ? setFoundGridImage(jsonres.grids)
          : setFoundGridImage(undefined);
        jsonres.heroes
          ? setFoundHeroImage(jsonres.heroes)
          : setFoundHeroImage(undefined);
        jsonres.logos
          ? setFoundLogoImage(jsonres.logos)
          : setFoundLogoImage(undefined);
        jsonres.icons
          ? setFoundIconImage(jsonres.icons)
          : setFoundIconImage(undefined);

        setShowGridImageLoading(false);
      }),
    );
  }

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
              onWheel={(e) => {
                if (SGDBGames()) {
                  if (e.deltaY == -100) {
                    setFoundGridImageIndex((i) =>
                      i == foundGridImage().length - 1 ? 0 : i + 1,
                    );

                    setShowGridImageLoading(true);
                  }

                  if (e.deltaY == 100) {
                    console.log("down");

                    if (foundGridImageIndex() != 0) {
                      setFoundGridImageIndex((i) => i - 1);
                      setShowGridImageLoading(true);
                    } else {
                      setShowGridImageLoading(false);
                    }
                  }

                  console.log(foundGridImage().length);

                  console.log(foundGridImageIndex());
                }
              }}
              onContextMenu={() => {
                setLocatedGridImage(undefined);
                setFoundGridImage(undefined);
              }}
              className="panelButton locatingGridImg h-full aspect-[2/3] group relative overflow-hidden">
              <Show when={foundGridImage()}>
                <Show when={showGridImageLoading() == false}>
                  <img
                    className="absolute inset-0"
                    src={foundGridImage()[foundGridImageIndex()]}
                    alt=""
                    onLoad={() => {
                      setShowGridImageLoading(false);
                    }}
                  />
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                    grid/cover <br />
                  </span>
                </Show>
                <Show when={showGridImageLoading() == true}>
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                    grid/cover <br />
                  </span>

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="animate-spin-slow absolute"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22"
                      className="stroke-[#000000] dark:stroke-[#ffffff] "
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                  </svg>
                </Show>

                <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                  grid/cover
                </span>
              </Show>
              <Show when={!foundGridImage()}>
                {" "}
                <Show when={locatedGridImage()}>
                  <img
                    className="absolute inset-0 aspect-[2/3]"
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
              </Show>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative ">
              <div>
                <div
                  onClick={locateHeroImage}
                  onWheel={(e) => {
                    if (SGDBGames()) {
                      if (e.deltaY == -100) {
                        setFoundHeroImageIndex((i) => i + 1);
                      }
                      if (e.deltaY == 100) {
                        setFoundHeroImageIndex((i) => (i == 0 ? 0 : i - 1));
                      }

                      setShowHeroImageLoading(true);
                    }
                  }}
                  onContextMenu={() => {
                    setLocatedHeroImage(undefined);
                    setFoundHeroImage(undefined);
                  }}
                  className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton"
                  aria-label="hero">
                  <Show
                    when={foundHeroImage()}
                    className="absolute inset-0 overflow-hidden">
                    <Show when={showHeroImageLoading() == false}>
                      <img
                        src={foundHeroImage()[foundHeroImageIndex()]}
                        onLoad={() => {
                          setShowHeroImageLoading(false);
                        }}
                        alt=""
                        className="absolute inset-0 h-full rounded-[6px]"
                      />
                      <img
                        src={foundHeroImage()[foundHeroImageIndex()]}
                        onLoad={() => {
                          setShowHeroImageLoading(false);
                        }}
                        alt=""
                        className="absolute inset-0 -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.4]"
                      />
                    </Show>
                    <Show when={showHeroImageLoading()}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="animate-spin-slow"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22"
                          className="stroke-[#000000] dark:stroke-[#ffffff] "
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </svg>
                    </Show>
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
                        className="absolute inset-0 h-full rounded-[6px]"
                      />
                      <img
                        src={convertFileSrc(locatedHeroImage())}
                        alt=""
                        className="absolute inset-0 -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.4]"
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
                  </Show>
                </div>
              </div>

              <Show when={foundLogoImage()}>
                <div
                  onClick={locateLogo}
                  onWheel={(e) => {
                    if (SGDBGames()) {
                      if (e.deltaY == -100) {
                        setFoundLogoImageIndex((i) => i + 1);
                      }
                      if (e.deltaY == 100) {
                        setFoundLogoImageIndex((i) => (i == 0 ? 0 : i - 1));
                      }

                      setShowLogoImageLoading(true);
                    }
                  }}
                  onContextMenu={() => {
                    setLocatedLogo(undefined);
                    setFoundLogoImage(undefined);
                  }}
                  className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[20px] left-[20px] panelButton"
                  aria-label="logo">
                  <Show when={showLogoImageLoading() == false}>
                    <img
                      src={foundLogoImage()[foundLogoImageIndex()]}
                      alt=""
                      className="h-[60px] "
                      onLoad={() => {
                        setShowLogoImageLoading(false);
                      }}
                    />
                  </Show>
                  <Show when={showLogoImageLoading()}>
                    <div
                      onClick={locateLogo}
                      onContextMenu={() => {
                        setLocatedLogo(undefined);
                        setFoundLogoImage(undefined);
                      }}
                      className="panelButton bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[20px] left-[20px] max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] z-[100] ">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="animate-spin-slow"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22"
                          className="stroke-[#000000] dark:stroke-[#ffffff] "
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </svg>
                    </div>
                  </Show>
                  <Show when={showLogoImageLoading() == false}>
                    <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                      logo
                    </span>
                  </Show>
                </div>
              </Show>

              <Show when={!foundLogoImage()}>
                <Show when={locatedLogo()}>
                  <div
                    onClick={locateLogo}
                    onContextMenu={() => {
                      setLocatedLogo(undefined);
                      setFoundLogoImage(undefined);
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
                      setFoundLogoImage(undefined);
                    }}
                    className="panelButton bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[20px] left-[20px] max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] z-[100] "
                    aria-label="logo">
                    <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                      logo
                    </span>
                  </div>
                </Show>
              </Show>
            </div>

            <div className="flex gap-3 items-center cursor-pointer ">
              <Show when={foundIconImage()}>
                <div
                  onClick={locateIcon}
                  onWheel={(e) => {
                    if (SGDBGames()) {
                      if (e.deltaY == -100) {
                        setFoundIconImageIndex((i) => i + 1);
                      }
                      if (e.deltaY == 100) {
                        setFoundIconImageIndex((i) => (i == 0 ? 0 : i - 1));
                      }

                      setShowIconImageLoading(true);
                    }
                  }}
                  onContextMenu={() => {
                    setLocatedIcon(undefined);
                    setFoundIconImage(undefined);
                  }}
                  className="relative group "
                  aria-label="logo">
                  <Show when={showIconImageLeading() == false}>
                    <img
                      src={foundIconImage()[foundIconImageIndex()]}
                      alt=""
                      onLoad={() => {
                        setShowIconImageLoading(false);
                      }}
                      className="w-[40px] h-[40px]"
                    />
                  </Show>
                  <Show when={showIconImageLeading()}>
                    <div
                      className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]  rounded-[${
                        roundedBorders() ? "6px" : "0px"
                      }]`}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="animate-spin-slow absolute top-[24%] left-[27%]"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22"
                          className="stroke-[#000000] dark:stroke-[#ffffff] "
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </svg>
                    </div>
                  </Show>
                  <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0 ">
                    icon
                  </span>
                </div>
              </Show>
              <Show when={!foundIconImage()}>
                <div
                  onClick={locateIcon}
                  onContextMenu={() => {
                    setLocatedIcon(undefined);
                    setFoundIconImage(undefined);
                  }}
                  className="relative !bg-[#27272700] group "
                  aria-label="logo">
                  <Show when={!locatedIcon()}>
                    <div
                      className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
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
                  <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0 ">
                    icon
                  </span>
                </div>
              </Show>

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
                    searchGameName();
                    setSelectedGameId(undefined);
                    setSGDBGames(undefined);
                    setFoundGridImage(undefined);
                    setFoundHeroImage(undefined);
                    setFoundLogoImage(undefined);
                    setFoundIconImage(undefined);
                  }}>
                  auto find assets
                </button>
                <button
                  className={`standardButton !w-max !mt-0 bg-[#f1f1f1] dark:!bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}
                  onClick={async () => {
                    gameName() == undefined
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : gameName() == ""
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : invoke("open_location", {
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

        <div className="flex  justify-between max-large:w-[61rem] w-[84rem]">
          <span className="opacity-50">
            right click to empty image selection
          </span>
          <Show when={SGDBGames()}>
            <Show when={selectedGameId() == undefined}>
              <span className="opacity-80">
                select the official name of your game
              </span>
            </Show>
            <Show when={selectedGameId()}>
              <span className="opacity-80">
                scroll on the image to select a different asset
              </span>
            </Show>
          </Show>
        </div>

        <Show when={SGDBGames()}>
          <Show when={selectedGameId() == undefined}>
            <div className="dark:bg-[#272727cc] bg-[#E8E8E8cc] gameInput flex backdrop-blur-[10px] max-large:w-[61rem] w-[84rem]">
              <button
                onClick={() => {
                  document.getElementById(
                    "SGDBGamesContainer",
                  ).scrollLeft -= 40;
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 8L10 12L14 16"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              <div
                id="SGDBGamesContainer"
                className="flex gap-[5px] overflow-x-auto SGDBGamesContainer scroll-smooth">
                <For each={SGDBGames()}>
                  {(foundGame) => {
                    return (
                      <button
                        className="flex-shrink-0"
                        onClick={() => {
                          setSelectedGameId(undefined);
                          setSelectedGameId(foundGame.id);
                          getGameAssets();
                        }}>
                        {foundGame.name}
                      </button>
                    );
                  }}
                </For>
              </div>
              <button
                onClick={() => {
                  document.getElementById(
                    "SGDBGamesContainer",
                  ).scrollLeft += 40;
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 8L14 12L10 16"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
            </div>
          </Show>
        </Show>
      </div>
    </dialog>
  );
}
