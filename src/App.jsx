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

import { Styles } from "./Styles";

function App() {
  const [borderRadius, setBorderRadius] = createSignal("6px");
  const [secondaryColor, setSecondaryColor] = createSignal("#1c1c1c");
  const [secondaryColorForBlur, setSecondaryColorForBlur] =
    createSignal("#272727cc");
  const [primaryColor, setPrimaryColor] = createSignal("#121212");
  const [modalBackground, setModalBackground] = createSignal("#12121266");
  const [locatingLogoBackground, setLocatingLogoBackground] =
    createSignal("#272727");

  const [locatedGame, setlocatedGame] = createSignal();
  const [locatedHeroImage, setLocatedHeroImage] = createSignal();
  const [locatedGridImage, setLocatedGridImage] = createSignal();
  const [locatedLogo, setLocatedLogo] = createSignal();
  const [gameName, setGameName] = createSignal();
  const [folderName, setFolderName] = createSignal();
  const [editedFolderName, setEditedFolderName] = createSignal("");
  const [editedHideFolder, setEditedHideFolder] = createSignal(false);
  const [hideFolder, setHideFolder] = createSignal(false);
  const [libraryData, setLibraryData] = createSignal({});
  const [selectedGame, setSelectedGame] = createSignal({});
  const [appDataDirPath, setAppDataDirPath] = createSignal({});
  const [showSideBar, setShowSideBar] = createSignal(true);
  const [selectedFolder, setSelectedFolder] = createSignal([]);
  const [currentGames, setCurrentGames] = createSignal([]);
  const [currentFolders, setCurrentFolders] = createSignal([]);
  const [permissionGranted, setPermissionGranted] = createSignal(
    isPermissionGranted()
  );

  let showFolderName = false;

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
      for (let i = 0; i < document.querySelectorAll(".draggable").length; i++) {
        document.querySelectorAll(".draggable")[i].style.cursor = "pointer";
      }

      for (
        let i = 0;
        i < document.querySelectorAll(".folderGames").length;
        i++
      ) {
        document
          .querySelectorAll(".folderGames")
          [i].classList.add(
            "hint--right",
            "hint--no-animate",
            "hint--rounded",
            "hint--no-arrow"
          );
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document
          .querySelectorAll(".gameCard")
          [i].classList.add(
            "hint--center",
            "hint--no-animate",
            "hint--rounded",
            "hint--no-arrow"
          );
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    for (let i = 0; i < document.querySelectorAll(".draggable").length; i++) {
      document.querySelectorAll(".draggable")[i].style.cursor = "grab";
    }

    for (let i = 0; i < document.querySelectorAll(".folderGames").length; i++) {
      document
        .querySelectorAll(".folderGames")
        [i].classList.remove(
          "hint--right",
          "hint--no-animate",
          "hint--rounded",
          "hint--no-arrow"
        );
    }

    for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
      document
        .querySelectorAll(".gameCard")
        [i].classList.remove(
          "hint--center",
          "hint--no-animate",
          "hint--rounded",
          "hint--no-arrow"
        );
    }
  });

  async function getData() {
    setAppDataDirPath(await appDataDir());

    if (await exists("data/lib.json", { dir: BaseDirectory.AppData })) {
      let getLibraryData = await readTextFile("data/lib.json", {
        dir: BaseDirectory.AppData,
      });

      if (getLibraryData != "") {
        setLibraryData({});
        setLibraryData(JSON.parse(getLibraryData));
        setCurrentGames(Object.keys(libraryData().games));
        setCurrentFolders(Object.keys(libraryData().folders));
        console.log("data gotten");
      } else return;
    } else {
      await createDir("data", {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      await writeTextFile(
        {
          path: "data/lib.json",
          contents: "",
        },
        {
          dir: BaseDirectory.AppData,
        }
      );
    }
  }

  onMount(async () => {
    if (!permissionGranted()) {
      const permission = await requestPermission();
      setPermissionGranted(permission === "granted");
    }
    getData();
  });

  async function openGame(gameLocation) {
    invoke("openGame", {
      gameLocation: gameLocation,
    });

    if (permissionGranted()) {
      sendNotification("enjoy your session!");
    }

    setTimeout(async () => {
      await exit(1);
    }, 500);
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
      })
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
      })
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
      })
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
      })
    );
  }

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
    };
    setLibraryData(libraryData());

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData()),
      },
      {
        dir: BaseDirectory.AppData,
      }
    ).then(() => {
      location.reload();
    });
  }

  async function addFolder() {
    libraryData().folders[folderName()] = {
      name: folderName(),
      hide: hideFolder(),
      games: [],
    };
    setLibraryData(libraryData());

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData()),
      },
      {
        dir: BaseDirectory.AppData,
      }
    ).then(() => {
      location.reload();
    });
  }

  async function editFolder() {
    console.log("oldfoldername" + selectedFolder().name);
    console.log("oldfodlerhide" + selectedFolder().hide);
    console.log(editedFolderName());
    console.log(editedHideFolder());

    libraryData().folders[editedFolderName()] = {
      ...selectedFolder(),
      name: editedFolderName(),
      hide: editedHideFolder(),
    };

    delete libraryData().folders[selectedFolder().name];

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData()),
      },
      {
        dir: BaseDirectory.AppData,
      }
    ).then(() => {
      location.reload();
    });
  }

  return (
    <>
      <head>
        <link rel="stylesheet" href="hint.min.css" />
      </head>

      <Styles
        borderRadius={borderRadius}
        secondaryColor={secondaryColor}
        secondaryColorForBlur={secondaryColorForBlur}
        primaryColor={primaryColor}
        modalBackground={modalBackground}
        locatingLogoBackground={locatingLogoBackground}
      />

      <div id="page">
        <Show when={showSideBar()}>
          <div id="sideBar">
            <div id="sideBarTop">
              <div id="searchAndDestroy">
                <input
                  type="text"
                  name=""
                  id="searchInput"
                  placeholder="search"
                />
                <svg
                  onClick={() => {
                    setShowSideBar(false);
                  }}
                  style="cursor: pointer;"
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 11L1 6L6 1"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 11L6 6L11 1"
                    stroke="white"
                    stroke-opacity="0.5"
                    stroke-width="1.3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div id="sideBarFolders">
                <For each={currentFolders()}>
                  {(folderName) => {
                    let folder = libraryData().folders[folderName];

                    if (folder.games.length > 0) {
                      return (
                        <div
                          className="sideBarFolder"
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={async (e) => {
                            let gameName = e.dataTransfer.getData("gameName");
                            let oldFolderName =
                              e.dataTransfer.getData("oldFolderName");

                            if (oldFolderName != "uncategorized") {
                              const index =
                                libraryData().folders[
                                  oldFolderName
                                ].games.indexOf(gameName);

                              libraryData().folders[oldFolderName].games.splice(
                                index,
                                1
                              );
                            }

                            libraryData().folders[folder.name].games.push(
                              gameName
                            );

                            await writeTextFile(
                              {
                                path: "data/lib.json",
                                contents: JSON.stringify(libraryData()),
                              },
                              {
                                dir: BaseDirectory.AppData,
                              }
                            ).then(() => {
                              location.reload();
                            });
                          }}>
                          <div className="folderTitleBar">
                            <p>{folder.name}</p>
                            <button
                              className="editButton"
                              onClick={() => {
                                document
                                  .querySelector("[data-editFolderModal]")
                                  .showModal();
                                setSelectedFolder(folder);
                              }}>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M2.5 11.5L12.5 1.50002C13.3284 0.671585 14.6716 0.671585 15.5 1.50002C16.3284 2.32845 16.3284 3.67159 15.5 4.50002L5.5 14.5L1.5 15.5L2.5 11.5Z"
                                  stroke="white"
                                  stroke-opacity="0.5"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </button>
                          </div>

                          <For each={folder.games}>
                            {(gameName) => (
                              <>
                                <div
                                  className="draggable"
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                      "gameName",
                                      gameName
                                    );
                                    e.dataTransfer.setData(
                                      "oldFolderName",
                                      folder.name
                                    );
                                  }}>
                                  <p
                                    className="folderGames"
                                    aria-label="play"
                                    onClick={(e) => {
                                      if (e.ctrlKey) {
                                        openGame(
                                          libraryData().games[gameName].location
                                        );
                                      }
                                    }}>
                                    {gameName}
                                  </p>
                                </div>
                              </>
                            )}
                          </For>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="sideBarFolder"
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={async (e) => {
                            let gameName = e.dataTransfer.getData("gameName");
                            let oldFolderName =
                              e.dataTransfer.getData("oldFolderName");

                            if (oldFolderName != "uncategorized") {
                              const index =
                                libraryData().folders[
                                  oldFolderName
                                ].games.indexOf(gameName);

                              libraryData().folders[oldFolderName].games.splice(
                                index,
                                1
                              );
                            }

                            libraryData().folders[folder.name].games.push(
                              gameName
                            );

                            await writeTextFile(
                              {
                                path: "data/lib.json",
                                contents: JSON.stringify(libraryData()),
                              },
                              {
                                dir: BaseDirectory.AppData,
                              }
                            ).then(() => {
                              location.reload();
                            });
                          }}>
                          <div className="folderTitleBar">
                            <s className="folderGames">{folder.name}</s>
                            <button className="editButton">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M2.5 11.5L12.5 1.50002C13.3284 0.671585 14.6716 0.671585 15.5 1.50002C16.3284 2.32845 16.3284 3.67159 15.5 4.50002L5.5 14.5L1.5 15.5L2.5 11.5Z"
                                  stroke="white"
                                  stroke-opacity="0.5"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  }}
                </For>
                {/* uncategorized */}

                <div
                  className="sideBarFolder"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={async (e) => {
                    let gameName = e.dataTransfer.getData("gameName");
                    let oldFolderName = e.dataTransfer.getData("oldFolderName");

                    const index =
                      libraryData().folders[oldFolderName].games.indexOf(
                        gameName
                      );

                    libraryData().folders[oldFolderName].games.splice(index, 1);

                    await writeTextFile(
                      {
                        path: "data/lib.json",
                        contents: JSON.stringify(libraryData()),
                      },
                      {
                        dir: BaseDirectory.AppData,
                      }
                    ).then(() => {
                      location.reload();
                    });
                  }}>
                  <div className="folderTitleBar">
                    <p>uncategorized</p>
                  </div>
                  <For each={currentGames()}>
                    {(currentGame, i) => {
                      let gamesInFolders = [];

                      for (
                        let x = 0;
                        x < Object.values(libraryData().folders).length;
                        x++
                      ) {
                        for (
                          let y = 0;
                          y <
                          Object.values(libraryData().folders)[x].games.length;
                          y++
                        ) {
                          gamesInFolders.push(
                            Object.values(libraryData().folders)[x].games[y]
                          );
                        }
                      }
                      return (
                        <Show when={!gamesInFolders.includes(currentGame)}>
                          <div
                            className="draggable"
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData("gameName", currentGame);

                              e.dataTransfer.setData(
                                "oldFolderName",
                                "uncategorized"
                              );
                            }}>
                            <p
                              className="folderGames"
                              aria-label="play"
                              onClick={(e) => {
                                if (e.ctrlKey) {
                                  openGame(
                                    libraryData().games[currentGame].location
                                  );
                                }
                              }}>
                              {currentGame}
                            </p>
                          </div>
                        </Show>
                      );
                    }}
                  </For>
                </div>
              </div>
            </div>
            <div id="sideBarBottom">
              <button
                className="standardButton"
                onClick={() => {
                  document.querySelector("[data-newGameModal]").showModal();
                  setModalBackground("#121212cc");
                }}>
                add game
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 9V13M6 11H10M17 10.0161L17.0161 10M14 12.0161L14.0161 12M16.1836 5H7.81641C5.60774 5 3.71511 6.57359 3.32002 8.73845L2.0451 15.7241C1.84609 16.8145 2.31653 17.9185 3.24219 18.5333C4.3485 19.268 5.82159 19.1227 6.76177 18.1861L7.99615 16.9563C8.36513 16.5887 8.86556 16.3822 9.38737 16.3822H14.6126C15.1344 16.3822 15.6349 16.5887 16.0038 16.9563L17.2382 18.1861C18.1784 19.1227 19.6515 19.268 20.7578 18.5333C21.6835 17.9185 22.1539 16.8145 21.9549 15.7241L20.68 8.73845C20.2849 6.57359 18.3923 5 16.1836 5Z"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              <button
                className="standardButton"
                onClick={() => {
                  document.querySelector("[data-newFolderModal]").showModal();
                }}>
                add folder
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 21H20C21.1046 21 22 20.1046 22 19V8C22 6.89543 21.1046 6 20 6H11L9.29687 3.4453C9.1114 3.1671 8.79917 3 8.46482 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21Z"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M12 10V16M9 13H15"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </Show>

        <div id="gamesDiv">
          <For each={currentFolders()}>
            {(folderName) => {
              let folder = libraryData().folders[folderName];
              return (
                <Show when={folder.games != ""}>
                  <div className="folderRack">
                    <h1>{folder.name}</h1>
                    <div className="foldersDiv">
                      <For each={folder.games}>
                        {(gameName) => {
                          return (
                            <div
                              className="gameCard"
                              aria-label="play"
                              onClick={async (e) => {
                                if (e.ctrlKey) {
                                  openGame(
                                    libraryData().games[gameName].location
                                  );
                                  return;
                                }
                                await setSelectedGame(
                                  libraryData().games[gameName]
                                );
                                document
                                  .querySelector("[data-gamePopup]")
                                  .showModal();
                              }}>
                              <img
                                className="gridImage"
                                src={convertFileSrc(
                                  appDataDirPath() +
                                    libraryData().games[gameName].gridImage
                                )}
                                alt=""
                                width="100%"
                              />
                              {gameName}
                              {/* <p>{game.name}</p> */}
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </div>
                </Show>
              );
            }}
          </For>
        </div>
      </div>
      <div id="abovePage">
        <dialog
          data-newGameModal
          onClose={() => {
            setModalBackground("#12121266");
          }}>
          <div className="newGameDiv">
            <div className="toolbar">
              <h1>add new game</h1>
              <div className="toolbarRight">
                <button onClick={addGame} className="functionalInteractables">
                  save
                </button>
                <button
                  className="functionalInteractables"
                  onClick={() => {
                    document.querySelector("[data-newGameModal]").close();
                  }}>
                  close
                </button>
              </div>
            </div>
            <div className="mainNewGame">
              <button
                onClick={locateGridImage}
                className="locatingGridImg"
                aria-label="grid/cover">
                <Show when={locatedGridImage()}>
                  <img
                    src={convertFileSrc(locatedGridImage())}
                    alt=""
                    style="width: 100%; height:100%;"
                  />
                </Show>
              </button>

              <div>
                <div className="heroContainer">
                  <Show when={locatedHeroImage()}>
                    <button
                      onClick={locateHeroImage}
                      className="locatingHeroImg "
                      aria-label="hero">
                      <img
                        src={convertFileSrc(locatedHeroImage())}
                        alt=""
                        className="popUpHero"
                      />
                      <img
                        src={convertFileSrc(locatedHeroImage())}
                        alt=""
                        className="heroBlur"
                      />
                    </button>
                  </Show>
                  <Show when={!locatedHeroImage()}>
                    <button
                      onClick={locateHeroImage}
                      className="locatingHeroImg hint--relative hint--no-animate hint--rounded hint--no-arrow"
                      aria-label="hero"></button>
                  </Show>
                  <Show when={locatedLogo()}>
                    <button
                      onClick={locateLogo}
                      className="locatingLogoImg"
                      style="background-color: transparent;"
                      aria-label="logo">
                      <img src={convertFileSrc(locatedLogo())} alt="" />
                    </button>
                  </Show>
                  <Show when={!locatedLogo()}>
                    <button
                      onClick={locateLogo}
                      className="locatingLogoImg hint--relative hint--no-animate hint--rounded hint--no-arrow"
                      aria-label="logo"></button>
                  </Show>
                </div>

                <div className="belowHero">
                  <input
                    type="text"
                    style="flex-grow: 1"
                    name=""
                    id=""
                    onInput={(e) => {
                      setGameName(e.currentTarget.value);
                    }}
                    className="functionalInteractables"
                    placeholder="name of game"
                  />
                  <button
                    onClick={locateGame}
                    className="functionalInteractables">
                    locate game{" "}
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="newGameLeft">
              <div className="aboveHero">
                <h1>add new game</h1>
                <div className="aboveHeroRight">
                  <button onClick={addGame} className="functionalInteractables">
                    save
                  </button>
                  <button
                    className="functionalInteractables"
                    onClick={() => {
                      document.querySelector("[data-newGameModal]").close();
                    }}>
                    close
                  </button>
                </div>
              </div>

              <div className="centerHero">
                <Show when={locatedHeroImage()}>
                  <button
                    onClick={locateHeroImage}
                    className="locatingHeroImg "
                    aria-label="hero">
                    <img
                      src={convertFileSrc(locatedHeroImage())}
                      alt=""
                      style="width: 100%; height:100%"
                      className="popUpHero"
                    />
                    <img
                      src={convertFileSrc(locatedHeroImage())}
                      alt=""
                      className="heroBlur"
                    />
                  </button>
                </Show>

                <Show when={!locatedHeroImage()}>
                  <button
                    onClick={locateHeroImage}
                    className="locatingHeroImg hint--relative hint--no-animate hint--rounded hint--no-arrow"
                    aria-label="hero"></button>
                </Show>

                <Show when={locatedLogo()}>
                  {() => {
                    setLocatingLogoBackground("#ffffff00");
                    return (
                      <>
                        <Show when={!locatedHeroImage()}>
                          <button
                            onClick={locateLogo}
                            className="locatingLogoImg"
                            id="locatedLogoImg"
                            aria-label="logo">
                            <img
                              src={convertFileSrc(locatedLogo())}
                              alt=""
                              style="height:100%"
                            />
                          </button>{" "}
                        </Show>

                        <Show when={locatedHeroImage()}>
                          <button
                            onClick={locateLogo}
                            className="locatedLogoImgWithHero"
                            aria-label="logo">
                            <img
                              src={convertFileSrc(locatedLogo())}
                              alt=""
                              style="height:100%"
                            />
                          </button>{" "}
                        </Show>
                      </>
                    );
                  }}
                </Show>

                <Show when={!locatedLogo()}>
                  {() => {
                    setLocatingLogoBackground("#272727");
                    return (
                      <>
                        <Show when={!locatedHeroImage()}>
                          <button
                            onClick={locateLogo}
                            className="locatingLogoImg hint--relative hint--no-animate hint--rounded hint--no-arrow"
                            aria-label="logo"></button>
                        </Show>
                        <Show when={locatedHeroImage()}>
                          <button
                            onClick={locateLogo}
                            className="noLocatedLogoImgWithHero hint--relative hint--no-animate hint--rounded hint--no-arrow"
                            aria-label="logo"></button>
                        </Show>
                      </>
                    );
                  }}
                </Show>
              </div>

              <div className="belowHero">
                <input
                  type="text"
                  style="flex-grow: 1"
                  name=""
                  id=""
                  onInput={(e) => {
                    setGameName(e.currentTarget.value);
                  }}
                  className="functionalInteractables"
                  placeholder="name of game"
                />
                <button
                  onClick={locateGame}
                  className="functionalInteractables">
                  locate game{" "}
                </button>
              </div>
            </div>
            <button
              onClick={locateGridImage}
              className="locatingGridImg hint--relative hint--no-animate hint--rounded hint--no-arrow"
              aria-label="grid/cover">
              <Show when={locatedGridImage()}>
                <img
                  src={convertFileSrc(locatedGridImage())}
                  alt=""
                  style="width: 100%; height:100%"
                />
              </Show>
            </button> */}
          </div>
        </dialog>

        <dialog data-newFolderModal onClose={() => {}}>
          <button
            onClick={() => {
              document.querySelector("[data-newFolderModal]").close();
            }}>
            close
          </button>

          <br />
          <input
            type="text"
            name=""
            id=""
            onInput={(e) => {
              setFolderName(e.currentTarget.value);
            }}
            placeholder="name of folder"
          />
          <input
            type="checkbox"
            onInput={() => {
              setHideFolder(!hideFolder());
            }}
          />
          <button onClick={addFolder}>save</button>
        </dialog>

        <dialog data-editFolderModal onClose={() => {}}>
          <button
            onClick={() => {
              document.querySelector("[data-editFolderModal]").close();
            }}>
            close
          </button>

          <br />
          <input
            type="text"
            name=""
            id=""
            onInput={(e) => {
              setEditedFolderName(e.currentTarget.value);
            }}
            placeholder="name of folder"
            value={selectedFolder().name}
          />
          <input
            type="checkbox"
            checked={selectedFolder().hide}
            onInput={() => {
              setEditedHideFolder(!hideFolder());
            }}
          />
          <button onClick={editFolder}>save</button>
        </dialog>

        <dialog data-gamePopup>
          <Show when={selectedGame()}>
            <div className="popUpDiv">
              <img
                src={convertFileSrc(
                  appDataDirPath() + selectedGame().heroImage
                )}
                alt=""
                height="auto"
                className="heroBlur"
              />
              <div className="popUpMain">
                <div className="popUpRight">
                  <button
                    className="standardButton"
                    onClick={() => {
                      openGame(selectedGame().location);
                    }}>
                    play
                    <svg
                      width="13"
                      height="16"
                      viewBox="0 0 13 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.69727 14.3947V0.894745L12.1973 7.64474L1.69727 14.3947Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="standardButton"
                    onClick={() => {
                      document.querySelector("[data-gamePopup]").close();
                    }}>
                    <svg
                      width="12"
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
                <img
                  src={convertFileSrc(
                    appDataDirPath() + selectedGame().heroImage
                  )}
                  alt=""
                  height="auto"
                  className="popUpHero"
                />
                <img
                  src={convertFileSrc(appDataDirPath() + selectedGame().logo)}
                  alt=""
                  className="popupLogo"
                  height="60px"
                />
              </div>
            </div>
          </Show>
        </dialog>
      </div>
    </>
  );
}

export default App;
