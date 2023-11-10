import { Show } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import {
  libraryData,
  roundedBorders,
  setRoundedBorders,
  gameTitle,
  setGameTitle,
  folderTitle,
  setFolderTitle,
  quitAfterOpen,
  setQuitAfterOpen,
  setFontName,
  fontName,
  currentTheme,
  setCurrentTheme,
  showFPS,
  setShowFPS,
} from "../Signals";

import { getData, getSettingsData } from "../App";

export function Settings() {
  setTimeout(() => {
    getSettingsData();
  }, 50);

  return (
    <>
      <dialog
        data-settingsModal
        onClose={() => {}}
        className="outline-none absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#ffffff66]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div
            className={`border-2 border-solid border-[#ffffff1f] bg-[#121212] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] w-[70%] p-6`}>
            <div className="flex justify-between">
              <div>
                <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                  settings
                </p>
              </div>

              <button
                className="flex items-center functionalInteractables"
                onClick={() => {
                  document.querySelector("[data-settingsModal]").close();
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

            <div className="grid grid-cols-3 mt-[25px] gap-y-4">
              <div
                onClick={async () => {
                  setRoundedBorders((x) => !x);

                  libraryData().userSettings.roundedBorders = roundedBorders();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={roundedBorders()}>
                  <div className="relative">
                    <div className="">rounded borders</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      rounded borders
                    </div>
                  </div>
                </Show>
                <Show when={!roundedBorders()}>
                  <div className="">rounded borders</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setGameTitle((x) => !x);

                  libraryData().userSettings.gameTitle = gameTitle();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={gameTitle()}>
                  <div className="relative">
                    <div className="">game title</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      game title
                    </div>
                  </div>
                </Show>
                <Show when={!gameTitle()}>
                  <div className="">game title</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setFolderTitle((x) => !x);

                  libraryData().userSettings.folderTitle = folderTitle();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={folderTitle()}>
                  <div className="relative">
                    <div className="">folder title</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      folder title
                    </div>
                  </div>
                </Show>
                <Show when={!folderTitle()}>
                  <div className="">folder title</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setQuitAfterOpen((x) => !x);

                  libraryData().userSettings.quitAfterOpen = quitAfterOpen();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="relative cursor-pointer">
                <Show when={quitAfterOpen()}>
                  <div className="relative">
                    <div className="">quit after opening game</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      quit after opening game
                    </div>
                  </div>
                </Show>
                <Show when={!quitAfterOpen()}>
                  <div className="">quit after opening game</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  setShowFPS((x) => !x);

                  libraryData().userSettings.showFPS = showFPS();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());

                  //? FPS Counter by https://codepen.io/lnfnunes/pen/Qjeeyg

                  if (showFPS() == true) {
                    function tick() {
                      var time = Date.now();
                      frame++;
                      if (time - startTime > 1000) {
                        fps.innerHTML = (
                          frame /
                          ((time - startTime) / 1000)
                        ).toFixed(1);
                        startTime = time;
                        frame = 0;
                      }
                      window.requestAnimationFrame(tick);
                    }

                    var fps = document.getElementById("fps");
                    var startTime = Date.now();
                    var frame = 0;

                    tick();
                  }
                }}
                className="relative cursor-pointer">
                <Show when={showFPS()}>
                  <div className="relative">
                    <div className="">show fps</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      show fps
                    </div>
                  </div>
                </Show>
                <Show when={!showFPS()}>
                  <div className="">show fps</div>
                </Show>
              </div>
              <div
                onClick={async () => {
                  if (fontName() == "Sans Serif") {
                    setFontName("Serif");
                  } else {
                    if (fontName() == "Serif") {
                      setFontName("Mono");
                    } else {
                      if (fontName() == "Mono") {
                        setFontName("Sans Serif");
                      }
                    }
                  }

                  libraryData().userSettings.fontName = fontName();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="flex gap-2 cursor-pointer ">
                <span className="text-[#ffffff80]">[font]</span>
                <div className="">
                  {fontName().toLowerCase() || "sans serif"}
                </div>
              </div>
              <div
                onClick={async () => {
                  currentTheme() == "dark"
                    ? setCurrentTheme("light")
                    : setCurrentTheme("dark");

                  libraryData().userSettings.theme = currentTheme();

                  await writeTextFile(
                    {
                      path: "lib.json",
                      contents: JSON.stringify(libraryData(), null, 4),
                    },
                    {
                      dir: BaseDirectory.AppData,
                    },
                  ).then(getData());
                }}
                className="flex gap-2 cursor-pointer ">
                <span className="text-[#ffffff80]">[theme]</span>
                <div className="">{currentTheme().toLowerCase() || "dark"}</div>
              </div>
            </div>

            <div className="flex gap-3 items-start mt-[35px]">
              <button
                className="flex items-center functionalInteractables"
                onClick={() => {
                  invoke("openLibLocation");
                }}>
                open library location
              </button>
              <span className="text-[#ffffff80] w-[50%]">
                these are all the files that the app stores on your pc. you can
                copy these files to the same location on another pc to get your
                library there
              </span>
            </div>

            <div className="grid grid-cols-3 mt-[35px] gap-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + n
                </div>
                new game
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + .
                </div>
                open settings
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + f
                </div>
                search bar
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + m
                </div>
                new folder
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + l
                </div>
                open notepad
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + \\
                </div>
                hide sidebar
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + w
                </div>
                close app
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  escape
                </div>
                close dialogs
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`bg-[#1c1c1c] py-1 px-3 w-[max-content] text-[#ffffff80] rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }] `}>
                  ctrl + click
                </div>
                quick open game
              </div>
            </div>

            <div className="flex justify-between mt-[35px] ">
              <div>
                clear <span className="text-[#ffffff80]">v1.0.0</span>
              </div>
              <a href="https://clear.adithya.zip" className="underline">
                visit website
              </a>
              <div>
                made by{" "}
                <a href="https://adithya.zip" className="underline">
                  adithya
                </a>
              </div>
              <a href="https://ko-fi.com/adithyasource" className="underline">
                buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
