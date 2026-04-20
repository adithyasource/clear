import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { createEffect, createSignal, For, Match, onMount, Show, Switch, useContext } from "solid-js";
import { LoadingTextAndIcon } from "@/components/modal/Loading";
import { gameSearchResults } from "@/data/api/sgdbAssets.js";
import {
  ApplicationStateContext,
  getExecutableFileName,
  SelectedDataContext,
  triggerToast,
  UIContext,
} from "@/Globals.jsx";
import { ChevronArrow, Close, SaveDisk } from "@/libraries/Icons.jsx";
import {
  changeImageRemoteLocationIndex,
  fetchGameAssets,
  selectGameLocation,
  selectImageFileLocation,
} from "@/services/gameService.js";
import { libraryData } from "@/stores/libraryStore";
import { closeModal, modalShowCloseConfirm } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { selectedGame } from "../../stores/selectedGameStore";
import { clearContextMenuData, openContextMenu } from "../../stores/contextMenuStore";
import { updateGame } from "../../services/gameService";
import { openModal } from "../../stores/modalStore";
import { LoadingModal } from "./Loading";

export function EditGameModal() {
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const uiContext = useContext(UIContext);

  const originalGame = () => libraryData.games[selectedGame()];

  const [showGridImageLoading, setShowGridImageLoading] = createSignal(false);
  const [showHeroImageLoading, setShowHeroImageLoading] = createSignal(false);
  const [showLogoImageLoading, setShowLogoImageLoading] = createSignal(false);
  const [showIconImageLoading, setShowIconImageLoading] = createSignal(false);

  const [gameLocation, setGameLocation] = createSignal();

  const [gameName, setGameName] = createSignal();
  const [favourite, setFavourite] = createSignal();

  const [gridImage, setGridImage] = createSignal({ type: "local", data: undefined });
  const [heroImage, setHeroImage] = createSignal({ type: "local", data: undefined });
  const [logoImage, setLogoImage] = createSignal({ type: "local", data: undefined });
  const [iconImage, setIconImage] = createSignal({ type: "local", data: undefined });

  onMount(async () => {
    originalGame().name && setGameName(originalGame().name);
    originalGame().favourite && setFavourite(originalGame().favourite);
    originalGame().gameLocation && setGameLocation(originalGame().gameLocation);

    originalGame().gridImagePath &&
      setGridImage({
        type: "local",
        data: await getImagePath({ type: "grid", fileName: originalGame().gridImagePath }),
      });

    originalGame().heroImagePath &&
      setHeroImage({
        type: "local",
        data: await getImagePath({ type: "hero", fileName: originalGame().heroImagePath }),
      });

    originalGame().logoImagePath &&
      setLogoImage({
        type: "local",
        data: await getImagePath({ type: "logo", fileName: originalGame().logoImagePath }),
      });

    originalGame().iconImagePath &&
      setIconImage({
        type: "local",
        data: await getImagePath({ type: "icon", fileName: originalGame().iconImagePath }),
      });
  });

  const [searchResults, setSearchResults] = createSignal();

  const [fetchingAssetsLoading, setFetchingAssetsLoading] = createSignal(false);

  createEffect(() => {
    console.log("type:", logoImage().type);
    console.log("data:", logoImage().data);
  });

  async function searchGameName() {
    setSearchResults(undefined);

    try {
      const result = await gameSearchResults(gameName());

      setSearchResults(result);
    } catch (e) {
      triggerToast(e.message);
    }
  }

  async function handleContextMenu(e, type) {
    let originalImage;
    let currentImage;
    let setCurrentImage;

    switch (type) {
      case "grid":
        originalImage = originalGame().gridImagePath;
        currentImage = gridImage;
        setCurrentImage = setGridImage;
        break;

      case "hero":
        originalImage = originalGame().heroImagePath;
        currentImage = heroImage;
        setCurrentImage = setHeroImage;
        break;

      case "logo":
        originalImage = originalGame().logoImagePath;
        currentImage = logoImage;
        setCurrentImage = setLogoImage;
        break;

      case "icon":
        originalImage = originalGame().iconImagePath;
        currentImage = iconImage;
        setCurrentImage = setIconImage;
        break;
    }

    if (!originalImage && !currentImage().data) return;

    const currentImagePath = currentImage().data;

    let options = [];

    if (currentImagePath) {
      options.push({
        title: `remove ${type} image`,
        onClick: () => {
          setCurrentImage({ type: "local", data: undefined });
        },
      });
    }

    if (originalImage) {
      const originalImagePath = await getImagePath({ type: type, fileName: originalImage });

      if (currentImagePath !== originalImagePath || (!currentImagePath && originalImagePath)) {
        options.push({
          title: "revert to old image",
          onClick: () => {
            setCurrentImage({
              type: "local",
              data: originalImagePath,
            });

            clearContextMenuData();
          },
        });
      }
    }

    openContextMenu(e, options);
  }

  return (
    <div class="flex w-[84rem] flex-col items-center justify-center gap-3 max-large:w-[61rem]">
      <div class="flex w-full justify-between">
        <div>
          <p class="text-[#00000080] text-[25px] dark:text-[#ffffff80]">{translateText("add new game")}</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="cursor-pointer"
            onClick={() => {
              setFavourite((x) => !x);
            }}
          >
            <Show when={favourite()} fallback={<div class="!w-max">{translateText("favourite")}</div>}>
              <div class="relative">
                <div class="!w-max">{translateText("favourite")}</div>
                <div class="!w-max absolute inset-0 opacity-70 blur-[5px]">{translateText("favourite")}</div>
              </div>
            </Show>
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                openModal({
                  type: "loading",
                  component: LoadingModal,
                });

                await updateGame(selectedGame(), {
                  name: gameName(),
                  favourite: favourite(),
                  gameLocation: gameLocation(),
                  gridImage: gridImage(),
                  heroImage: heroImage(),
                  logoImage: logoImage(),
                  iconImage: iconImage(),
                });
              } catch (e) {
                triggerToast(`error: ${e.message}`);
              }

              closeModal(true);
            }}
            class="standardButton !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center gap-1 bg-[#E8E8E8] dark:bg-[#232323]"
          >
            <p class="!w-max">{translateText("save")}</p>

            <SaveDisk />
          </button>
          <button
            type="button"
            class="standardButton !w-max !h-full !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
            onClick={() => {
              closeModal();
            }}
            data-tooltip={translateText("close")}
          >
            {modalShowCloseConfirm() ? (
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
          onClick={() => {
            selectImageFileLocation(setGridImage);
          }}
          onScroll={() => {}}
          onWheel={(e) => {
            if (gridImage().type === "remote") {
              if (e.deltaY <= 0) {
                setShowGridImageLoading(true);
                changeImageRemoteLocationIndex({ setter: setGridImage, changeBy: 1 });
              }

              if (e.deltaY >= 0) {
                changeImageRemoteLocationIndex({ setter: setGridImage, changeBy: -1 });
              }
            }
          }}
          onKeyDown={(e) => {
            if (gridImage().type === "remote") {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                changeImageRemoteLocationIndex({ setter: setGridImage, changeBy: 1 });
                setShowGridImageLoading(true);
              }

              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                changeImageRemoteLocationIndex({ setter: setGridImage, changeBy: -1 });
              }
            }
          }}
          onContextMenu={async (e) => {
            await handleContextMenu(e, "grid");
          }}
          class="tooltip-center aspect-[2/3] h-[400px] cursor-pointer overflow-hidden bg-[#f1f1f1] p-0 max-large:h-[300px] dark:bg-[#1c1c1c]"
          data-tooltip={
            gridImage().type === "remote"
              ? showGridImageLoading() === false
                ? uiContext.userIsTabbing()
                  ? `${gridImage().index} / ${gridImage().data.length - 1} ${translateText("arrow keys")}`
                  : `${gridImage().index} / ${gridImage().data.length - 1} ${translateText("scroll")}`
                : `${gridImage().index} / ${gridImage().data.length - 1} ${translateText("loading")}`
              : translateText("grid/cover")
          }
        >
          <img
            src={
              gridImage().type === "remote"
                ? gridImage().data[gridImage().index]
                : gridImage().type === "local" && gridImage().data
                  ? convertFileSrc(gridImage().data)
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
              onClick={() => {
                selectImageFileLocation(setHeroImage);
              }}
              onScroll={() => {}}
              onWheel={(e) => {
                if (heroImage().type === "remote") {
                  if (e.deltaY <= 0) {
                    changeImageRemoteLocationIndex({ setter: setHeroImage, changeBy: 1 });
                    setShowHeroImageLoading(true);
                  }

                  if (e.deltaY >= 0) {
                    changeImageRemoteLocationIndex({ setter: setHeroImage, changeBy: -1 });
                  }
                }
              }}
              onKeyDown={(e) => {
                if (heroImage().type === "remote") {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    changeImageRemoteLocationIndex({ setter: setHeroImage, changeBy: 1 });
                    setShowHeroImageLoading(true);
                  }

                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    changeImageRemoteLocationIndex({ setter: setHeroImage, changeBy: -1 });
                  }
                }
              }}
              onContextMenu={async (e) => {
                await handleContextMenu(e, "hero");
              }}
              class="tooltip-center aspect-[67/26] h-[350px] cursor-pointer bg-[#f1f1f1] p-0 max-large:h-[250px] dark:bg-[#1c1c1c]"
              data-tooltip={
                heroImage().type === "remote"
                  ? showHeroImageLoading() === false
                    ? uiContext.userIsTabbing()
                      ? `${heroImage().index} / ${heroImage().data.length - 1} ${translateText("arrow keys")}`
                      : `${heroImage().index} / ${heroImage().data.length - 1} ${translateText("scroll")}`
                    : `${heroImage().index} / ${heroImage().data.length - 1} ${translateText("loading")}`
                  : translateText("hero")
              }
            >
              <img
                src={
                  heroImage().type === "remote"
                    ? heroImage().data[heroImage().index]
                    : heroImage().type === "local" && heroImage().data
                      ? convertFileSrc(heroImage().data)
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
                  heroImage().type === "remote"
                    ? heroImage().data[heroImage().index]
                    : heroImage().type === "local" && heroImage().data
                      ? convertFileSrc(heroImage().data)
                      : // this is a gif which is completely empty
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
                }
                onLoad={() => {
                  setShowHeroImageLoading(false);
                }}
                alt=""
                class="absolute inset-0 -z-10 aspect-[96/31] h-full w-full opacity-[0.4] blur-[80px]"
              />
            </button>

            {/* logo image card */}

            <button
              type="button"
              onClick={() => {
                selectImageFileLocation(setLogoImage);
              }}
              onContextMenu={async (e) => {
                await handleContextMenu(e, "logo");
              }}
              onScroll={() => {}}
              onWheel={(e) => {
                if (logoImage().type === "remote")
                  if (e.deltaY <= 0) {
                    changeImageRemoteLocationIndex({ setter: setLogoImage, changeBy: 1 });
                    setShowLogoImageLoading(true);
                  }

                if (e.deltaY >= 0) {
                  changeImageRemoteLocationIndex({ setter: setLogoImage, changeBy: -1 });
                }
              }}
              onKeyDown={(e) => {
                if (logoImage().type === "remote") {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    changeImageRemoteLocationIndex({ setter: setLogoImage, changeBy: 1 });
                    setShowLogoImageLoading(true);
                  }

                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    changeImageRemoteLocationIndex({ setter: setLogoImage, changeBy: -1 });
                  }
                }
              }}
              class={`!absolute !p-[2px] tooltip-center bottom-[70px] left-[20px] z-[100] h-[90px] w-[250px] cursor-pointer max-large:h-[90px] max-large:w-[243px] ${
                logoImage().data
                  ? "!outline-[2px] !outline-[#E8E8E880] hover:bg-[#E8E8E84D] hover:outline-dashed focus:bg-[#E8E8E84D] !outline:dark:bg-[#27272780] focus:dark:bg-[#2727274D] hover:dark:bg-[#2727274D]"
                  : "dark:!bg-[#272727] bg-[#E8E8E8]"
              } `}
              data-tooltip={
                logoImage().type === "remote"
                  ? showLogoImageLoading() === false
                    ? uiContext.userIsTabbing()
                      ? `${logoImage().index} / ${logoImage().data.length - 1} ${translateText("arrow keys")}`
                      : `${logoImage().index} / ${logoImage().data.length - 1} ${translateText("scroll")}`
                    : `${logoImage().index} / ${logoImage().data.length - 1} ${translateText("loading")}`
                  : translateText("logo")
              }
            >
              <img
                src={
                  logoImage().type === "remote"
                    ? logoImage().data[logoImage().index]
                    : logoImage().type === "local" && logoImage().data
                      ? convertFileSrc(logoImage().data)
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

          <div class="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              onClick={() => {
                selectImageFileLocation(setIconImage);
              }}
              onContextMenu={async (e) => {
                await handleContextMenu(e, "icon");
              }}
              onScroll={() => {}}
              onWheel={(e) => {
                if (iconImage().type === "remote") {
                  if (e.deltaY <= 0) {
                    changeImageRemoteLocationIndex({ setter: setIconImage, changeBy: 1 });
                    setShowIconImageLoading(true);
                  }

                  if (e.deltaY >= 0) {
                    changeImageRemoteLocationIndex({ setter: setIconImage, changeBy: -1 });
                  }
                }
              }}
              onKeyDown={(e) => {
                if (iconImage().type === "remote") {
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    changeImageRemoteLocationIndex({ setter: setIconImage, changeBy: 1 });
                    setShowIconImageLoading(true);
                  }

                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    changeImageRemoteLocationIndex({ setter: setIconImage, changeBy: -1 });
                  }
                }
              }}
              class={`group tooltip-bottom relative p-0 ${
                iconImage().data
                  ? "!outline-[2px] !outline-[#E8E8E880] hover:outline-dashed !outline:dark:bg-[#27272780]"
                  : "dark:!bg-[#272727] bg-[#E8E8E8]"
              }`}
              data-tooltip={
                iconImage().type === "remote"
                  ? showIconImageLoading() === false
                    ? uiContext.userIsTabbing()
                      ? `${iconImage().index} / ${iconImage().data.length - 1} ${translateText("arrow keys")}`
                      : `${iconImage().index} / ${iconImage().data.length - 1} ${translateText("scroll")}`
                    : `${iconImage().index} / ${iconImage().data.length - 1} ${translateText("loading")}`
                  : translateText("icon")
              }
            >
              <img
                src={
                  iconImage().type === "remote"
                    ? iconImage().data[iconImage().index]
                    : iconImage().type === "local" && iconImage().data
                      ? convertFileSrc(iconImage().data)
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
                  if (!gameName()) {
                    triggerToast(translateText("no game name"));
                    return;
                  }

                  searchGameName();
                  selectedDataContext.setSelectedGameId(undefined);
                  setSearchResults(undefined);
                }}
              >
                <Show when={!fetchingAssetsLoading()} fallback={LoadingTextAndIcon()}>
                  <Switch>
                    <Match
                      when={libraryData.userSettings.language === "fr" && applicationStateContext.windowWidth() >= 1500}
                    >
                      {translateText("auto find assets")}
                    </Match>

                    <Match
                      when={libraryData.userSettings.language === "fr" && applicationStateContext.windowWidth() <= 1500}
                    >
                      <p class="w-[70px] text-clip text-[10px]">{translateText("auto find assets")}</p>
                    </Match>

                    <Match when={libraryData.userSettings.language !== "fr"}>{translateText("auto find assets")}</Match>
                  </Switch>
                </Show>
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
                    when={libraryData.userSettings.language === "fr" && applicationStateContext.windowWidth() >= 1500}
                  >
                    {translateText("find assets")}
                  </Match>

                  <Match
                    when={libraryData.userSettings.language === "fr" && applicationStateContext.windowWidth() <= 1500}
                  >
                    <p class="w-[100px] text-clip text-[10px]">{translateText("find assets")}</p>
                  </Match>

                  <Match when={libraryData.userSettings.language !== "fr"}>{translateText("find assets")}</Match>
                </Switch>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                selectGameLocation(setGameLocation);
              }}
              onContextMenu={() => {
                setGameLocation(undefined);
              }}
              class="standardButton !mt-0 !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] bg-[#E8E8E8] dark:bg-[#232323]"
            >
              {gameLocation() === undefined ? translateText("locate game") : getExecutableFileName(gameLocation())}
            </button>
          </div>
        </div>
      </div>

      <div class="flex w-[84rem] justify-between max-large:w-[61rem]">
        <span class="opacity-50">{translateText("right click to undo / empty image selection")}</span>
        <Show when={searchResults() && selectedDataContext.selectedGameId() === undefined}>
          <span class="opacity-80">{translateText("select the official name of your game")}</span>
        </Show>
      </div>

      <Show when={searchResults()}>
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
              <For each={searchResults()}>
                {(foundGame) => {
                  return (
                    <button
                      type="button"
                      class="flex-shrink-0"
                      onClick={async () => {
                        setSearchResults(undefined);

                        setFetchingAssetsLoading(true);
                        await fetchGameAssets({
                          gameId: foundGame.id,
                          setters: {
                            grid: setGridImage,
                            hero: setHeroImage,
                            logo: setLogoImage,
                            icon: setIconImage,
                          },
                        });
                        setFetchingAssetsLoading(false);
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
  );
}
