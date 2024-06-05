import { Match, Show, Switch, createSignal, useContext } from "solid-js";
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
import { ChevronArrow, Close, Loading, SaveDisk } from "../libraries/Icons";
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
        `${dataEntryContext.gameName()} ${translateText("is already in your library")}`,
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
          },
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
          },
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
          },
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
      `${
        import.meta.env.VITE_CLEAR_API_URL
      }/?gameName=${dataEntryContext.gameName()}`,
    )
      .then((res) =>
        res.json().then(async (jsonres) => {
          if (jsonres.data.length === 0) {
            triggerToast(translateText("couldn't find that game :("));
          } else {
            applicationStateContext.setSGDBGames(jsonres.data);
          }
        }),
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
      }/?assets=${selectedDataContext.selectedGameId()}`,
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
                ", ",
              )} & ${lastAssetType} :(`,
            );
            return;
          }

          triggerToast(
            `${translateText("couldn't find")} ${missingAssets[0]} :(`,
          );
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
        closeDialog("newGameModal", ref);

        function handleTab(e) {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
      className="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d1cc] dark:bg-[#121212cc]">
      <div className="flex h-screen  w-screen flex-col  items-center justify-center gap-3">
        <div className="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p className="text-[25px] text-[#00000080] dark:text-[#ffffff80]">
              {translateText("add new game")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                dataEntryContext.setFavouriteGame((x) => !x);
              }}>
              <Show
                when={dataEntryContext.favouriteGame()}
                fallback={
                  <div className="!w-max">{translateText("favourite")}</div>
                }>
                <div className="relative">
                  <div className="!w-max">{translateText("favourite")}</div>
                  <div className="absolute inset-0 -z-10 !w-max opacity-70 blur-[5px]">
                    {translateText("favourite")}
                  </div>
                </div>
              </Show>
            </button>
            <button
              type="button"
              onClick={addGame}
              className="standardButton flex items-center gap-1 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] ">
              <p className="!w-max">{translateText("save")}</p>

              <SaveDisk />
            </button>
            <button
              type="button"
              className="standardButton flex items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("newGameModal");
                getData();
              }}>
              ​
              <Close />
            </button>
          </div>
        </div>

        <div className="flex gap-[1rem]">
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
                      : i + 1,
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
                      : i + 1,
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
            className="panelButton locatingGridImg group relative aspect-[2/3] h-full cursor-pointer overflow-hidden bg-[#f1f1f1] dark:bg-[#1c1c1c]">
            <Show
              when={dataEntryContext.foundGridImage()}
              fallback={
                <>
                  <Show
                    when={dataEntryContext.locatedGridImage()}
                    fallback={
                      <span class="tooltip absolute left-[35%] top-[47%] opacity-0 group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]">
                        {translateText("grid/cover")} <br />
                      </span>
                    }>
                    <img
                      className="absolute inset-0 aspect-[2/3]"
                      src={convertFileSrc(dataEntryContext.locatedGridImage())}
                      alt=""
                    />
                    <span class="tooltip absolute left-[35%] top-[47%] opacity-0  group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] ">
                      {translateText("grid/cover")} <br />
                    </span>
                  </Show>
                </>
              }>
              <Show when={showGridImageLoading() === false}>
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
              </Show>

              <span
                class={`tooltip absolute left-[35%] top-[47%] flex items-center gap-[5px] max-large:left-[25%] max-large:top-[45%] ${
                  showGridImageLoading() === false
                    ? "opacity-0 group-hover:opacity-100"
                    : ""
                }`}>
                <span className="opacity-50">
                  {dataEntryContext.foundGridImageIndex()} /{" "}
                  {dataEntryContext.foundGridImage().length - 1}
                </span>
                <Show
                  when={showGridImageLoading() === false}
                  fallback={
                    <div className="h-max w-max animate-spin-slow">
                      <Loading />
                    </div>
                  }>
                  {translateText("scroll")}
                </Show>
              </span>
            </Show>
          </button>

          <div className="relative flex flex-col gap-3">
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
                        : i + 1,
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
                        : i + 1,
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
              className="panelButton group relative m-0 aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 dark:bg-[#1c1c1c] max-large:h-[250px]"
              aria-label="hero">
              <Show
                when={dataEntryContext.foundHeroImage()}
                className="absolute inset-0 overflow-hidden"
                fallback={
                  <>
                    <Show
                      when={dataEntryContext.locatedHeroImage()}
                      className="absolute inset-0 overflow-hidden"
                      fallback={
                        <span class="tooltip absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100">
                          {translateText("hero")}
                        </span>
                      }>
                      <img
                        src={convertFileSrc(
                          dataEntryContext.locatedHeroImage(),
                        )}
                        alt=""
                        className="absolute inset-0 aspect-[96/31] h-full rounded-[6px]"
                      />
                      <img
                        src={convertFileSrc(
                          dataEntryContext.locatedHeroImage(),
                        )}
                        alt=""
                        className="absolute inset-0 -z-10 aspect-[96/31] h-full rounded-[6px] opacity-[0.4] blur-[80px]"
                      />
                      <span class="tooltip absolute left-[45%] top-[47%] opacity-0 group-hover:opacity-100">
                        {translateText("hero")}
                      </span>
                    </Show>
                  </>
                }>
                <Show when={showHeroImageLoading() === false}>
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
                    className="absolute inset-0 aspect-[96/31] h-full rounded-[6px] "
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
                    className="absolute inset-0 -z-10 aspect-[96/31] h-full rounded-[6px] opacity-[0.4] blur-[80px] "
                  />
                </Show>

                <span
                  class={`tooltip absolute left-[42%] top-[45%] flex items-center gap-[5px] ${
                    showHeroImageLoading() === false
                      ? "opacity-0 group-hover:opacity-100"
                      : ""
                  }`}>
                  <span className="opacity-50">
                    {dataEntryContext.foundHeroImageIndex()} /{" "}
                    {dataEntryContext.foundHeroImage().length - 1}
                  </span>
                  <Show
                    when={showHeroImageLoading() === false}
                    fallback={
                      <div className="h-max w-max animate-spin-slow">
                        <Loading />
                      </div>
                    }>
                    {translateText("scroll")}
                  </Show>
                </span>
              </Show>
            </button>

            <Show
              when={dataEntryContext.foundLogoImage()}
              fallback={
                <>
                  <Show
                    when={dataEntryContext.locatedLogo()}
                    fallback={
                      <button
                        type="button"
                        onClick={locateLogo}
                        onContextMenu={() => {
                          dataEntryContext.setLocatedLogo(undefined);
                          dataEntryContext.setFoundLogoImage(undefined);
                        }}
                        className="panelButton group absolute bottom-[70px] left-[20px]  z-[100] h-[90px] w-[250px] cursor-pointer bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[90px] max-large:w-[243px] "
                        aria-label="logo">
                        <span class="tooltip absolute left-[40%] top-[35%] opacity-0 group-hover:opacity-100 max-large:left-[38%] max-large:top-[32%]">
                          {translateText("logo")}
                        </span>
                      </button>
                    }>
                    <button
                      type="button"
                      onClick={locateLogo}
                      onContextMenu={() => {
                        dataEntryContext.setLocatedLogo(undefined);
                        dataEntryContext.setFoundLogoImage(undefined);
                      }}
                      className="panelButton group absolute bottom-[70px] left-[20px] cursor-pointer bg-[#E8E8E800] bg-[#f1f1f1] dark:bg-[#1c1c1c] dark:bg-[#27272700]"
                      aria-label="logo">
                      <img
                        src={convertFileSrc(dataEntryContext.locatedLogo())}
                        alt=""
                        className="relative aspect-auto max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
                      />
                      <span class="tooltip absolute left-[35%] top-[30%] opacity-0 group-hover:opacity-100">
                        {translateText("logo")}
                      </span>
                    </button>
                  </Show>
                </>
              }>
              <button
                type="button"
                onClick={locateLogo}
                onScroll={() => {}}
                onWheel={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.deltaY <= 0) {
                      dataEntryContext.setFoundLogoImageIndex((i) =>
                        i === dataEntryContext.foundLogoImage().length - 1
                          ? 0
                          : i + 1,
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
                          : i + 1,
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
                onContextMenu={() => {
                  dataEntryContext.setLocatedLogo(undefined);
                  dataEntryContext.setFoundLogoImage(undefined);
                }}
                className="panelButton group absolute  bottom-[60px] left-[10px] cursor-pointer bg-[#E8E8E800] bg-[#f1f1f1] dark:bg-[#1c1c1c] dark:bg-[#27272700]"
                aria-label="logo">
                <img
                  src={
                    dataEntryContext.foundLogoImage()[
                      dataEntryContext.foundLogoImageIndex()
                    ]
                  }
                  alt=""
                  className={`relative h-[90px] w-[250px] !object-scale-down max-large:h-[90px] max-large:w-[243px] ${
                    showLogoImageLoading() ? "opacity-0" : ""
                  }`}
                  onLoad={() => {
                    setShowLogoImageLoading(false);
                  }}
                />

                <span
                  className={`tooltip absolute left-[33%] top-[35%] flex  items-center gap-[5px] max-large:left-[30%] max-large:top-[35%]  ${
                    showLogoImageLoading() === false
                      ? "opacity-0 group-hover:opacity-100"
                      : ""
                  }`}>
                  <span className="opacity-50">
                    {dataEntryContext.foundLogoImageIndex()} /{" "}
                    {dataEntryContext.foundLogoImage().length - 1}
                  </span>

                  <Show
                    when={showLogoImageLoading() === false}
                    fallback={
                      <div className="relative h-max w-max animate-spin-slow">
                        <Loading />
                      </div>
                    }>
                    <span>{translateText("scroll")} </span>
                  </Show>
                </span>
              </button>
            </Show>

            <div className="flex cursor-pointer items-center gap-3 ">
              <Show
                when={dataEntryContext.foundIconImage()}
                fallback={
                  <button
                    type="button"
                    onClick={locateIcon}
                    onContextMenu={() => {
                      dataEntryContext.setLocatedIcon(undefined);
                      dataEntryContext.setFoundIconImage(undefined);
                    }}
                    className="group relative !bg-[#27272700] p-0"
                    aria-label="logo">
                    <Show
                      when={dataEntryContext.locatedIcon()}
                      fallback={
                        <div className="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                      }>
                      <img
                        src={convertFileSrc(dataEntryContext.locatedIcon())}
                        alt=""
                        className="h-[40px] w-[40px]"
                      />
                    </Show>
                    <span class="tooltip absolute left-[-10%] top-[120%] z-[10000] opacity-0 group-hover:opacity-100 ">
                      {translateText("icon")}
                    </span>
                  </button>
                }>
                <button
                  type="button"
                  onClick={locateIcon}
                  onScroll={() => {}}
                  onWheel={(e) => {
                    if (applicationStateContext.SGDBGames()) {
                      if (e.deltaY <= 0) {
                        dataEntryContext.setFoundIconImageIndex((i) =>
                          i === dataEntryContext.foundIconImage().length - 1
                            ? 0
                            : i + 1,
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
                            : i + 1,
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
                  onContextMenu={() => {
                    dataEntryContext.setLocatedIcon(undefined);
                    dataEntryContext.setFoundIconImage(undefined);
                  }}
                  className="group relative p-0"
                  aria-label="logo">
                  <Show
                    when={showIconImageLoading() === false}
                    fallback={
                      <div className="h-[40px] w-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]">
                        <div className="absolute left-[32%] top-[30%] animate-spin-slow">
                          <Loading />
                        </div>
                      </div>
                    }>
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
                      className="h-[40px] w-[40px]"
                    />
                  </Show>

                  <span
                    className={`tooltip absolute left-[-55%] top-[120%] z-[10000] flex items-center gap-[5px] opacity-0 group-hover:opacity-100 ${
                      showIconImageLoading() === false
                        ? "opacity-0 group-hover:opacity-100"
                        : ""
                    }`}>
                    <span className="opacity-50">
                      {dataEntryContext.foundIconImageIndex()} /{" "}
                      {dataEntryContext.foundIconImage().length - 1}
                    </span>

                    <span>{translateText("scroll")} </span>
                  </span>
                </button>
              </Show>

              <div
                className="gameInput flex items-center bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc]"
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
                  type="button"
                  className="standardButton !mr-2 !mt-0  !w-max cursor-pointer bg-[#f1f1f1] px-3 py-1 !text-black text-[#ffffff80] hover:!bg-[#d6d6d6] dark:!bg-[#1c1c1c] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
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
                      <p className="w-[70px] text-clip text-[10px]">
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
                  className="standardButton  !mr-2 !mt-0  !w-max cursor-pointer bg-[#f1f1f1] px-3 py-1 !text-black text-[#ffffff80] hover:!bg-[#d6d6d6] dark:bg-[#1c1c1c] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
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
                      <p className="w-[100px] text-clip text-[10px]">
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
                className="standardButton !mt-0 !w-max bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
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
                        .slice(
                          0,
                          7,
                        )}...${dataEntryContext.locatedGame().toString().slice(-7)}`
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

        <div className="flex  w-[84rem] justify-between max-large:w-[61rem]">
          <span className="opacity-50">
            {translateText("right click to empty image selection")}
          </span>
          <Show
            when={
              applicationStateContext.SGDBGames() &&
              selectedDataContext.selectedGameId() === undefined
            }>
            <span className="opacity-80">
              {translateText("select the official name of your game")}
            </span>
          </Show>
        </div>

        <Show when={applicationStateContext.SGDBGames()}>
          <Show when={selectedDataContext.selectedGameId() === undefined}>
            <div className="gameInput flex w-[84rem] bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc] max-large:w-[61rem]">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("SGDBGamesContainer").scrollLeft -=
                    40;
                }}>
                <ChevronArrow />
              </button>
              <div
                id="SGDBGamesContainer"
                className="SGDBGamesContainer flex gap-[5px] overflow-x-auto scroll-smooth">
                <For each={applicationStateContext.SGDBGames()}>
                  {(foundGame) => {
                    return (
                      <button
                        type="button"
                        className="flex-shrink-0"
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
                  document.getElementById("SGDBGamesContainer").scrollLeft +=
                    40;
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
