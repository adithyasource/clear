import { Show, createSignal, onMount } from "solid-js";
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

function App() {
  const [locatedGame, setlocatedGame] = createSignal();
  const [locatedHeroImage, setLocatedHeroImage] = createSignal();
  const [locatedGridImage, setLocatedGridImage] = createSignal();
  const [locatedLogo, setLocatedLogo] = createSignal();
  const [gameName, setGameName] = createSignal();
  const [folderName, setFolderName] = createSignal();
  const [hideFolder, setHideFolder] = createSignal(false);
  const [libraryData, setLibraryData] = createSignal("");
  const [selectedGame, setSelectedGame] = createSignal({});
  const [appDataDirPath, setAppDataDirPath] = createSignal({});
  const [permissionGranted, setPermissionGranted] = createSignal(
    isPermissionGranted()
  );

  async function getData() {
    setAppDataDirPath(await appDataDir());

    if (await exists("data/lib.json", { dir: BaseDirectory.AppData })) {
      let getLibraryData = await readTextFile("data/lib.json", {
        dir: BaseDirectory.AppData,
      });

      if (getLibraryData != "") {
        setLibraryData(JSON.parse(getLibraryData));
        console.log("data gotten");
      } else return;
    } else {
      console.log("create dir");
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
    console.log(locatedGame());
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
    console.log(locatedHeroImage());
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
    console.log(locatedGridImage());
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
    console.log(locatedLogo());
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

    // let iterLib = libraryData().games ? true : false;

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify({
          games: [
            ...(libraryData().games ? true : false ? libraryData().games : []),
            {
              location: locatedGame(),
              name: gameName(),
              heroImage: heroImageFileName,
              gridImage: gridImageFileName,
              logo: logoFileName,
              folder: "uncategorized",
            },
          ],
        }),
      },
      {
        dir: BaseDirectory.AppData,
      }
    );
    getData();
  }

  async function addFolder() {
    console.log(folderName(), hideFolder());

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify({
          // ...(libraryData() ? true : false ? libraryData() : []),
          ...libraryData(),

          folders: [
            ...libraryData().folders,
            {
              name: folderName(),
              hide: hideFolder(),
            },
          ],
        }),
      },
      {
        dir: BaseDirectory.AppData,
      }
    );
    getData();
  }

  return (
    <>
      <div id="page">
        <div id="sideBar">
          games
          <For each={libraryData().games}>
            {(game, index) => (
              <>
                <div
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("index", index());
                  }}>
                  <p style="user-select: none">
                    {index} {game.name}
                  </p>
                </div>
              </>
            )}
          </For>
          <br />
          <br /> <hr />
          folders
          <For each={libraryData().folders}>
            {(folder) => (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={async (e) => {
                  console.log(
                    e.dataTransfer.getData("index") + " to " + folder.name
                  );

                  let index = e.dataTransfer.getData("index");

                  await writeTextFile(
                    {
                      path: "data/lib.json",
                      contents: JSON.stringify({
                        games: [
                          ...libraryData().games.slice(0, index),
                          ...libraryData().games.slice(index + 1),
                          {
                            ...libraryData().games[index],
                            folder: folder.name,
                          },
                        ],

                        folders: [...libraryData().folders],
                      }),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    }
                  );
                  getData();
                }}>
                <p>{folder.name}</p>
              </div>
            )}
          </For>
          <button
            onClick={() => {
              document.querySelector("[data-newGameModal]").showModal();
            }}>
            add game
            <svg
              width="20"
              height="20"
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
          <br />
          <br />
          <button
            onClick={() => {
              document.querySelector("[data-newFolderModal]").showModal();
            }}>
            add folder
            <svg
              width="20"
              height="20"
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

        <div id="gamesDiv">
          <For each={libraryData().folders}>
            {(folder) => (
              <div>
                <h1>{folder.name}</h1>
                <div className="foldersDiv">
                  <For each={libraryData().games}>
                    {(game, index) => (
                      <>
                        <Show when={game.folder == folder.name}>
                          <div
                            className="gameCard"
                            onClick={async () => {
                              await setSelectedGame(
                                libraryData()["games"][index()]
                              );

                              console.log(selectedGame());

                              document
                                .querySelector("[data-gamePopup]")
                                .showModal();
                            }}>
                            <img
                              src={convertFileSrc(
                                appDataDirPath() + game.gridImage
                              )}
                              alt=""
                              width="100%"
                            />
                            <p>{game.name}</p>
                          </div>
                        </Show>
                      </>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
      <div id="abovePage">
        <dialog data-newGameModal onClose={() => {}}>
          <button
            onClick={() => {
              document.querySelector("[data-newGameModal]").close();
            }}>
            close
          </button>

          <br />
          <input
            type="text"
            name=""
            id=""
            onInput={(e) => {
              console.log(e.currentTarget.value);
              setGameName(e.currentTarget.value);
            }}
            placeholder="name of game"
          />
          <button onClick={locateGame}>locate game</button>
          <button onClick={locateHeroImage}>hero image</button>
          <button onClick={locateGridImage}>grid image</button>
          <button onClick={locateLogo}>logo</button>
          <button onClick={addGame}>save</button>
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
              console.log(e.currentTarget.value);
              setFolderName(e.currentTarget.value);
            }}
            placeholder="name of folder"
          />
          <input
            type="checkbox"
            onInput={() => {
              setHideFolder(!hideFolder());

              console.log(hideFolder());
            }}
          />
          <button onClick={addFolder}>save</button>
        </dialog>

        <dialog data-gamePopup>
          <Show when={selectedGame()}>
            <button
              onClick={() => {
                document.querySelector("[data-gamePopup]").close();
              }}>
              close
            </button>
            <br />
            {selectedGame().name} <br />
            <img
              src={convertFileSrc(appDataDirPath() + selectedGame().heroImage)}
              alt=""
              height="150px"
            />{" "}
            <br />
            <img
              src={convertFileSrc(appDataDirPath() + selectedGame().gridImage)}
              alt=""
              height="150px"
            />{" "}
            <br />
            <img
              src={convertFileSrc(appDataDirPath() + selectedGame().logo)}
              alt=""
              height="40px"
            />
            <br />{" "}
            <button
              onClick={() => {
                openGame(selectedGame().location);
              }}>
              open game
            </button>
          </Show>
        </dialog>
      </div>
    </>
  );
}

export default App;
