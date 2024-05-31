import { Show, createSignal, useContext } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import * as fs from "@tauri-apps/api/fs";

import {
  getData,
  generateRandomString,
  translateText,
  updateData,
} from "../Globals";

import { open } from "@tauri-apps/api/dialog";
import { ChevronArrow, Close, Loading, SaveDisk } from "../components/Icons";
import { produce } from "solid-js/store";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataEntryContext,
  UIContext,
} from "../Globals";

export function NewGame() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLeading, setShowIconImageLoading] = createSignal(false);

  async function addGame() {
    if (
      dataEntryContext.gameName() == "" ||
      dataEntryContext.gameName() == undefined
    ) {
      uiContext.setShowToast(true);
      applicationStateContext.setToastMessage(translateText("no game name"));
      setTimeout(() => {
        uiContext.setShowToast(false);
      }, 1500);
      return;
    }

    for (
      let x = 0;
      x < Object.keys(globalContext.libraryData.games).length;
      x++
    ) {
      if (
        dataEntryContext.gameName() ==
        Object.keys(globalContext.libraryData.games)[x]
      ) {
        uiContext.setShowToast(true);
        applicationStateContext.setToastMessage(
          dataEntryContext.gameName() +
            " " +
            translateText("is already in your library"),
        );
        setTimeout(() => {
          uiContext.setShowToast(false);
        }, 1500);
        return;
      }
    }

    let heroImageFileName;
    let gridImageFileName;
    let logoFileName;
    let iconFileName;

    document.querySelector("[data-loadingModal]").show();

    if (dataEntryContext.foundGridImage()) {
      gridImageFileName = generateRandomString() + ".png";
      invoke("download_image", {
        link: dataEntryContext.foundGridImage()[
          dataEntryContext.foundGridImageIndex()
        ],
        location:
          applicationStateContext.appDataDirPath() +
          "grids\\" +
          gridImageFileName,
      });
    } else {
      if (dataEntryContext.locatedGridImage()) {
        gridImageFileName =
          generateRandomString() +
          "." +
          dataEntryContext.locatedGridImage().split(".")[
            dataEntryContext.locatedGridImage().split(".").length - 1
          ];

        await copyFile(
          dataEntryContext.locatedGridImage(),
          "grids\\" + gridImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        );
      }
    }

    if (dataEntryContext.foundHeroImage()) {
      heroImageFileName = generateRandomString() + ".png";

      invoke("download_image", {
        link: dataEntryContext.foundHeroImage()[
          dataEntryContext.foundHeroImageIndex()
        ],
        location:
          applicationStateContext.appDataDirPath() +
          "heroes\\" +
          heroImageFileName,
      });
    } else {
      if (dataEntryContext.locatedHeroImage()) {
        heroImageFileName =
          generateRandomString() +
          "." +
          dataEntryContext.locatedHeroImage().split(".")[
            dataEntryContext.locatedHeroImage().split(".").length - 1
          ];

        await copyFile(
          dataEntryContext.locatedHeroImage(),
          "heroes\\" + heroImageFileName,
          {
            dir: BaseDirectory.AppData,
          },
        );
      }
    }

    if (dataEntryContext.foundLogoImage()) {
      logoFileName = generateRandomString() + ".png";

      invoke("download_image", {
        link: dataEntryContext.foundLogoImage()[
          dataEntryContext.foundLogoImageIndex()
        ],
        location:
          applicationStateContext.appDataDirPath() + "logos\\" + logoFileName,
      });
    } else {
      if (dataEntryContext.locatedLogo()) {
        logoFileName =
          generateRandomString() +
          "." +
          dataEntryContext.locatedLogo().split(".")[
            dataEntryContext.locatedLogo().split(".").length - 1
          ];

        await copyFile(
          dataEntryContext.locatedLogo(),
          "logos\\" + logoFileName,
          {
            dir: BaseDirectory.AppData,
          },
        );
      }
    }

    if (dataEntryContext.foundIconImage()) {
      iconFileName = generateRandomString() + ".png";

      invoke("download_image", {
        link: dataEntryContext.foundIconImage()[
          dataEntryContext.foundIconImageIndex()
        ],
        location:
          applicationStateContext.appDataDirPath() + "icons\\" + iconFileName,
      });
    } else {
      if (dataEntryContext.locatedIcon()) {
        iconFileName =
          generateRandomString() +
          "." +
          dataEntryContext.locatedIcon().split(".")[
            dataEntryContext.locatedIcon().split(".").length - 1
          ];

        await copyFile(
          dataEntryContext.locatedIcon(),
          "icons\\" + iconFileName,
          {
            dir: BaseDirectory.AppData,
          },
        );
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.games[dataEntryContext.gameName()] = {
          location: dataEntryContext.locatedGame(),
          name: dataEntryContext.gameName(),
          heroImage: heroImageFileName,
          gridImage: gridImageFileName,
          logo: logoFileName,
          icon: iconFileName,
          favourite: dataEntryContext.favouriteGame(),
        };

        return data;
      }),
    );

    document.querySelector("[data-loadingModal]").close();

    await updateData();

    getData();
  }

  async function locateGame() {
    dataEntryContext.setlocatedGame(
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
    dataEntryContext.setFoundGridImage(undefined);
    dataEntryContext.setLocatedGridImage(
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
    dataEntryContext.setFoundHeroImage(undefined);
    dataEntryContext.setLocatedHeroImage(
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
    dataEntryContext.setFoundLogoImage(undefined);
    dataEntryContext.setLocatedLogo(
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
    dataEntryContext.setFoundIconImage(undefined);
    dataEntryContext.setLocatedIcon(
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
    applicationStateContext.setSGDBGames(undefined);
    await fetch(
      `https://clear-api.adithya.zip/?gameName=${dataEntryContext.gameName()}`,
    )
      .then((res) =>
        res.json().then(async (jsonres) => {
          if (jsonres.data.length == 0) {
            uiContext.setShowToast(true);
            applicationStateContext.setToastMessage(
              translateText("couldn't find that game :("),
            );
            setTimeout(() => {
              uiContext.setShowToast(false);
            }, 2500);
          } else {
            applicationStateContext.setSGDBGames(jsonres.data);
          }
        }),
      )
      .catch((err) => {
        uiContext.setShowToast(true);
        applicationStateContext.setToastMessage(
          translateText("you're not connected to the internet :("),
        );
        setTimeout(() => {
          uiContext.setShowToast(false);
        }, 2500);
      });
  }

  async function getGameAssets() {
    dataEntryContext.setFoundGridImage(undefined);
    dataEntryContext.setFoundHeroImage(undefined);
    dataEntryContext.setFoundLogoImage(undefined);
    dataEntryContext.setFoundIconImage(undefined);

    await fetch(
      `https://clear-api.adithya.zip/?assets=${selectedDataContext.selectedGameId()}`,
    ).then((res) =>
      res.json().then(async (jsonres) => {
        let missingAssets = [];

        jsonres.grids.length != 0
          ? dataEntryContext.setFoundGridImage(jsonres.grids)
          : missingAssets.push("grids");
        jsonres.heroes.length != 0
          ? dataEntryContext.setFoundHeroImage(jsonres.heroes)
          : missingAssets.push("heroes");
        jsonres.logos.length != 0
          ? dataEntryContext.setFoundLogoImage(jsonres.logos)
          : missingAssets.push("logos");
        jsonres.icons.length != 0
          ? dataEntryContext.setFoundIconImage(jsonres.icons)
          : missingAssets.push("icons");

        if (missingAssets.length != 0) {
          if (missingAssets.length == 4) {
            uiContext.setShowToast(true);
            applicationStateContext.setToastMessage(
              translateText("couldn't find any assets :("),
            );
            setTimeout(() => {
              uiContext.setShowToast(false);
            }, 2500);
            return;
          }

          if (missingAssets.length >= 2) {
            let lastAssetType = missingAssets.splice(-1);
            uiContext.setShowToast(true);
            applicationStateContext.setToastMessage(
              `${translateText("couldn't find")} ${missingAssets.join(
                ", ",
              )} & ${lastAssetType} :(`,
            );
            setTimeout(() => {
              uiContext.setShowToast(false);
            }, 2500);
            return;
          }

          uiContext.setShowToast(true);
          applicationStateContext.setToastMessage(
            `${translateText("couldn't find")} ${missingAssets[0]} :(`,
          );
          setTimeout(() => {
            uiContext.setShowToast(false);
          }, 2500);
        }
      }),
    );
  }

  return (
    <dialog
      data-newGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      ref={(ref) => {
        const focusableElements = ref.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTab(e) {
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
        dataEntryContext.setFavouriteGame();
        dataEntryContext.setGameName("");
        dataEntryContext.setLocatedGridImage("");
        dataEntryContext.setLocatedHeroImage("");
        dataEntryContext.setLocatedLogo("");
        dataEntryContext.setlocatedGame(undefined);
        dataEntryContext.setLocatedIcon("");
        dataEntryContext.setFoundGridImage(undefined);
        dataEntryContext.setFoundHeroImage(undefined);
        dataEntryContext.setFoundLogoImage(undefined);
        dataEntryContext.setFoundIconImage(undefined);
        selectedDataContext.setSelectedGameId(undefined);
        applicationStateContext.setSGDBGames(undefined);
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#121212cc] bg-[#d1d1d1cc]">
      <div className="flex flex-col  justify-center items-center  w-screen h-screen gap-3">
        <div className="flex justify-between max-large:w-[61rem] w-[84rem]">
          <div>
            <p className="dark:text-[#ffffff80] text-[#00000080] text-[25px]">
              {translateText("add new game")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="cursor-pointer"
              onClick={() => {
                dataEntryContext.setFavouriteGame((x) => !x);
              }}>
              <Show when={dataEntryContext.favouriteGame()}>
                <div className="relative">
                  <div className="!w-max">{translateText("favourite")}</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                    {translateText("favourite")}
                  </div>
                </div>
              </Show>

              <Show when={!dataEntryContext.favouriteGame()}>
                <div className="!w-max">{translateText("favourite")}</div>
              </Show>
            </button>
            <button
              onClick={addGame}
              className="flex items-center gap-1 standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] ">
              <p className="!w-max">{translateText("save")}</p>

              <SaveDisk />
            </button>
            <button
              className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !gap-0"
              onClick={() => {
                document.querySelector("[data-newGameModal]").close();
                getData();
              }}>
              ​
              <Close />
            </button>
          </div>
        </div>

        <div className="flex gap-[1rem]">
          <button
            onClick={locateGridImage}
            onScroll={() => {}}
            onWheel={(e) => {
              if (applicationStateContext.SGDBGames()) {
                if (e.deltaY <= 0) {
                  dataEntryContext.setFoundGridImageIndex((i) =>
                    i == dataEntryContext.foundGridImage().length - 1
                      ? 0
                      : i + 1,
                  );
                  setShowGridImageLoading(true);
                }

                if (e.deltaY >= 0) {
                  if (dataEntryContext.foundGridImageIndex() != 0) {
                    dataEntryContext.setFoundGridImageIndex((i) => i - 1);
                    setShowGridImageLoading(true);
                  } else {
                    setShowGridImageLoading(false);
                  }
                }
              }
            }}
            onContextMenu={() => {
              dataEntryContext.setLocatedGridImage(undefined);
              dataEntryContext.setFoundGridImage(undefined);
            }}
            className="panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c] locatingGridImg h-full aspect-[2/3] group relative overflow-hidden">
            <Show when={dataEntryContext.foundGridImage()}>
              <Show when={showGridImageLoading() == false}>
                <img
                  className="absolute inset-0 aspect-[2/3]"
                  src={
                    dataEntryContext.foundGridImage()[
                      dataEntryContext.foundGridImageIndex()
                    ]
                  }
                  alt=""
                  onLoad={() => {
                    setShowGridImageLoading(false);
                  }}
                />
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                  {translateText("grid/cover")} <br />
                </span>
              </Show>
              <Show when={showGridImageLoading() == true}>
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                  {translateText("grid/cover")} <br />
                </span>

                <div className="animate-spin-slow absolute">
                  <Loading />
                </div>
              </Show>

              <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                {translateText("grid/cover")}
              </span>
            </Show>
            <Show when={!dataEntryContext.foundGridImage()}>
              {" "}
              <Show when={dataEntryContext.locatedGridImage()}>
                <img
                  className="absolute inset-0 aspect-[2/3]"
                  src={convertFileSrc(dataEntryContext.locatedGridImage())}
                  alt=""
                />
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0 ">
                  {translateText("grid/cover")} <br />
                </span>
              </Show>
              <Show when={!dataEntryContext.locatedGridImage()}>
                <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                  {translateText("grid/cover")} <br />
                </span>
              </Show>
            </Show>
          </button>

          <div className="flex flex-col gap-3 relative">
            <button
              onClick={locateHeroImage}
              onScroll={() => {}}
              onWheel={(e) => {
                if (applicationStateContext.SGDBGames()) {
                  if (e.deltaY <= 0) {
                    dataEntryContext.setFoundHeroImageIndex((i) =>
                      i == dataEntryContext.foundHeroImage().length - 1
                        ? 0
                        : i + 1,
                    );
                    setShowHeroImageLoading(true);
                  }

                  if (e.deltaY >= 0) {
                    if (dataEntryContext.foundHeroImageIndex() != 0) {
                      dataEntryContext.setFoundHeroImageIndex((i) => i - 1);
                      setShowHeroImageLoading(true);
                    } else {
                      setShowHeroImageLoading(false);
                    }
                  }
                }
              }}
              onContextMenu={() => {
                dataEntryContext.setLocatedHeroImage(undefined);
                dataEntryContext.setFoundHeroImage(undefined);
              }}
              className="max-large:h-[250px] h-[350px] aspect-[67/26] group relative p-0 m-0 panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
              aria-label="hero">
              <Show
                when={dataEntryContext.foundHeroImage()}
                className="absolute inset-0 overflow-hidden">
                <Show when={showHeroImageLoading() == false}>
                  <img
                    src={
                      dataEntryContext.foundHeroImage()[
                        dataEntryContext.foundHeroImageIndex()
                      ]
                    }
                    onLoad={() => {
                      setShowHeroImageLoading(false);
                    }}
                    alt=""
                    className="absolute inset-0 h-full rounded-[6px] aspect-[96/31]"
                  />
                  <img
                    src={
                      dataEntryContext.foundHeroImage()[
                        dataEntryContext.foundHeroImageIndex()
                      ]
                    }
                    onLoad={() => {
                      setShowHeroImageLoading(false);
                    }}
                    alt=""
                    className="absolute inset-0 -z-10 h-full aspect-[96/31] rounded-[6px] blur-[80px] opacity-[0.4]"
                  />
                </Show>
                <Show when={showHeroImageLoading()}>
                  <div className="animate-spin-slow absolute">
                    <Loading />
                  </div>
                </Show>
                <span class="absolute tooltip group-hover:opacity-100 left-[42%] top-[45%] opacity-0">
                  {translateText("hero")}
                </span>
              </Show>
              <Show when={!dataEntryContext.foundHeroImage()}>
                <Show
                  when={dataEntryContext.locatedHeroImage()}
                  className="absolute inset-0 overflow-hidden">
                  <img
                    src={convertFileSrc(dataEntryContext.locatedHeroImage())}
                    alt=""
                    className="absolute inset-0 h-full rounded-[6px] aspect-[96/31]"
                  />
                  <img
                    src={convertFileSrc(dataEntryContext.locatedHeroImage())}
                    alt=""
                    className="absolute inset-0 -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.4] aspect-[96/31]"
                  />
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                    {translateText("hero")}
                  </span>
                </Show>
                <Show when={!dataEntryContext.locatedHeroImage()}>
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[42%] max-large:top-[45%] left-[45%] top-[47%] opacity-0">
                    {translateText("hero")}
                  </span>
                </Show>
              </Show>
            </button>

            <Show when={dataEntryContext.foundLogoImage()}>
              <button
                onClick={locateLogo}
                onScroll={() => {}}
                onWheel={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.deltaY <= 0) {
                      dataEntryContext.setFoundLogoImageIndex((i) =>
                        i == dataEntryContext.foundLogoImage().length - 1
                          ? 0
                          : i + 1,
                      );
                      setShowLogoImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (dataEntryContext.foundLogoImageIndex() != 0) {
                        dataEntryContext.setFoundLogoImageIndex((i) => i - 1);
                        setShowLogoImageLoading(true);
                      } else {
                        setShowLogoImageLoading(false);
                      }
                    }
                  }
                }}
                onContextMenu={() => {
                  dataEntryContext.setLocatedLogo(undefined);
                  dataEntryContext.setFoundLogoImage(undefined);
                }}
                className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[70px] left-[20px] panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
                aria-label="logo">
                <Show when={showLogoImageLoading() == false}>
                  <img
                    src={
                      dataEntryContext.foundLogoImage()[
                        dataEntryContext.foundLogoImageIndex()
                      ]
                    }
                    alt=""
                    className="relative aspect-auto max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                    onLoad={() => {
                      setShowLogoImageLoading(false);
                    }}
                  />
                </Show>
                <Show when={showLogoImageLoading()}>
                  <button
                    onClick={locateLogo}
                    onContextMenu={() => {
                      dataEntryContext.setLocatedLogo(undefined);
                      dataEntryContext.setFoundLogoImage(undefined);
                    }}
                    className="panelButton cursor-pointer   bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[20px] left-[20px] max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] z-[100] ">
                    <div className="animate-spin-slow absolute">
                      <Loading />
                    </div>
                  </button>
                </Show>
                <Show when={showLogoImageLoading() == false}>
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    {translateText("logo")}
                  </span>
                </Show>
              </button>
            </Show>

            <Show when={!dataEntryContext.foundLogoImage()}>
              <Show when={dataEntryContext.locatedLogo()}>
                <button
                  onClick={locateLogo}
                  onContextMenu={() => {
                    dataEntryContext.setLocatedLogo(undefined);
                    dataEntryContext.setFoundLogoImage(undefined);
                  }}
                  className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[70px] left-[20px] panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
                  aria-label="logo">
                  <img
                    src={convertFileSrc(dataEntryContext.locatedLogo())}
                    alt=""
                    className="relative aspect-auto max-large:max-h-[70px] max-large:max-w-[300px] max-h-[100px] max-w-[400px]"
                  />
                  <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                    {translateText("logo")}
                  </span>
                </button>
              </Show>

              <Show when={!dataEntryContext.locatedLogo()}>
                <button
                  onClick={locateLogo}
                  onContextMenu={() => {
                    dataEntryContext.setLocatedLogo(undefined);
                    dataEntryContext.setFoundLogoImage(undefined);
                  }}
                  className="panelButton cursor-pointer  bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[70px] left-[20px] max-large:w-[170px] max-large:h-[70px] w-[250px] h-[90px] z-[100] "
                  aria-label="logo">
                  <span class="absolute tooltip group-hover:opacity-100 max-large:left-[35%] max-large:top-[30%] left-[40%] top-[35%] opacity-0">
                    {translateText("logo")}
                  </span>
                </button>
              </Show>
            </Show>

            <div className="flex gap-3 items-center cursor-pointer ">
              <Show when={dataEntryContext.foundIconImage()}>
                <button
                  onClick={locateIcon}
                  onScroll={() => {}}
                  onWheel={(e) => {
                    if (applicationStateContext.SGDBGames()) {
                      if (e.deltaY <= 0) {
                        dataEntryContext.setFoundIconImageIndex((i) =>
                          i == dataEntryContext.foundIconImage().length - 1
                            ? 0
                            : i + 1,
                        );
                        setShowIconImageLoading(true);
                      }

                      if (e.deltaY >= 0) {
                        if (dataEntryContext.foundIconImageIndex() != 0) {
                          dataEntryContext.setFoundIconImageIndex((i) => i - 1);
                          setShowIconImageLoading(true);
                        } else {
                          setShowIconImageLoading(false);
                        }
                      }
                    }
                  }}
                  onContextMenu={() => {
                    dataEntryContext.setLocatedIcon(undefined);
                    dataEntryContext.setFoundIconImage(undefined);
                  }}
                  className="relative group p-0"
                  aria-label="logo">
                  <Show when={showIconImageLeading() == false}>
                    <img
                      src={
                        dataEntryContext.foundIconImage()[
                          dataEntryContext.foundIconImageIndex()
                        ]
                      }
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
                        globalContext.libraryData.userSettings.roundedBorders
                          ? "6px"
                          : "0px"
                      }]`}>
                      <div className="animate-spin-slow absolute top-[24%] left-[27%]">
                        <Loading />
                      </div>
                    </div>
                  </Show>
                  <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0 ">
                    {translateText("icon")}
                  </span>
                </button>
              </Show>
              <Show when={!dataEntryContext.foundIconImage()}>
                <button
                  onClick={locateIcon}
                  onContextMenu={() => {
                    dataEntryContext.setLocatedIcon(undefined);
                    dataEntryContext.setFoundIconImage(undefined);
                  }}
                  className="relative !bg-[#27272700] group p-0"
                  aria-label="logo">
                  <Show when={!dataEntryContext.locatedIcon()}>
                    <div
                      className={`w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] rounded-[${
                        globalContext.libraryData.userSettings.roundedBorders
                          ? "6px"
                          : "0px"
                      }]`}
                    />
                  </Show>
                  <Show when={dataEntryContext.locatedIcon()}>
                    <img
                      src={convertFileSrc(dataEntryContext.locatedIcon())}
                      alt=""
                      className="w-[40px] h-[40px]"
                    />
                  </Show>
                  <span class="absolute tooltip z-[10000] group-hover:opacity-100 left-[-10%] top-[120%] opacity-0 ">
                    {translateText("icon")}
                  </span>
                </button>
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
                    dataEntryContext.setGameName(e.currentTarget.value);
                  }}
                  value={dataEntryContext.gameName()}
                  className="!bg-transparent"
                  placeholder={translateText("name of game")}
                />
                <button
                  className={`standardButton  !text-black dark:!text-white  hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0 bg-[#f1f1f1] dark:!bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80] rounded-[${
                    globalContext.libraryData.userSettings.roundedBorders
                      ? "6px"
                      : "0px"
                  }] `}
                  onClick={async () => {
                    if (
                      dataEntryContext.gameName() == "" ||
                      dataEntryContext.gameName() == undefined
                    ) {
                      uiContext.setShowToast(true);
                      applicationStateContext.setToastMessage(
                        translateText("no game name"),
                      );
                      setTimeout(() => {
                        uiContext.setShowToast(false);
                      }, 1500);
                      return;
                    }

                    searchGameName();
                    selectedDataContext.setSelectedGameId(undefined);
                    applicationStateContext.setSGDBGames(undefined);
                    dataEntryContext.setFoundGridImage(undefined);
                    dataEntryContext.setFoundHeroImage(undefined);
                    dataEntryContext.setFoundLogoImage(undefined);
                    dataEntryContext.setFoundIconImage(undefined);
                  }}>
                  <Show
                    when={
                      globalContext.libraryData.userSettings.language == "fr" &&
                      applicationStateContext.windowWidth() >= 1500
                    }>
                    {translateText("auto find assets")}
                  </Show>

                  <Show
                    when={
                      globalContext.libraryData.userSettings.language == "fr" &&
                      applicationStateContext.windowWidth() <= 1500
                    }>
                    <p className="text-[10px] text-clip w-[70px]">
                      {translateText("auto find assets")}
                    </p>
                  </Show>

                  <Show
                    when={
                      globalContext.libraryData.userSettings.language != "fr"
                    }>
                    {translateText("auto find assets")}
                  </Show>
                </button>
                <button
                  className={`standardButton  !text-black dark:!text-white  hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0 bg-[#f1f1f1] dark:bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80] rounded-[${
                    globalContext.libraryData.userSettings.roundedBorders
                      ? "6px"
                      : "0px"
                  }] `}
                  onClick={async () => {
                    dataEntryContext.gameName() == undefined
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : dataEntryContext.gameName() == ""
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : invoke("open_location", {
                          location:
                            "https://www.steamgriddb.com/search/grids?term=" +
                            dataEntryContext.gameName(),
                        });
                  }}>
                  <Show
                    when={
                      globalContext.libraryData.userSettings.language == "fr" &&
                      applicationStateContext.windowWidth() >= 1500
                    }>
                    {translateText("find assets")}
                  </Show>

                  <Show
                    when={
                      globalContext.libraryData.userSettings.language == "fr" &&
                      applicationStateContext.windowWidth() <= 1500
                    }>
                    <p className="text-[10px] text-clip w-[100px]">
                      {translateText("find assets")}
                    </p>
                  </Show>

                  <Show
                    when={
                      globalContext.libraryData.userSettings.language != "fr"
                    }>
                    {translateText("find assets")}
                  </Show>
                </button>
              </div>

              <button
                onClick={locateGame}
                onContextMenu={() => {
                  dataEntryContext.setlocatedGame(undefined);
                }}
                className="standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0">
                {dataEntryContext.locatedGame() == undefined
                  ? translateText("locate game")
                  : dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                  ? "..." +
                    dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString()
                      .slice(0, 7) +
                    "..." +
                    dataEntryContext.locatedGame().toString().slice(-7)
                  : "..." +
                    dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString()}
              </button>
            </div>
          </div>
        </div>

        <div className="flex  justify-between max-large:w-[61rem] w-[84rem]">
          <span className="opacity-50">
            {translateText("right click to empty image selection")}
          </span>
          <Show when={applicationStateContext.SGDBGames()}>
            <Show when={selectedDataContext.selectedGameId() == undefined}>
              <span className="opacity-80">
                {translateText("select the official name of your game")}
              </span>
            </Show>
            <Show when={selectedDataContext.selectedGameId()}>
              <span className="opacity-80">
                {translateText(
                  "scroll on the image to select a different asset",
                )}
              </span>
            </Show>
          </Show>
        </div>

        <Show when={applicationStateContext.SGDBGames()}>
          <Show when={selectedDataContext.selectedGameId() == undefined}>
            <div className="dark:bg-[#272727cc] bg-[#E8E8E8cc] gameInput flex backdrop-blur-[10px] max-large:w-[61rem] w-[84rem]">
              <button
                onClick={() => {
                  document.getElementById(
                    "SGDBGamesContainer",
                  ).scrollLeft -= 40;
                }}>
                <ChevronArrow />
              </button>
              <div
                id="SGDBGamesContainer"
                className="flex gap-[5px] overflow-x-auto SGDBGamesContainer scroll-smooth">
                <For each={applicationStateContext.SGDBGames()}>
                  {(foundGame) => {
                    return (
                      <button
                        className="flex-shrink-0"
                        onClick={() => {
                          selectedDataContext.setSelectedGameId(undefined);
                          selectedDataContext.setSelectedGameId(foundGame.id);
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
                <div className="rotate-180">
                  <ChevronArrow />
                </div>
              </button>
            </div>
          </Show>
        </Show>
      </div>
    </dialog>
  );
}
