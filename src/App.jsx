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
import "./App.css";

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
    isPermissionGranted(),
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
            "hint--no-arrow",
          );
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document
          .querySelectorAll(".gameCard")
          [i].classList.add(
            "hint--center",
            "hint--no-animate",
            "hint--rounded",
            "hint--no-arrow",
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
          "hint--no-arrow",
        );
    }

    for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
      document
        .querySelectorAll(".gameCard")
        [i].classList.remove(
          "hint--center",
          "hint--no-animate",
          "hint--rounded",
          "hint--no-arrow",
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
        },
      );
    }
  }

  onMount(async () => {
    if (!permissionGranted()) {
      const permission = await requestPermission();
      setPermissionGranted(permission === "granted");
    }
    getData();

    let test = await readTextFile("test.txt", {
      dir: "C:\\Program Files (x86)\\Steam\\steamapps",
    });

    console.log(test);
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
      },
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
    //
    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData()),
      },
      {
        dir: BaseDirectory.AppData,
      },
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
      },
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
          <div id="sideBar" className="z-10">
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
                                1,
                              );
                            }

                            libraryData().folders[folder.name].games.push(
                              gameName,
                            );

                            await writeTextFile(
                              {
                                path: "data/lib.json",
                                contents: JSON.stringify(libraryData()),
                              },
                              {
                                dir: BaseDirectory.AppData,
                              },
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
                                      gameName,
                                    );
                                    e.dataTransfer.setData(
                                      "oldFolderName",
                                      folder.name,
                                    );
                                  }}>
                                  <p
                                    className="folderGames"
                                    aria-label="play"
                                    onClick={(e) => {
                                      if (e.ctrlKey) {
                                        openGame(
                                          libraryData().games[gameName]
                                            .location,
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
                                1,
                              );
                            }

                            libraryData().folders[folder.name].games.push(
                              gameName,
                            );

                            await writeTextFile(
                              {
                                path: "data/lib.json",
                                contents: JSON.stringify(libraryData()),
                              },
                              {
                                dir: BaseDirectory.AppData,
                              },
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
                        gameName,
                      );

                    libraryData().folders[oldFolderName].games.splice(index, 1);

                    await writeTextFile(
                      {
                        path: "data/lib.json",
                        contents: JSON.stringify(libraryData()),
                      },
                      {
                        dir: BaseDirectory.AppData,
                      },
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
                            Object.values(libraryData().folders)[x].games[y],
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
                                "uncategorized",
                              );
                            }}>
                            <p
                              className="folderGames"
                              aria-label="play"
                              onClick={(e) => {
                                if (e.ctrlKey) {
                                  openGame(
                                    libraryData().games[currentGame].location,
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
                className="standardButton "
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

        <div className="absolute left-[13%] w-[86%] h-[calc(100vh-40px)] overflow-y-scroll pl-[10%] ">
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
                                className="relative gameCard  group "
                                aria-label="play"
                                onClick={async (e) => {
                                  if (e.ctrlKey) {
                                    openGame(
                                      libraryData().games[gameName].location,
                                    );
                                    return;
                                  }
                                  await setSelectedGame(
                                    libraryData().games[gameName],
                                  );
                                  document
                                    .querySelector("[data-gamePopup]")
                                    .showModal();
                                }}>
                                <img
                                  className="relative z-10 gridImage "
                                  src={convertFileSrc(
                                    appDataDirPath() +
                                      libraryData().games[gameName].gridImage,
                                  )}
                                  alt=""
                                  width="100%"
                                />
                                <Show
                                  when={
                                    libraryData().games[gameName].favourite
                                  }>
                                  <img
                                    className=" absolute blur-[50px] opacity-[0.4] inset-0 group-hover:opacity-[0.5] group-hover:blur-[60px] duration-700"
                                    src={convertFileSrc(
                                      appDataDirPath() +
                                        libraryData().games[gameName].gridImage,
                                    )}
                                    alt=""
                                  />
                                </Show>
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
      </div>
      <div id="abovePage">
        <dialog
          data-newGameModal
          onClose={() => {
            setModalBackground("#12121266");
          }}>
          <div className="flex flex-col gap-3 newGameDiv">
            <div className="flex justify-between w-[61rem]">
              <div>
                <h1>add new game</h1>
              </div>
              <div className="flex gap-3">
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
            <div className="flex gap-[13.5rem]">
              <div>
                <button
                  onClick={locateGridImage}
                  className="locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
                  aria-label="grid/cover">
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
                          className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px]"
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
                    </button>
                  </div>

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
                </div>

                <div className="flex gap-3">
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
                    locate game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
        <dialog
          data-editGameModal
          onClose={() => {
            setModalBackground("#12121266");
          }}>
          <div className="flex flex-col gap-3 newGameDiv">
            <div className="flex justify-between w-[61rem]">
              <div>
                <h1>edit {selectedGame().name}</h1>
              </div>
              <div className="flex gap-3">
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
            <div className="flex gap-[13.5rem]">
              <div>
                <button
                  onClick={locateGridImage}
                  className="locatingGridImg h-[100%] aspect-[2/3] group relative overflow-hidden"
                  aria-label="grid/cover">
                  <Show when={selectedGame().gridImage}>
                    <img
                      className="absolute inset-0"
                      src={convertFileSrc(
                        appDataDirPath() + selectedGame().gridImage,
                      )}
                      alt=""
                    />
                    <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                      grid/cover
                    </span>
                  </Show>
                  <Show when={!selectedGame().gridImage}>
                    <span class="absolute tooltip group-hover:opacity-100 left-[30%] top-[45%] opacity-0">
                      grid/cover
                    </span>
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
                        when={selectedGame().heroImage}
                        className="absolute inset-0 overflow-hidden">
                        <img
                          src={convertFileSrc(
                            appDataDirPath() + selectedGame().heroImage,
                          )}
                          alt=""
                          className="absolute inset-0 h-[100%] rounded-[6px]"
                        />
                        <img
                          src={convertFileSrc(selectedGame().heroImage)}
                          alt=""
                          className="absolute inset-0 -z-10 h-[100%] rounded-[6px] blur-[80px]"
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
                    </button>
                  </div>

                  <Show when={selectedGame().logo}>
                    <button
                      onClick={locateLogo}
                      className="locatedHeroImg group  absolute bottom-[20px] left-[20px] "
                      aria-label="logo">
                      <img
                        src={convertFileSrc(
                          appDataDirPath() + selectedGame().logo,
                        )}
                        alt=""
                        className="h-[60px] "
                      />
                      <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                        logo
                      </span>
                    </button>
                  </Show>

                  <Show when={!selectedGame().logo}>
                    <button
                      onClick={locateLogo}
                      className="locatingLogoImg group absolute bottom-[20px] left-[20px] w-[170px] h-[70px] functionalInteractables"
                      aria-label="logo">
                      <span class="absolute tooltip group-hover:opacity-100 left-[35%] top-[30%] opacity-0">
                        logo
                      </span>
                    </button>
                  </Show>
                </div>

                <div className="flex gap-3">
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
                    value={selectedGame().name}
                  />
                  <button
                    onClick={locateGame}
                    className="functionalInteractables">
                    locate game
                  </button>
                </div>
              </div>
            </div>
          </div>
          damn
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
                  appDataDirPath() + selectedGame().heroImage,
                )}
                alt=""
                height="auto"
                className="absolute blur-[80px] opacity-[0.4] -z-10"
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
                      document
                        .querySelector("[data-editGameModal]")
                        .showModal();
                    }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.0761 3.16311C10.136 2.50438 10.6883 2 11.3497 2H12.6503C13.3117 2 13.864 2.50438 13.9239 3.16311C13.9731 3.70392 14.3623 4.14543 14.8708 4.336C15.0015 4.38499 15.1307 4.43724 15.2582 4.49263C15.7613 4.71129 16.3531 4.66938 16.7745 4.31818C17.2953 3.8842 18.0611 3.91894 18.5404 4.39829L19.4584 5.31623C19.9154 5.77326 19.9485 6.50338 19.5347 6.99992C19.1901 7.41349 19.158 7.99745 19.3897 8.48341C19.49 8.69386 19.5816 8.90926 19.664 9.12916C19.8546 9.63767 20.2961 10.0269 20.8369 10.0761C21.4956 10.136 22 10.6883 22 11.3497V12.6503C22 13.3117 21.4956 13.864 20.8369 13.9239C20.2961 13.9731 19.8546 14.3623 19.664 14.8708C19.59 15.0682 19.5086 15.262 19.4202 15.4518C19.2053 15.913 19.2401 16.4637 19.5658 16.8546C19.962 17.33 19.9303 18.0291 19.4927 18.4667L18.4667 19.4927C18.0291 19.9303 17.33 19.962 16.8546 19.5658C16.4637 19.2401 15.913 19.2053 15.4518 19.4202C15.262 19.5086 15.0682 19.59 14.8708 19.664C14.3623 19.8546 13.9731 20.2961 13.9239 20.8369C13.864 21.4956 13.3117 22 12.6503 22H11.3497C10.6883 22 10.136 21.4956 10.0761 20.8369C10.0269 20.2961 9.63767 19.8546 9.12917 19.664C8.90927 19.5816 8.69387 19.49 8.48343 19.3897C7.99746 19.158 7.4135 19.1901 6.99992 19.5347C6.50338 19.9485 5.77325 19.9154 5.31622 19.4584L4.39829 18.5404C3.91893 18.0611 3.8842 17.2953 4.31818 16.7745C4.66939 16.3531 4.71129 15.7613 4.49263 15.2582C4.43724 15.1307 4.385 15.0016 4.336 14.8708C4.14544 14.3623 3.70392 13.9731 3.16311 13.9239C2.50438 13.864 2 13.3117 2 12.6503V11.3497C2 10.6883 2.50438 10.136 3.16311 10.0761C3.70393 10.0269 4.14544 9.63768 4.33601 9.12917C4.3936 8.9755 4.45568 8.82402 4.52209 8.67489C4.7571 8.14716 4.71804 7.52257 4.34821 7.07877C3.89722 6.53758 3.93332 5.74179 4.43145 5.24365L5.24364 4.43146C5.74178 3.93332 6.53757 3.89722 7.07876 4.34822C7.52256 4.71805 8.14715 4.7571 8.67488 4.52209C8.82401 4.45568 8.97549 4.3936 9.12916 4.33601C9.63767 4.14544 10.0269 3.70393 10.0761 3.16311Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
                      <path
                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"></path>
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
                    appDataDirPath() + selectedGame().heroImage,
                  )}
                  alt=""
                  height="auto"
                  className="popUpHero"
                />
                <img
                  src={convertFileSrc(appDataDirPath() + selectedGame().logo)}
                  alt=""
                  className="popupLogo h-[70px]"
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
