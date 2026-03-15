// importing globals
import {
  ApplicationStateContext,
  GlobalContext,
  SelectedDataContext,
  UIContext,
  closeDialog,
  closeDialogImmediately,
  generateRandomString,
  getExecutableFileName,
  locationJoin,
  openDialog,
  translateText,
  triggerToast,
  updateData,
} from "../Globals.jsx";

import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, copyFile } from "@tauri-apps/plugin-fs";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
// importing code snippets and library functions
import { For, Match, Show, Switch, createSignal, onMount, useContext } from "solid-js";
import { produce } from "solid-js/store";

// importing style related files
import { ChevronArrow, Close, SaveDisk } from "../libraries/Icons.jsx";

export function NewGame() {
  const globalContext = useContext(GlobalContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const uiContext = useContext(UIContext);

  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLoading, setShowIconImageLoading] = createSignal(false);

  const [showCloseConfirm, setShowCloseConfirm] = createSignal(false);

  const [gameName, setGameName] = createSignal("");
  const [favouriteGame, setFavouriteGame] = createSignal(false);
  const [locatedGridImage, setLocatedGridImage] = createSignal();
  const [locatedHeroImage, setLocatedHeroImage] = createSignal();
  const [locatedLogo, setLocatedLogo] = createSignal();
  const [locatedIcon, setLocatedIcon] = createSignal();
  const [locatedGame, setlocatedGame] = createSignal();
  const [foundGridImage, setFoundGridImage] = createSignal(false);
  const [foundHeroImage, setFoundHeroImage] = createSignal(false);
  const [foundLogoImage, setFoundLogoImage] = createSignal(false);
  const [foundIconImage, setFoundIconImage] = createSignal(false);
  const [foundGridImageIndex, setFoundGridImageIndex] = createSignal(0);
  const [foundHeroImageIndex, setFoundHeroImageIndex] = createSignal(0);
  const [foundLogoImageIndex, setFoundLogoImageIndex] = createSignal(0);
  const [foundIconImageIndex, setFoundIconImageIndex] = createSignal(0);

  const [SGDBGames, setSGDBGames] = createSignal();

  async function addGame() {
    if (gameName() === "" || gameName() === undefined) {
      triggerToast(translateText("no game name"));
      return;
    }

    let gameNameAlreadyExists = false;

    for (const name of Object.keys(globalContext.libraryData.games)) {
      if (gameName() === name) {
        gameNameAlreadyExists = true;
      }
    }

    if (gameNameAlreadyExists) {
      triggerToast(`${gameName()} ${translateText("is already in your library")}`);
      return;
    }

    let heroImageFileName;
    let gridImageFileName;
    let logoFileName;
    let iconFileName;

    openDialog("loading");

    if (foundGridImage()) {
      gridImageFileName = `${generateRandomString()}.png`;
      await invoke("download_image", {
        link: foundGridImage()[foundGridImageIndex()],
        location: locationJoin([applicationStateContext.appDataDirPath(), "grids", gridImageFileName]),
      });
    } else {
      if (locatedGridImage()) {
        gridImageFileName = `${generateRandomString()}.${locatedGridImage().split(".")[locatedGridImage().split(".").length - 1]
          }`;

        await copyFile(locatedGridImage(), locationJoin(["grids", gridImageFileName]), {
          baseDir: BaseDirectory.AppData,
        });
      }
    }

    if (foundHeroImage()) {
      heroImageFileName = `${generateRandomString()}.png`;

      await invoke("download_image", {
        link: foundHeroImage()[foundHeroImageIndex()],
        location: locationJoin([applicationStateContext.appDataDirPath(), "heroes", heroImageFileName]),
      });
    } else {
      if (locatedHeroImage()) {
        heroImageFileName = `${generateRandomString()}.${locatedHeroImage().split(".")[locatedHeroImage().split(".").length - 1]
          }`;

        await copyFile(locatedHeroImage(), locationJoin(["heroes", heroImageFileName]), {
          baseDir: BaseDirectory.AppData,
        });
      }
    }

    if (foundLogoImage()) {
      logoFileName = `${generateRandomString()}.png`;

      await invoke("download_image", {
        link: foundLogoImage()[foundLogoImageIndex()],
        location: locationJoin([applicationStateContext.appDataDirPath(), "logos", logoFileName]),
      });
    } else {
      if (locatedLogo()) {
        logoFileName = `${generateRandomString()}.${locatedLogo().split(".")[locatedLogo().split(".").length - 1]}`;

        await copyFile(locatedLogo(), locationJoin(["logos", logoFileName]), {
          baseDir: BaseDirectory.AppData,
        });
      }
    }

    if (foundIconImage()) {
      iconFileName = `${generateRandomString()}.png`;

      await invoke("download_image", {
        link: foundIconImage()[foundIconImageIndex()],
        location: locationJoin([applicationStateContext.appDataDirPath(), "icons", iconFileName]),
      });
    } else {
      if (locatedIcon()) {
        iconFileName = `${generateRandomString()}.${locatedIcon().split(".")[locatedIcon().split(".").length - 1]}`;

        await copyFile(locatedIcon(), locationJoin(["icons", iconFileName]), {
          baseDir: BaseDirectory.AppData,
        });
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.games[gameName()] = {
          location: locatedGame(),
          name: gameName(),
          heroImage: heroImageFileName,
          gridImage: gridImageFileName,
          logo: logoFileName,
          icon: iconFileName,
          favourite: favouriteGame(),
        };

        return data;
      }),
    );

    await updateData();

    closeDialog("loading");
    closeDialog("newGame");

    setTimeout(() => {
      // scrolling to the bottom where uncategorized games are
      const sideBarFolders = document.getElementById("sideBarFolders");
      sideBarFolders.scrollTop = sideBarFolders.scrollHeight;
    }, 100);
  }

  async function locateGame() {
    setlocatedGame(
      await open({
        multiple: false,
        filters: [
          {
            name: "Executable",
            extensions: ["exe", "lnk", "url", "app"],
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

    let searchedGameData;

    try {
      searchedGameData = await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?gameName=${gameName()}`);
    } catch {
      searchedGameData = undefined;
    }

    if (searchedGameData) {
      searchedGameData = await searchedGameData.json();

      if (searchedGameData.data.length === 0) {
        triggerToast(translateText("couldn't find that game :("));
      } else {
        setSGDBGames(searchedGameData.data);
      }
    } else {
      triggerToast(translateText("you're not connected to the internet :("));
    }
  }

  async function getGameAssets() {
    setFoundGridImage(undefined);
    setFoundHeroImage(undefined);
    setFoundLogoImage(undefined);
    setFoundIconImage(undefined);

    await fetch(`${import.meta.env.VITE_CLEAR_API_URL}/?assets=${selectedDataContext.selectedGameId()}`).then((res) =>
      res.json().then((jsonres) => {
        const missingAssets = [];

        jsonres.grids.length !== 0 ? setFoundGridImage(jsonres.grids) : missingAssets.push("grids");
        jsonres.heroes.length !== 0 ? setFoundHeroImage(jsonres.heroes) : missingAssets.push("heroes");
        jsonres.logos.length !== 0 ? setFoundLogoImage(jsonres.logos) : missingAssets.push("logos");
        jsonres.icons.length !== 0 ? setFoundIconImage(jsonres.icons) : missingAssets.push("icons");

        if (missingAssets.length !== 0) {
          if (missingAssets.length === 4) {
            triggerToast(translateText("couldn't find any assets :("));
            return;
          }

          if (missingAssets.length >= 2) {
            const lastAssetType = missingAssets.splice(-1);
            triggerToast(`${translateText("couldn't find")} ${missingAssets.join(", ")} & ${lastAssetType} :(`);
            return;
          }

          triggerToast(`${translateText("couldn't find")} ${missingAssets[0]} :(`);
        }
      }),
    );
  }

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showCloseConfirm()) {
          closeDialogImmediately(document.querySelector("[data-modal='newGame']"));

          setShowCloseConfirm(false);
        } else {
          setShowCloseConfirm(true);

          const closeConfirmTimer = setTimeout(() => {
            clearTimeout(closeConfirmTimer);

            setShowCloseConfirm(false);
          }, 1500);
        }
      }
    });
  });

  return (
    <dialog
      data-modal="newGame"
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        uiContext.setShowNewGameModal(false);
      }}
      class="!p-0 overflow-visible backdrop:bg-transparent"
    >
      <div class="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-[#d1d1d1cc] dark:bg-[#121212cc]">
        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <div>
            <p class="text-[#00000080] text-[25px] dark:text-[#ffffff80]">{translateText("add new game")}</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="cursor-pointer"
              onClick={() => {
                setFavouriteGame((x) => !x);
              }}
            >
              <Show when={favouriteGame()} fallback={<div class="!w-max">{translateText("favourite")}</div>}>
                <div class="relative">
                  <div class="!w-max">{translateText("favourite")}</div>
                  <div class="!w-max absolute inset-0 opacity-70 blur-[5px]">{translateText("favourite")}</div>
                </div>
              </Show>
            </button>
            <button
              type="button"
              onClick={addGame}
              class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center gap-1 bg-[#E8E8E8] dark:bg-[#232323] "
            >
              <p class="!w-max">{translateText("save")}</p>

              <SaveDisk />
            </button>
            <button
              type="button"
              class="standardButton !w-max !h-full !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
              onClick={() => {
                if (showCloseConfirm()) {
                  closeDialog("newGame");
                } else {
                  setShowCloseConfirm(true);
                }
                setTimeout(() => {
                  setShowCloseConfirm(false);
                }, 1500);
              }}
              data-tooltip={translateText("close")}
            >
              {showCloseConfirm() ? (
                <span class="whitespace-nowrap text-[#FF3636]">{translateText("hit again to confirm")}</span>
              ) : (
                <Close />
              )}
            </button>
          </div>
        </div>

        <div class="flex gap-[1rem]">
          {/* grid image card */}

          <button
            type="button"
            onClick={locateGridImage}
            onScroll={() => { }}
            onWheel={(e) => {
              if (SGDBGames()) {
                if (e.deltaY <= 0) {
                  setFoundGridImageIndex((i) => (i === foundGridImage().length - 1 ? 0 : i + 1));
                  setShowGridImageLoading(true);
                }

                if (e.deltaY >= 0) {
                  if (foundGridImageIndex() !== 0) {
                    setFoundGridImageIndex((i) => i - 1);
                    setShowGridImageLoading(true);
                  } else {
                    setShowGridImageLoading(false);
                  }
                }
              }
            }}
            onKeyDown={(e) => {
              if (SGDBGames()) {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  setFoundGridImageIndex((i) => (i === foundGridImage().length - 1 ? 0 : i + 1));
                  setShowGridImageLoading(true);
                }

                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  if (foundGridImageIndex() !== 0) {
                    setFoundGridImageIndex((i) => i - 1);
                    setShowGridImageLoading(true);
                  } else {
                    setShowGridImageLoading(false);
                  }
                }
              }
            }}
            onContextMenu={() => {
              setLocatedGridImage(undefined);
              setFoundGridImage(undefined);
            }}
            class="tooltip-center aspect-[2/3] h-[400px] cursor-pointer overflow-hidden bg-[#f1f1f1] p-0 max-large:h-[300px] dark:bg-[#1c1c1c]"
            data-tooltip={
              foundGridImage()
                ? showGridImageLoading() === false
                  ? uiContext.userIsTabbing()
                    ? `${foundGridImageIndex()} / ${foundGridImage().length - 1} ${translateText("arrow keys")}`
                    : `${foundGridImageIndex()} / ${foundGridImage().length - 1} ${translateText("scroll")}`
                  : `${foundGridImageIndex()} / ${foundGridImage().length - 1} ${translateText("loading")}`
                : translateText("grid/cover")
            }
          >
            <img
              src={
                foundGridImage()
                  ? foundGridImage()[foundGridImageIndex()]
                  : locatedGridImage()
                    ? convertFileSrc(locatedGridImage())
                    : // this is a gif which is completely empty
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
              }
              alt=""
              class={`relative inset-0 w-full ${showGridImageLoading() ? "opacity-0" : ""}  `}
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
                onScroll={() => { }}
                onWheel={(e) => {
                  if (SGDBGames()) {
                    if (e.deltaY <= 0) {
                      setFoundHeroImageIndex((i) => (i === foundHeroImage().length - 1 ? 0 : i + 1));
                      setShowHeroImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (foundHeroImageIndex() !== 0) {
                        setFoundHeroImageIndex((i) => i - 1);
                        setShowHeroImageLoading(true);
                      } else {
                        setShowHeroImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (SGDBGames()) {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      setFoundHeroImageIndex((i) => (i === foundHeroImage().length - 1 ? 0 : i + 1));
                      setShowHeroImageLoading(true);
                    }

                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      if (foundHeroImageIndex() !== 0) {
                        setFoundHeroImageIndex((i) => i - 1);
                        setShowHeroImageLoading(true);
                      } else {
                        setShowHeroImageLoading(false);
                      }
                    }
                  }
                }}
                onContextMenu={() => {
                  setLocatedHeroImage(undefined);
                  setFoundHeroImage(undefined);
                }}
                class="tooltip-center aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 max-large:h-[250px] dark:bg-[#1c1c1c]"
                data-tooltip={
                  foundHeroImage()
                    ? showHeroImageLoading() === false
                      ? uiContext.userIsTabbing()
                        ? `${foundHeroImageIndex()} / ${foundHeroImage().length - 1} ${translateText("arrow keys")}`
                        : `${foundHeroImageIndex()} / ${foundHeroImage().length - 1} ${translateText("scroll")}`
                      : `${foundHeroImageIndex()} / ${foundHeroImage().length - 1} ${translateText("loading")}`
                    : translateText("hero")
                }
              >
                <img
                  src={
                    foundHeroImage()
                      ? foundHeroImage()[foundHeroImageIndex()]
                      : locatedHeroImage()
                        ? convertFileSrc(locatedHeroImage())
                        : // this is a gif which is completely empty
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
                  }
                  alt=""
                  class={`aspect-[96/31] h-full w-full ${showHeroImageLoading() ? "opacity-0" : ""}`}
                  onLoad={() => {
                    setShowHeroImageLoading(false);
                  }}
                />
                <img
                  src={
                    foundHeroImage()
                      ? foundHeroImage()[foundHeroImageIndex()]
                      : locatedHeroImage()
                        ? convertFileSrc(locatedHeroImage())
                        : // this is a gif which is completely empty
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
                  }
                  onLoad={() => {
                    setShowHeroImageLoading(false);
                  }}
                  alt=""
                  class="-z-10 absolute inset-0 aspect-[96/31] h-full w-full opacity-[0.4] blur-[80px]"
                />
              </button>

              {/* logo image card */}

              <button
                type="button"
                onClick={locateLogo}
                onContextMenu={() => {
                  setLocatedLogo(undefined);
                  setFoundLogoImage(undefined);
                }}
                onScroll={() => { }}
                onWheel={(e) => {
                  if (SGDBGames()) {
                    if (e.deltaY <= 0) {
                      setFoundLogoImageIndex((i) => (i === foundLogoImage().length - 1 ? 0 : i + 1));
                      setShowLogoImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (foundLogoImageIndex() !== 0) {
                        setFoundLogoImageIndex((i) => i - 1);
                        setShowLogoImageLoading(true);
                      } else {
                        setShowLogoImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (SGDBGames()) {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      setFoundLogoImageIndex((i) => (i === foundLogoImage().length - 1 ? 0 : i + 1));
                      setShowLogoImageLoading(true);
                    }

                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      if (foundLogoImageIndex() !== 0) {
                        setFoundLogoImageIndex((i) => i - 1);
                        setShowLogoImageLoading(true);
                      } else {
                        setShowLogoImageLoading(false);
                      }
                    }
                  }
                }}
                class={`!absolute !p-[2px] tooltip-center bottom-[70px] left-[20px] z-[100] h-[90px] w-[250px] cursor-pointer max-large:h-[90px] max-large:w-[243px] ${foundLogoImage() || locatedLogo()
                  ? "!outline-[2px] !outline-[#E8E8E880] hover:bg-[#E8E8E84D] hover:outline-dashed focus:bg-[#E8E8E84D] !outline:dark:bg-[#27272780] focus:dark:bg-[#2727274D] hover:dark:bg-[#2727274D]"
                  : "dark:!bg-[#272727] bg-[#E8E8E8]"
                  }
                    `}
                data-tooltip={
                  foundLogoImage()
                    ? showLogoImageLoading() === false
                      ? uiContext.userIsTabbing()
                        ? `${foundLogoImageIndex()} / ${foundLogoImage().length - 1} ${translateText("arrow keys")}`
                        : `${foundLogoImageIndex()} / ${foundLogoImage().length - 1} ${translateText("scroll")}`
                      : `${foundLogoImageIndex()} / ${foundLogoImage().length - 1} ${translateText("loading")}`
                    : translateText("logo")
                }
              >
                <img
                  src={
                    foundLogoImage()
                      ? foundLogoImage()[foundLogoImageIndex()]
                      : locatedLogo()
                        ? convertFileSrc(locatedLogo())
                        : // this is a gif which is completely empty
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
                  }
                  alt=""
                  class={`!object-scale-down h-full w-full ${showLogoImageLoading() ? "opacity-0" : ""}`}
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
                  setLocatedIcon(undefined);
                  setFoundIconImage(undefined);
                }}
                onScroll={() => { }}
                onWheel={(e) => {
                  if (SGDBGames()) {
                    if (e.deltaY <= 0) {
                      setFoundIconImageIndex((i) => (i === foundIconImage().length - 1 ? 0 : i + 1));
                      setShowIconImageLoading(true);
                    }

                    if (e.deltaY >= 0) {
                      if (foundIconImageIndex() !== 0) {
                        setFoundIconImageIndex((i) => i - 1);
                        setShowIconImageLoading(true);
                      } else {
                        setShowIconImageLoading(false);
                      }
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (SGDBGames()) {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      setFoundIconImageIndex((i) => (i === foundIconImage().length - 1 ? 0 : i + 1));
                      setShowIconImageLoading(true);
                    }

                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      if (foundIconImageIndex() !== 0) {
                        setFoundIconImageIndex((i) => i - 1);
                        setShowIconImageLoading(true);
                      } else {
                        setShowIconImageLoading(false);
                      }
                    }
                  }
                }}
                class={`group tooltip-bottom relative p-0 ${foundIconImage() || locatedIcon()
                  ? "!outline-[2px] !outline-[#E8E8E880] hover:outline-dashed !outline:dark:bg-[#27272780]"
                  : "dark:!bg-[#272727] bg-[#E8E8E8]"
                  }`}
                data-tooltip={
                  foundIconImage()
                    ? showIconImageLoading() === false
                      ? uiContext.userIsTabbing()
                        ? `${foundIconImageIndex()} / ${foundIconImage().length - 1} ${translateText("arrow keys")}`
                        : `${foundIconImageIndex()} / ${foundIconImage().length - 1} ${translateText("scroll")}`
                      : `${foundIconImageIndex()} / ${foundIconImage().length - 1} ${translateText("loading")}`
                    : translateText("icon")
                }
              >
                <img
                  src={
                    foundIconImage()
                      ? foundIconImage()[foundIconImageIndex()]
                      : locatedIcon()
                        ? convertFileSrc(locatedIcon())
                        : // this is a gif which is completely empty
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
                  }
                  alt=""
                  class={`!object-scale-down h-[40px] w-[40px] ${showIconImageLoading() ? "opacity-0" : ""}`}
                  onLoad={() => {
                    setShowIconImageLoading(false);
                  }}
                />
              </button>

              <div
                class="gameInput flex items-center bg-[#E8E8E8cc] backdrop-blur-[10px] dark:bg-[#272727cc]"
                style={{ "flex-grow": "1" }}
              >
                <input
                  aria-autocomplete="none"
                  type="text"
                  name=""
                  style={{ "flex-grow": "1" }}
                  id=""
                  onInput={(e) => {
                    setGameName(e.currentTarget.value);
                  }}
                  value={gameName()}
                  class="!bg-transparent"
                  placeholder={translateText("name of game")}
                />
                <button
                  type="button"
                  class="standardButton !mr-2 !mt-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!bg-[#1c1c1c] dark:!text-white dark:hover:!bg-[#2b2b2b] cursor-pointer bg-[#f1f1f1] px-3 py-1 text-[#ffffff80]"
                  onClick={() => {
                    if (gameName() === "" || gameName() === undefined) {
                      triggerToast(translateText("no game name"));
                      return;
                    }

                    searchGameName();
                    selectedDataContext.setSelectedGameId(undefined);
                    setSGDBGames(undefined);
                    setFoundGridImage(undefined);
                    setFoundHeroImage(undefined);
                    setFoundLogoImage(undefined);
                    setFoundIconImage(undefined);
                  }}
                >
                  <Switch>
                    <Match
                      when={
                        globalContext.libraryData.userSettings.language === "fr" &&
                        applicationStateContext.windowWidth() >= 1500
                      }
                    >
                      {translateText("auto find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language === "fr" &&
                        applicationStateContext.windowWidth() <= 1500
                      }
                    >
                      <p class="w-[70px] text-clip text-[10px]">{translateText("auto find assets")}</p>
                    </Match>

                    <Match when={globalContext.libraryData.userSettings.language !== "fr"}>
                      {translateText("auto find assets")}
                    </Match>
                  </Switch>
                </button>
                <button
                  type="button"
                  class="standardButton !mr-2 !mt-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] cursor-pointer bg-[#f1f1f1] px-3 py-1 text-[#ffffff80] dark:bg-[#1c1c1c]"
                  onClick={() => {
                    gameName() === undefined
                      ? invoke("open_location", {
                        location: "https://www.steamgriddb.com/",
                      })
                      : gameName() === ""
                        ? invoke("open_location", {
                          location: "https://www.steamgriddb.com/",
                        })
                        : invoke("open_location", {
                          location: `https://www.steamgriddb.com/search/grids?term=${gameName()}`,
                        });
                  }}
                >
                  <Switch>
                    <Match
                      when={
                        globalContext.libraryData.userSettings.language === "fr" &&
                        applicationStateContext.windowWidth() >= 1500
                      }
                    >
                      {translateText("find assets")}
                    </Match>

                    <Match
                      when={
                        globalContext.libraryData.userSettings.language === "fr" &&
                        applicationStateContext.windowWidth() <= 1500
                      }
                    >
                      <p class="w-[100px] text-clip text-[10px]">{translateText("find assets")}</p>
                    </Match>

                    <Match when={globalContext.libraryData.userSettings.language !== "fr"}>
                      {translateText("find assets")}
                    </Match>
                  </Switch>
                </button>
              </div>

              <button
                type="button"
                onClick={locateGame}
                onContextMenu={() => {
                  setlocatedGame(undefined);
                }}
                class="standardButton !mt-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] bg-[#E8E8E8] dark:bg-[#232323]"
              >
                {locatedGame() === undefined ? translateText("locate game") : getExecutableFileName(locatedGame())}
              </button>
            </div>
          </div>
        </div>

        <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
          <span class="opacity-50">{translateText("right click to empty image selection")}</span>
          <Show when={SGDBGames() && selectedDataContext.selectedGameId() === undefined}>
            <span class="opacity-80">{translateText("select the official name of your game")}</span>
          </Show>
        </div>

        <Show when={SGDBGames()}>
          <Show when={selectedDataContext.selectedGameId() === undefined}>
            <div class="gameInput flex w-[84rem] bg-[#E8E8E8cc] backdrop-blur-[10px] max-large:w-[61rem] dark:bg-[#272727cc]">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("SGDBGamesContainer").scrollLeft -= 40;
                }}
                class="tooltip-delayed-bottom"
                data-tooltip={translateText("scroll left")}
              >
                <ChevronArrow />
              </button>
              <div id="SGDBGamesContainer" class="SGDBGamesContainer flex gap-[5px] overflow-x-auto scroll-smooth">
                <For each={SGDBGames()}>
                  {(foundGame) => {
                    return (
                      <button
                        type="button"
                        class="flex-shrink-0"
                        onClick={() => {
                          selectedDataContext.setSelectedGameId(undefined);
                          selectedDataContext.setSelectedGameId(foundGame.id);
                          getGameAssets();
                        }}
                      >
                        {foundGame.name}
                      </button>
                    );
                  }}
                </For>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("SGDBGamesContainer").scrollLeft += 40;
                }}
                class="tooltip-delayed-bottom"
                data-tooltip={translateText("scroll right")}
              >
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
