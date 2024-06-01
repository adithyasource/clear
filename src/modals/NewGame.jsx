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
import { ChevronArrow, Close, Loading, SaveDisk } from "../components/Icons";
import { produce } from "solid-js/store";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataEntryContext,
  UIContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function NewGame() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLoading, setShowIconImageLoading] = createSignal(false);

  async function addGame() {
    if (
      dataEntryContext.gameName() == "" ||
      dataEntryContext.gameName() == undefined
    ) {
      triggerToast(translateText("no game name"));
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
        triggerToast(
          dataEntryContext.gameName() +
            " " +
            translateText("is already in your library"),
        );
        return;
      }
    }

    let heroImageFileName;
    let gridImageFileName;
    let logoFileName;
    let iconFileName;

    openDialog("loadingModal");

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

    closeDialog("loadingModal");

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
      `${
        import.meta.env.VITE_CLEAR_API_URL
      }/?gameName=${dataEntryContext.gameName()}`,
    )
      .then((res) =>
        res.json().then(async (jsonres) => {
          if (jsonres.data.length == 0) {
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
            triggerToast(translateText("couldn't find any assets :("));
            return;
          }

          if (missingAssets.length >= 2) {
            let lastAssetType = missingAssets.splice(-1);
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
              <Show
                when={dataEntryContext.favouriteGame()}
                fallback={
                  <div className="!w-max">{translateText("favourite")}</div>
                }>
                <div className="relative">
                  <div className="!w-max">{translateText("favourite")}</div>
                  <div className="absolute blur-[5px] opacity-70 -z-10 inset-0 !w-max">
                    {translateText("favourite")}
                  </div>
                </div>
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
            onKeyDown={(e) => {
              if (applicationStateContext.SGDBGames()) {
                if (e.key === "ArrowRight") {
                  dataEntryContext.setFoundGridImageIndex((i) =>
                    i == dataEntryContext.foundGridImage().length - 1
                      ? 0
                      : i + 1,
                  );
                  setShowGridImageLoading(true);
                }

                if (e.key === "ArrowLeft") {
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
            <Show
              when={dataEntryContext.foundGridImage()}
              fallback={
                <>
                  <Show
                    when={dataEntryContext.locatedGridImage()}
                    fallback={
                      <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%] left-[35%] top-[47%] opacity-0">
                        {translateText("grid/cover")} <br />
                      </span>
                    }>
                    <img
                      className="absolute inset-0 aspect-[2/3]"
                      src={convertFileSrc(dataEntryContext.locatedGridImage())}
                      alt=""
                    />
                    <span class="absolute tooltip group-hover:opacity-100 max-large:left-[30%] max-large:top-[45%]  left-[35%] top-[47%] opacity-0 ">
                      {translateText("grid/cover")} <br />
                    </span>
                  </Show>
                </>
              }>
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
              </Show>

              <span
                class={`absolute tooltip flex items-center gap-[5px] max-large:left-[25%] max-large:top-[45%] left-[35%] top-[47%] ${
                  showGridImageLoading() == false
                    ? "group-hover:opacity-100 opacity-0"
                    : ""
                }`}>
                <span className="opacity-50">
                  {dataEntryContext.foundGridImageIndex()} /{" "}
                  {dataEntryContext.foundGridImage().length - 1}
                </span>
                <Show
                  when={showGridImageLoading() == false}
                  fallback={
                    <div className="animate-spin-slow w-max h-max">
                      <Loading />
                    </div>
                  }>
                  {translateText("scroll")}
                </Show>
              </span>
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
              onKeyDown={(e) => {
                if (applicationStateContext.SGDBGames()) {
                  if (e.key === "ArrowRight") {
                    dataEntryContext.setFoundHeroImageIndex((i) =>
                      i == dataEntryContext.foundHeroImage().length - 1
                        ? 0
                        : i + 1,
                    );
                    setShowHeroImageLoading(true);
                  }

                  if (e.key === "ArrowLeft") {
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
                className="absolute inset-0 overflow-hidden"
                fallback={
                  <>
                    <Show
                      when={dataEntryContext.locatedHeroImage()}
                      className="absolute inset-0 overflow-hidden"
                      fallback={
                        <span class="absolute tooltip group-hover:opacity-100 left-[45%] top-[47%] opacity-0">
                          {translateText("hero")}
                        </span>
                      }>
                      <img
                        src={convertFileSrc(
                          dataEntryContext.locatedHeroImage(),
                        )}
                        alt=""
                        className="absolute inset-0 h-full rounded-[6px] aspect-[96/31]"
                      />
                      <img
                        src={convertFileSrc(
                          dataEntryContext.locatedHeroImage(),
                        )}
                        alt=""
                        className="absolute inset-0 -z-10 h-full rounded-[6px] blur-[80px] opacity-[0.4] aspect-[96/31]"
                      />
                      <span class="absolute tooltip group-hover:opacity-100 left-[45%] top-[47%] opacity-0">
                        {translateText("hero")}
                      </span>
                    </Show>
                  </>
                }>
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
                    className="absolute inset-0 h-full rounded-[6px] aspect-[96/31] "
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
                    className="absolute inset-0 -z-10 h-full aspect-[96/31] rounded-[6px] blur-[80px] opacity-[0.4] "
                  />
                </Show>

                <span
                  class={`absolute tooltip flex items-center gap-[5px] left-[42%] top-[45%] ${
                    showHeroImageLoading() == false
                      ? "group-hover:opacity-100 opacity-0"
                      : ""
                  }`}>
                  <span className="opacity-50">
                    {dataEntryContext.foundHeroImageIndex()} /{" "}
                    {dataEntryContext.foundHeroImage().length - 1}
                  </span>
                  <Show
                    when={showHeroImageLoading() == false}
                    fallback={
                      <div className="animate-spin-slow w-max h-max">
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
                        onClick={locateLogo}
                        onContextMenu={() => {
                          dataEntryContext.setLocatedLogo(undefined);
                          dataEntryContext.setFoundLogoImage(undefined);
                        }}
                        className="panelButton cursor-pointer bg-[#E8E8E8] dark:!bg-[#272727] group  absolute bottom-[70px] left-[20px] max-large:w-[243px] max-large:h-[90px] w-[250px] h-[90px] z-[100] "
                        aria-label="logo">
                        <span class="absolute tooltip group-hover:opacity-100 max-large:left-[38%] max-large:top-[32%] left-[40%] top-[35%] opacity-0">
                          {translateText("logo")}
                        </span>
                      </button>
                    }>
                    <button
                      onClick={locateLogo}
                      onContextMenu={() => {
                        dataEntryContext.setLocatedLogo(undefined);
                        dataEntryContext.setFoundLogoImage(undefined);
                      }}
                      className="bg-[#E8E8E800] dark:bg-[#27272700] group absolute bottom-[70px] left-[20px] panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
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
                </>
              }>
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
                onKeyDown={(e) => {
                  if (applicationStateContext.SGDBGames()) {
                    if (e.key === "ArrowRight") {
                      dataEntryContext.setFoundLogoImageIndex((i) =>
                        i == dataEntryContext.foundLogoImage().length - 1
                          ? 0
                          : i + 1,
                      );
                      setShowLogoImageLoading(true);
                    }

                    if (e.key === "ArrowLeft") {
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
                className="bg-[#E8E8E800] dark:bg-[#27272700] group  absolute bottom-[60px] left-[10px] panelButton cursor-pointer bg-[#f1f1f1] dark:bg-[#1c1c1c]"
                aria-label="logo">
                <img
                  src={
                    dataEntryContext.foundLogoImage()[
                      dataEntryContext.foundLogoImageIndex()
                    ]
                  }
                  alt=""
                  className={`relative max-large:w-[243px] max-large:h-[90px] w-[250px] h-[90px] !object-scale-down ${
                    showLogoImageLoading() ? "opacity-0" : ""
                  }`}
                  onLoad={() => {
                    setShowLogoImageLoading(false);
                  }}
                />

                <span
                  className={`flex gap-[5px] items-center absolute tooltip  max-large:left-[30%] max-large:top-[35%] left-[33%] top-[35%]  ${
                    showLogoImageLoading() == false
                      ? "group-hover:opacity-100 opacity-0"
                      : ""
                  }`}>
                  <span className="opacity-50">
                    {dataEntryContext.foundLogoImageIndex()} /{" "}
                    {dataEntryContext.foundLogoImage().length - 1}
                  </span>

                  <Show
                    when={showLogoImageLoading() == false}
                    fallback={
                      <div className="relative animate-spin-slow w-max h-max">
                        <Loading />
                      </div>
                    }>
                    <span>{translateText("scroll")} </span>
                  </Show>
                </span>
              </button>
            </Show>

            <div className="flex gap-3 items-center cursor-pointer ">
              <Show
                when={dataEntryContext.foundIconImage()}
                fallback={
                  <button
                    onClick={locateIcon}
                    onContextMenu={() => {
                      dataEntryContext.setLocatedIcon(undefined);
                      dataEntryContext.setFoundIconImage(undefined);
                    }}
                    className="relative !bg-[#27272700] group p-0"
                    aria-label="logo">
                    <Show
                      when={dataEntryContext.locatedIcon()}
                      fallback={
                        <div className="w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]" />
                      }>
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
                }>
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
                  onKeyDown={(e) => {
                    if (applicationStateContext.SGDBGames()) {
                      if (e.key === "ArrowRight") {
                        dataEntryContext.setFoundIconImageIndex((i) =>
                          i == dataEntryContext.foundIconImage().length - 1
                            ? 0
                            : i + 1,
                        );
                        setShowIconImageLoading(true);
                      }

                      if (e.key === "ArrowLeft") {
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
                  <Show
                    when={showIconImageLoading() == false}
                    fallback={
                      <div className="w-[40px] h-[40px] !bg-[#E8E8E8] dark:!bg-[#272727]">
                        <div className="animate-spin-slow absolute top-[30%] left-[32%]">
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
                      className="w-[40px] h-[40px]"
                    />
                  </Show>

                  <span
                    className={`absolute tooltip z-[10000] group-hover:opacity-100 left-[-55%] top-[120%] opacity-0 flex items-center gap-[5px] ${
                      showIconImageLoading() == false
                        ? "group-hover:opacity-100 opacity-0"
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
                  className="standardButton !text-black dark:!text-white  hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0 bg-[#f1f1f1] dark:!bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80]"
                  onClick={async () => {
                    if (
                      dataEntryContext.gameName() == "" ||
                      dataEntryContext.gameName() == undefined
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
                        globalContext.libraryData.userSettings.language ==
                          "fr" && applicationStateContext.windowWidth() >= 1500
                      }>
                      {translateText("auto find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ==
                          "fr" && applicationStateContext.windowWidth() <= 1500
                      }>
                      <p className="text-[10px] text-clip w-[70px]">
                        {translateText("auto find assets")}
                      </p>
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language != "fr"
                      }>
                      {translateText("auto find assets")}
                    </Match>
                  </Switch>
                </button>
                <button
                  className="standardButton  !text-black dark:!text-white  hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !mt-0 bg-[#f1f1f1] dark:bg-[#1c1c1c] py-1 px-3 !mr-2 cursor-pointer  text-[#ffffff80]"
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
                  <Switch>
                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ==
                          "fr" && applicationStateContext.windowWidth() >= 1500
                      }>
                      {translateText("find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language ==
                          "fr" && applicationStateContext.windowWidth() <= 1500
                      }>
                      <p className="text-[10px] text-clip w-[100px]">
                        {translateText("find assets")}
                      </p>
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language != "fr"
                      }>
                      {translateText("find assets")}
                    </Match>
                  </Switch>
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
          <Show
            when={
              applicationStateContext.SGDBGames() &&
              selectedDataContext.selectedGameId() == undefined
            }>
            <span className="opacity-80">
              {translateText("select the official name of your game")}
            </span>
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
