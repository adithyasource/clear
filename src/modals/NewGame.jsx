import { Match, Show, Switch, createSignal, useContext, For } from "solid-js";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";

import {
  getData,
  generateRandomString,
  translateText,
  updateData,
  closeDialog,
  openDialog,
} from "../Globals";

import { open } from "@tauri-apps/api/dialog";
import {
  ChevronArrow,
  Close,
  Loading,
  SaveDisk,
  TrashDelete,
} from "../libraries/Icons";
import { produce } from "solid-js/store";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataEntryContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function NewGame() {
  const globalContext = useContext(GlobalContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLoading, setShowIconImageLoading] = createSignal(false);

  async function addGame() {
    if (
      dataEntryContext.gameName() === "" ||
      dataEntryContext.gameName() === undefined
    ) {
      triggerToast(translateText("no game name"));
      return;
    }

    let gameNameAlreadyExists = false;

    for (const gameName of Object.keys(globalContext.libraryData.games)) {
      if (dataEntryContext.gameName() === gameName) {
        gameNameAlreadyExists = true;
      }
    }

    if (gameNameAlreadyExists) {
      triggerToast(
        `${dataEntryContext.gameName()} ${translateText(
          "is already in your library"
        )}`
      );
      return;
    }

    let heroImageFileName;
    let gridImageFileName;
    let logoFileName;
    let iconFileName;

    openDialog("loadingModal");

    if (dataEntryContext.foundGridImage()) {
      gridImageFileName = `${generateRandomString()}.png`;
      invoke("download_image", {
        link: dataEntryContext.foundGridImage()[
          dataEntryContext.foundGridImageIndex()
        ],
        location: `${applicationStateContext.appDataDirPath()}grids\\${gridImageFileName}`,
      });
    } else {
      if (dataEntryContext.locatedGridImage()) {
        gridImageFileName = `${generateRandomString()}.${
          dataEntryContext.locatedGridImage().split(".")[
            dataEntryContext.locatedGridImage().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataEntryContext.locatedGridImage()}grids\\${gridImageFileName}`,
          {
            dir: BaseDirectory.AppData,
          }
        );
      }
    }

    if (dataEntryContext.foundHeroImage()) {
      heroImageFileName = `${generateRandomString()}.png`;

      invoke("download_image", {
        link: dataEntryContext.foundHeroImage()[
          dataEntryContext.foundHeroImageIndex()
        ],
        location: `${applicationStateContext.appDataDirPath()}heroes\\${heroImageFileName}`,
      });
    } else {
      if (dataEntryContext.locatedHeroImage()) {
        heroImageFileName = `${generateRandomString()}.${
          dataEntryContext.locatedHeroImage().split(".")[
            dataEntryContext.locatedHeroImage().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataEntryContext.locatedHeroImage()}heroes\\${heroImageFileName}`,
          {
            dir: BaseDirectory.AppData,
          }
        );
      }
    }

    if (dataEntryContext.foundLogoImage()) {
      logoFileName = `${generateRandomString()}.png`;

      invoke("download_image", {
        link: dataEntryContext.foundLogoImage()[
          dataEntryContext.foundLogoImageIndex()
        ],
        location: `${applicationStateContext.appDataDirPath()}logos\\${logoFileName}`,
      });
    } else {
      if (dataEntryContext.locatedLogo()) {
        logoFileName = `${generateRandomString()}.${
          dataEntryContext.locatedLogo().split(".")[
            dataEntryContext.locatedLogo().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataEntryContext.locatedLogo()}logos\\${logoFileName}`,
          {
            dir: BaseDirectory.AppData,
          }
        );
      }
    }

    if (dataEntryContext.foundIconImage()) {
      iconFileName = `${generateRandomString()}.png`;

      invoke("download_image", {
        link: dataEntryContext.foundIconImage()[
          dataEntryContext.foundIconImageIndex()
        ],
        location: `${applicationStateContext.appDataDirPath()}icons\\${iconFileName}`,
      });
    } else {
      if (dataEntryContext.locatedIcon()) {
        iconFileName = `${generateRandomString()}.${
          dataEntryContext.locatedIcon().split(".")[
            dataEntryContext.locatedIcon().split(".").length - 1
          ]
        }`;

        await copyFile(
          `${dataEntryContext.locatedIcon()}icons\\${iconFileName}`,
          {
            dir: BaseDirectory.AppData,
          }
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
      })
    );

    closeDialog("loadingModal");

    await updateData();
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
      })
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
      })
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
      })
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
      })
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
      })
    );
  }

  async function searchGameName() {
    applicationStateContext.setSGDBGames(undefined);
    await fetch(
      `${
        import.meta.env.VITE_CLEAR_API_URL
      }/?gameName=${dataEntryContext.gameName()}`
    )
      .then((res) =>
        res.json().then(async (jsonres) => {
          if (jsonres.data.length === 0) {
            triggerToast(translateText("couldn't find that game :("));
          } else {
            applicationStateContext.setSGDBGames(jsonres.data);
          }
        })
      )
      .catch((err) => {
        triggerToast(translateText("you're not connected to the internet :("));
      });
  }

  async function getGameAssets() {
    dataEntryContext.setFoundGridImage(undefined);
    dataEntryContext.setFoundHeroImage(undefined);
    dataEntryContext.setFoundLogoImage(undefined);
    dataEntryContext.setFoundIconImage(undefined);

    await fetch(
      `${
        import.meta.env.VITE_CLEAR_API_URL
      }/?assets=${selectedDataContext.selectedGameId()}`
    ).then((res) =>
      res.json().then(async (jsonres) => {
        const missingAssets = [];

        jsonres.grids.length !== 0
          ? dataEntryContext.setFoundGridImage(jsonres.grids)
          : missingAssets.push("grids");
        jsonres.heroes.length !== 0
          ? dataEntryContext.setFoundHeroImage(jsonres.heroes)
          : missingAssets.push("heroes");
        jsonres.logos.length !== 0
          ? dataEntryContext.setFoundLogoImage(jsonres.logos)
          : missingAssets.push("logos");
        jsonres.icons.length !== 0
          ? dataEntryContext.setFoundIconImage(jsonres.icons)
          : missingAssets.push("icons");

        if (missingAssets.length !== 0) {
          if (missingAssets.length === 4) {
            triggerToast(translateText("couldn't find any assets :("));
            return;
          }

          if (missingAssets.length >= 2) {
            const lastAssetType = missingAssets.splice(-1);
            triggerToast(
              `${translateText("couldn't find")} ${missingAssets.join(
                ", "
              )} & ${lastAssetType} :(`
            );
            return;
          }

          triggerToast(
            `${translateText("couldn't find")} ${missingAssets[0]} :(`
          );
        }
      })
    );
  }

  return (
    <dialog
      data-newGameModal
      onDragStart={(e) => {
        e.preventDefault();
      }}
      ref={(ref) => {
        closeDialog("newGameModal", ref);

        function handleTab(e) {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

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
      class="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d1cc] dark:bg-[#121212cc]">
      <div class="flex h-screen  w-screen flex-col  items-center justify-center gap-3">
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p class="text-[25px] text-[#00000080] dark:text-[#ffffff80]">
              {translateText("add new game")}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="cursor-pointer"
              onClick={() => {
                dataEntryContext.setFavouriteGame((x) => !x);
              }}>
              <Show
                when={dataEntryContext.favouriteGame()}
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
            </button>
            <button
              type="button"
              onClick={addGame}
              class="standardButton flex items-center gap-1 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <p class="!w-max">{translateText("save")}</p>

              <SaveDisk />
            </button>
            <button
              type="button"
              class="standardButton flex items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("newGameModal");
                getData();
              }}>
              ​
              <Close />
            </button>
          </div>
        </div>

        <div class="flex gap-[1rem]">
          {/* grid image card */}

          <button
            type="button"
            onClick={locateGridImage}
            onScroll={() => {}}
            onWheel={(e) => {
              if (applicationStateContext.SGDBGames()) {
                if (e.deltaY <= 0) {
                  dataEntryContext.setFoundGridImageIndex((i) =>
                    i === dataEntryContext.foundGridImage().length - 1
                      ? 0
                      : i + 1
                  );
                  setShowGridImageLoading(true);
                }

                if (e.deltaY >= 0) {
                  if (dataEntryContext.foundGridImageIndex() !== 0) {
                    dataEntryContext.setFoundGridImageIndex((i) => i - 1);
                    setShowGridImageLoading(true);
                  } else {
                    setShowGridImageLoading(false);
                  }
                }
              }
            }}
            onKeyDown={(e) => {
              if (applicationStateContext.SGDBGames()) {
                if (e.key === "ArrowRight") {
                  dataEntryContext.setFoundGridImageIndex((i) =>
                    i === dataEntryContext.foundGridImage().length - 1
                      ? 0
                      : i + 1
                  );
                  setShowGridImageLoading(true);
                }

                if (e.key === "ArrowLeft") {
                  if (dataEntryContext.foundGridImageIndex() !== 0) {
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
            class="aspect-[2/3] h-full cursor-pointer overflow-hidden bg-[#f1f1f1] dark:bg-[#1c1c1c] hint--center"
            data-tooltiptext={
              dataEntryContext.foundGridImage()
                ? showGridImageLoading() === false
                  ? `${dataEntryContext.foundGridImageIndex()} / ${
                      dataEntryContext.foundGridImage().length - 1
                    } scroll`
                  : "loading"
                : translateText("grid/cover")
            }>
            <img
              src={
                dataEntryContext.foundGridImage()
                  ? dataEntryContext.foundGridImage()[
                      dataEntryContext.foundGridImageIndex()
                    ]
                  : dataEntryContext.locatedGridImage()
                  ? convertFileSrc(dataEntryContext.locatedGridImage())
                  : // this is a gif which is completely empty
                    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              }
              alt=""
              class={`absolute inset-0 w-full h-full ${
                showGridImageLoading() ? "opacity-0" : ""
              }  `}
              onLoad={() => {
                setShowGridImageLoading(false);
              }}
            />
          </button>

          <div class="relative flex flex-col gap-3">
            <div class="flex">
              {/* hero image card */}

              <button
                type="button"
                onClick={locateHeroImage}
                onScroll={() => {}}
                onWheel={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.deltaY <= 0) {
                      dataEntryContext.setFoundHeroImageIndex((i) =>
                        i === dataEntryContext.foundHeroImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowHeroImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (dataEntryContext.foundHeroImageIndex() !== 0) {
                        dataEntryContext.setFoundHeroImageIndex((i) => i - 1);
                        setShowHeroImageLoading(true);
                      } else {
                        setShowHeroImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.key === "ArrowRight") {
                      dataEntryContext.setFoundHeroImageIndex((i) =>
                        i === dataEntryContext.foundHeroImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowHeroImageLoading(true);
                    }

                    if (e.key === "ArrowLeft") {
                      if (dataEntryContext.foundHeroImageIndex() !== 0) {
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
                class="aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 dark:bg-[#1c1c1c] max-large:h-[250px] hint--center"
                data-tooltiptext={
                  dataEntryContext.foundHeroImage()
                    ? showHeroImageLoading() === false
                      ? `${dataEntryContext.foundHeroImageIndex()} / ${
                          dataEntryContext.foundHeroImage().length - 1
                        } scroll`
                      : "loading"
                    : translateText("hero")
                }>
                <img
                  src={
                    dataEntryContext.foundHeroImage()
                      ? dataEntryContext.foundHeroImage()[
                          dataEntryContext.foundHeroImageIndex()
                        ]
                      : dataEntryContext.locatedHeroImage()
                      ? convertFileSrc(dataEntryContext.locatedHeroImage())
                      : // this is a gif which is completely empty
                        "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt=""
                  class={`w-full h-full aspect-[96/31] ${
                    showHeroImageLoading() ? "opacity-0" : ""
                  }`}
                  onLoad={() => {
                    setShowHeroImageLoading(false);
                  }}
                />
                <img
                  src={
                    dataEntryContext.foundHeroImage()
                      ? dataEntryContext.foundHeroImage()[
                          dataEntryContext.foundHeroImageIndex()
                        ]
                      : dataEntryContext.locatedHeroImage()
                      ? convertFileSrc(dataEntryContext.locatedHeroImage())
                      : // this is a gif which is completely empty
                        "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  onLoad={() => {
                    setShowHeroImageLoading(false);
                  }}
                  alt=""
                  class="w-full h-full absolute inset-0 -z-10 aspect-[96/31] opacity-[0.4] blur-[80px]"
                />
              </button>

              {/* logo image card */}

              <button
                type="button"
                onClick={locateLogo}
                onContextMenu={() => {
                  dataEntryContext.setLocatedLogo(undefined);
                  dataEntryContext.setFoundLogoImage(undefined);
                }}
                onScroll={() => {}}
                onWheel={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.deltaY <= 0) {
                      dataEntryContext.setFoundLogoImageIndex((i) =>
                        i === dataEntryContext.foundLogoImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowLogoImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (dataEntryContext.foundLogoImageIndex() !== 0) {
                        dataEntryContext.setFoundLogoImageIndex((i) => i - 1);
                        setShowLogoImageLoading(true);
                      } else {
                        setShowLogoImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.key === "ArrowRight") {
                      dataEntryContext.setFoundLogoImageIndex((i) =>
                        i === dataEntryContext.foundLogoImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowLogoImageLoading(true);
                    }

                    if (e.key === "ArrowLeft") {
                      if (dataEntryContext.foundLogoImageIndex() !== 0) {
                        dataEntryContext.setFoundLogoImageIndex((i) => i - 1);
                        setShowLogoImageLoading(true);
                      } else {
                        setShowLogoImageLoading(false);
                      }
                    }
                  }
                }}
                class={`bottom-[70px] left-[20px] !absolute z-[100] h-[90px] w-[250px] !p-[2px] cursor-pointer max-large:h-[90px] max-large:w-[243px] hint--center
                  ${
                    dataEntryContext.foundLogoImage() ||
                    dataEntryContext.locatedLogo()
                      ? "hover:outline-dashed !outline-[2px] !outline-[#E8E8E880] !outline:dark:bg-[#27272780]"
                      : "bg-[#E8E8E8] dark:!bg-[#272727]"
                  }
                    `}
                data-tooltiptext={
                  dataEntryContext.foundLogoImage()
                    ? showLogoImageLoading() === false
                      ? `${dataEntryContext.foundLogoImageIndex()} / ${
                          dataEntryContext.foundLogoImage().length - 1
                        } scroll`
                      : "loading"
                    : translateText("logo")
                }>
                <img
                  src={
                    dataEntryContext.foundLogoImage()
                      ? dataEntryContext.foundLogoImage()[
                          dataEntryContext.foundLogoImageIndex()
                        ]
                      : dataEntryContext.locatedLogo()
                      ? convertFileSrc(dataEntryContext.locatedLogo())
                      : // this is a gif which is completely empty
                        "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt=""
                  class={`!object-scale-down w-full h-full  ${
                    showLogoImageLoading() ? "opacity-0" : ""
                  }`}
                  onLoad={() => {
                    setShowLogoImageLoading(false);
                  }}
                />
              </button>
            </div>

            {/* h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727] */}

            <div class="flex cursor-pointer items-center gap-3 ">
              <button
                type="button"
                onClick={locateIcon}
                onContextMenu={() => {
                  dataEntryContext.setLocatedIcon(undefined);
                  dataEntryContext.setFoundIconImage(undefined);
                }}
                onScroll={() => {}}
                onWheel={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.deltaY <= 0) {
                      dataEntryContext.setFoundIconImageIndex((i) =>
                        i === dataEntryContext.foundIconImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowIconImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (dataEntryContext.foundIconImageIndex() !== 0) {
                        dataEntryContext.setFoundIconImageIndex((i) => i - 1);
                        setShowIconImageLoading(true);
                      } else {
                        setShowIconImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.key === "ArrowRight") {
                      dataEntryContext.setFoundIconImageIndex((i) =>
                        i === dataEntryContext.foundIconImage().length - 1
                          ? 0
                          : i + 1
                      );
                      setShowIconImageLoading(true);
                    }

                    if (e.key === "ArrowLeft") {
                      if (dataEntryContext.foundIconImageIndex() !== 0) {
                        dataEntryContext.setFoundIconImageIndex((i) => i - 1);
                        setShowIconImageLoading(true);
                      } else {
                        setShowIconImageLoading(false);
                      }
                    }
                  }
                }}
                class={`group relative p-0 hint--bottom ${
                  dataEntryContext.foundIconImage() ||
                  dataEntryContext.locatedIcon()
                    ? "hover:outline-dashed !outline-[2px] !outline-[#E8E8E880] !outline:dark:bg-[#27272780]"
                    : "bg-[#E8E8E8] dark:!bg-[#272727]"
                }`}
                data-tooltiptext={
                  dataEntryContext.foundIconImage()
                    ? showIconImageLoading() === false
                      ? `${dataEntryContext.foundIconImageIndex()} / ${
                          dataEntryContext.foundIconImage().length - 1
                        } scroll`
                      : "loading"
                    : translateText("icon")
                }>
                <img
                  src={
                    dataEntryContext.foundIconImage()
                      ? dataEntryContext.foundIconImage()[
                          dataEntryContext.foundIconImageIndex()
                        ]
                      : dataEntryContext.locatedIcon()
                      ? convertFileSrc(dataEntryContext.locatedIcon())
                      : // this is a gif which is completely empty
                        "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  }
                  alt=""
                  class={`!object-scale-down h-[40px] w-[40px]  ${
                    showIconImageLoading() ? "opacity-0" : ""
                  }`}
                  onLoad={() => {
                    setShowIconImageLoading(false);
                  }}
                />
              </button>

              <div
                class="gameInput flex items-center bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc]"
                style={{ "flex-grow": "1" }}>
                <input
                  aria-autocomplete="none"
                  type="text"
                  name=""
                  style={{ "flex-grow": "1" }}
                  id=""
                  onInput={(e) => {
                    dataEntryContext.setGameName(e.currentTarget.value);
                  }}
                  value={dataEntryContext.gameName()}
                  class="!bg-transparent"
                  placeholder={translateText("name of game")}
                />
                <button
                  type="button"
                  class="standardButton !mr-2 !mt-0  !w-max cursor-pointer bg-[#f1f1f1] px-3 py-1 !text-black text-[#ffffff80] hover:!bg-[#d6d6d6] dark:!bg-[#1c1c1c] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
                  onClick={async () => {
                    if (
                      dataEntryContext.gameName() === "" ||
                      dataEntryContext.gameName() === undefined
                    ) {
                      triggerToast(translateText("no game name"));
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
                  <Switch>
                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ===
                          "fr" && applicationStateContext.windowWidth() >= 1500
                      }>
                      {translateText("auto find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ===
                          "fr" && applicationStateContext.windowWidth() <= 1500
                      }>
                      <p class="w-[70px] text-clip text-[10px]">
                        {translateText("auto find assets")}
                      </p>
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language !== "fr"
                      }>
                      {translateText("auto find assets")}
                    </Match>
                  </Switch>
                </button>
                <button
                  type="button"
                  class="standardButton  !mr-2 !mt-0  !w-max cursor-pointer bg-[#f1f1f1] px-3 py-1 !text-black text-[#ffffff80] hover:!bg-[#d6d6d6] dark:bg-[#1c1c1c] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
                  onClick={async () => {
                    dataEntryContext.gameName() === undefined
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : dataEntryContext.gameName() === ""
                      ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                      : invoke("open_location", {
                          location: `https://www.steamgriddb.com/search/grids?term=${dataEntryContext.gameName()}`,
                        });
                  }}>
                  <Switch>
                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ===
                          "fr" && applicationStateContext.windowWidth() >= 1500
                      }>
                      {translateText("find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ===
                          "fr" && applicationStateContext.windowWidth() <= 1500
                      }>
                      <p class="w-[100px] text-clip text-[10px]">
                        {translateText("find assets")}
                      </p>
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language !== "fr"
                      }>
                      {translateText("find assets")}
                    </Match>
                  </Switch>
                </button>
              </div>

              <button
                type="button"
                onClick={locateGame}
                onContextMenu={() => {
                  dataEntryContext.setlocatedGame(undefined);
                }}
                class="standardButton !mt-0 !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                {dataEntryContext.locatedGame() === undefined
                  ? translateText("locate game")
                  : dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString().length > 17
                  ? `...${dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString()
                      .slice(0, 7)}...${dataEntryContext
                      .locatedGame()
                      .toString()
                      .slice(-7)}`
                  : `...${dataEntryContext
                      .locatedGame()
                      .toString()
                      .split("\\")
                      .slice(-1)
                      .toString()}`}
              </button>
            </div>
          </div>
        </div>

        <div class="flex  w-[84rem] justify-between max-large:w-[61rem]">
          <span class="opacity-50">
            {translateText("right click to empty image selection")}
          </span>
          <Show
            when={
              applicationStateContext.SGDBGames() &&
              selectedDataContext.selectedGameId() === undefined
            }>
            <span class="opacity-80">
              {translateText("select the official name of your game")}
            </span>
          </Show>
        </div>

        <Show when={applicationStateContext.SGDBGames()}>
          <Show when={selectedDataContext.selectedGameId() === undefined}>
            <div class="gameInput flex w-[84rem] bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc] max-large:w-[61rem]">
              <button
                type="button"
                onClick={() => {
                  document.getElementById(
                    "SGDBGamesContainer"
                  ).scrollLeft -= 40;
                }}>
                <ChevronArrow />
              </button>
              <div
                id="SGDBGamesContainer"
                class="SGDBGamesContainer flex gap-[5px] overflow-x-auto scroll-smooth">
                <For each={applicationStateContext.SGDBGames()}>
                  {(foundGame) => {
                    return (
                      <button
                        type="button"
                        class="flex-shrink-0"
                        onClick={() => {
                          selectedDataContext.setSelectedGameId(undefined);
                          selectedDataContext.setSelectedGameId(foundGame.id);
                          document.querySelector("[data-newGameModal]").focus();
                          getGameAssets();
                        }}>
                        {foundGame.name}
                      </button>
                    );
                  }}
                </For>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById(
                    "SGDBGamesContainer"
                  ).scrollLeft += 40;
                }}>
                <div class="rotate-180">
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
