import { For, Show, onMount } from "solid-js";

import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

import {
  appDataDirPath,
  currentFolders,
  currentTheme,
  folderTitle,
  fontName,
  gameTitle,
  libraryData,
  quitAfterOpen,
  roundedBorders,
  searchValue,
  setAppDataDirPath,
  setCurrentFolders,
  setCurrentGames,
  setCurrentTheme,
  setFolderTitle,
  setFontName,
  setGameTitle,
  setLibraryData,
  setQuitAfterOpen,
  setRoundedBorders,
  setSearchValue,
  setSelectedGame,
  setShowSideBar,
  setWindowWidth,
  showSideBar,
  windowWidth,
  setToastMessage,
  setShowToast,
  setShowImportAndOverwriteConfirm,
  showImportAndOverwriteConfirm,
  setSteamFolderExists,
  steamFolderExists,
  language,
  setLanguage,
  setShowLanguageSelector,
  showLanguageSelector,
  setShowSettingsLanguageSelector,
  setTotalSteamGames,
  setTotalImportedSteamGames,
  setZoomLevel,
  zoomLevel,
} from "./Signals";

import { SideBar } from "./SideBar";

import { EditFolder } from "./modals/EditFolder";
import { EditGame } from "./modals/EditGame";
import { GamePopUp } from "./modals/GamePopUp";
import { NewFolder } from "./modals/NewFolder";
import { NewGame } from "./modals/NewGame";
import { Notepad } from "./modals/Notepad";
import { Settings } from "./modals/Settings";
import { Loading } from "./modals/Loading";

import { Toast } from "./components/Toast";
import { textLanguages } from "./Text";

import "./App.css";

import Fuse from "fuse.js";

export function getSettingsData() {
  if (
    libraryData().userSettings.roundedBorders == undefined ||
    libraryData().userSettings.roundedBorders == true
  ) {
    setRoundedBorders(true);
  } else {
    setRoundedBorders(false);
  }
  if (
    libraryData().userSettings.gameTitle == undefined ||
    libraryData().userSettings.gameTitle == true
  ) {
    setGameTitle(true);
  } else {
    setGameTitle(false);
  }
  if (
    libraryData().userSettings.folderTitle == undefined ||
    libraryData().userSettings.folderTitle == true
  ) {
    setFolderTitle(true);
  } else {
    setFolderTitle(false);
  }
  if (
    libraryData().userSettings.quitAfterOpen == undefined ||
    libraryData().userSettings.quitAfterOpen == true
  ) {
    setQuitAfterOpen(true);
  } else {
    setQuitAfterOpen(false);
  }

  if (
    libraryData().userSettings.theme == undefined ||
    libraryData().userSettings.theme == "dark"
  ) {
    setCurrentTheme("dark");
  } else {
    setCurrentTheme("light");
  }

  if (
    libraryData().userSettings.language == undefined ||
    libraryData().userSettings.language == "en"
  ) {
    setLanguage("en");
  } else {
    setLanguage(libraryData().userSettings.language);
  }

  if (
    libraryData().userSettings.zoomLevel == undefined ||
    libraryData().userSettings.zoomLevel == 1
  ) {
    setZoomLevel(1);
  } else {
    setZoomLevel(libraryData().userSettings.zoomLevel);
  }

  setFontName(libraryData().userSettings.fontName || "Sans Serif");

  document.documentElement.classList.add("dark");

  if (currentTheme() == "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  libraryData().userSettings.showSideBar == undefined
    ? setShowSideBar(true)
    : setShowSideBar(libraryData().userSettings.showSideBar);

  libraryData().folders.steam != undefined
    ? setSteamFolderExists(true)
    : setSteamFolderExists(false);
}

async function createEmptyLibrary() {
  await createDir("heroes", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("grids", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("logos", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await createDir("icons", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });

  let emptyLibrary = {
    games: {},
    folders: {},
    notepad: "",
    userSettings: {},
  };
  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(emptyLibrary, null, 4),
    },
    {
      dir: BaseDirectory.AppData,
    },
  );

  getData();
}

export async function getData() {
  setAppDataDirPath(await appDataDir());

  if (await exists("data.json", { dir: BaseDirectory.AppData })) {
    let getLibraryData = await readTextFile("data.json", {
      dir: BaseDirectory.AppData,
    });

    if (getLibraryData != "" && JSON.parse(getLibraryData).folders != "") {
      setCurrentGames("");
      setCurrentFolders("");

      setLibraryData(JSON.parse(getLibraryData));

      for (let x = 0; x < Object.keys(libraryData()["folders"]).length; x++) {
        for (let y = 0; y < Object.keys(libraryData()["folders"]).length; y++) {
          if (Object.values(libraryData()["folders"])[y].index == x) {
            setCurrentFolders((z) => [
              ...z,
              Object.keys(libraryData()["folders"])[y],
            ]);
          }
        }
      }

      setCurrentGames(Object.keys(libraryData()["games"]));

      console.log("data fetched");

      getSettingsData();

      document.querySelector("[data-newGameModal]").close();
      document.querySelector("[data-newFolderModal]").close();
      document.querySelector("[data-gamePopup]").close();
      document.querySelector("[data-editGameModal]").close();
      document.querySelector("[data-editFolderModal]").close();
    } else createEmptyLibrary();
  } else {
    createEmptyLibrary();
  }
}

export async function openGame(gameLocation) {
  if (gameLocation == undefined) {
    setShowToast(true);
    setToastMessage(translateText("no game file provided!"));
    setTimeout(() => {
      setShowToast(false);
    }, 1500);

    return;
  }

  invoke("open_location", {
    location: gameLocation,
  });

  if (quitAfterOpen() == true || quitAfterOpen() == undefined) {
    setTimeout(async () => {
      invoke("close_app");
    }, 500);
  } else {
    setShowToast(true);
    setToastMessage(translateText("game launched! enjoy your session!"));
    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  }
}

export function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export async function changeLanguage(lang) {
  libraryData().userSettings.language = lang;

  setLanguage("lang");

  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(libraryData(), null, 4),
    },
    {
      dir: BaseDirectory.AppData,
    },
  ).then(getData());

  setShowLanguageSelector(false);
  setShowSettingsLanguageSelector(false);
}

// ? VDF Parser From https://github.com/node-steam/vdf

function parseVDF(text) {
  if (typeof text !== "string") {
    throw new TypeError("VDF | Parse: Expecting parameter to be a string");
  }

  const lines = text.split("\n");
  const object = {};
  const stack = [object];
  let expect = false;

  const regex = new RegExp(
    '^("((?:\\\\.|[^\\\\"])+)"|([a-z0-9\\-\\_]+))' +
      "([ \t]*(" +
      '"((?:\\\\.|[^\\\\"])*)(")?' +
      "|([a-z0-9\\-\\_]+)" +
      "))?",
  );

  let i = 0;
  const j = lines.length;

  let comment = false;

  for (; i < j; i++) {
    let line = lines[i].trim();

    if (line.startsWith("/*") && line.endsWith("*/")) {
      continue;
    }

    if (line.startsWith("/*")) {
      comment = true;
      continue;
    }

    if (line.endsWith("*/")) {
      comment = false;
      continue;
    }

    if (comment) {
      continue;
    }

    if (line === "" || line[0] === "/") {
      continue;
    }
    if (line[0] === "{") {
      expect = false;
      continue;
    }
    if (expect) {
      throw new SyntaxError(`VDF | Parse: Invalid syntax on line ${i + 1}`);
    }
    if (line[0] === "}") {
      stack.pop();
      continue;
    }
    while (true) {
      const m = regex.exec(line);
      if (m === null) {
        throw new SyntaxError(`VDF | Parse: Invalid syntax on line ${i + 1}`);
      }
      const key = m[2] !== undefined ? m[2] : m[3];
      let val = m[6] !== undefined ? m[6] : m[8];

      if (val === undefined) {
        if (stack[stack.length - 1][key] === undefined)
          stack[stack.length - 1][key] = {};
        stack.push(stack[stack.length - 1][key]);
        expect = true;
      } else {
        if (m[7] === undefined && m[8] === undefined) {
          line += "\n" + lines[++i];
          continue;
        }

        if (val !== "" && !isNaN(val)) val = +val;
        if (val === "true") val = true;
        if (val === "false") val = false;
        if (val === "null") val = null;
        if (val === "undefined") val = undefined;

        stack[stack.length - 1][key] = val;
      }
      break;
    }
  }

  if (stack.length !== 1)
    throw new SyntaxError("VDF | Parse: Open parentheses somewhere");

  return object;
}

export async function downloadImage(name, integerBytesList) {
  await writeBinaryFile(name, integerBytesList, {
    dir: BaseDirectory.AppData,
  });
}

export async function importSteamGames() {
  document.querySelector("[data-loadingModal]").show();

  await fetch("https://clear-api.adithya.zip/?version=a")
    .then(() => {
      invoke("read_steam_vdf").then(async (data) => {
        if (data == "error") {
          document.querySelector("[data-loadingModal]").close();

          setShowToast(true);
          setToastMessage(
            translateText(
              "sorry but there was an error \n reading your steam library :(",
            ),
          );
          setTimeout(() => {
            setShowToast(false);
          }, 2500);

          return;
        }

        let steamData = parseVDF(data);

        let steamGameIds = [];

        for (let x = 0; x < Object.keys(steamData.libraryfolders).length; x++) {
          steamGameIds.push(...Object.keys(steamData.libraryfolders[x].apps));
        }

        const index = steamGameIds.indexOf("228980");

        index != -1 ? steamGameIds.splice(index, 1) : null;

        setTotalSteamGames(steamGameIds.length);

        let allGameNames = [];

        delete libraryData().folders["steam"];

        setLibraryData(libraryData());

        await writeTextFile(
          {
            path: "data.json",
            contents: JSON.stringify(libraryData(), null, 4),
          },
          {
            dir: BaseDirectory.AppData,
          },
        )
          .then(async () => {
            getData();

            for (const steamId of steamGameIds) {
              await fetch(
                `https://clear-api.adithya.zip/?steamID=${steamId}`,
              ).then((res) =>
                res.json().then(async (jsonres) => {
                  let gameId = jsonres.data.id;
                  let name = jsonres.data.name;

                  allGameNames.push(name);

                  let gridImageFileName = generateRandomString() + ".png";
                  let heroImageFileName = generateRandomString() + ".png";
                  let logoImageFileName = generateRandomString() + ".png";
                  let iconImageFileName = generateRandomString() + ".png";

                  await fetch(
                    `https://clear-api.adithya.zip/?limitedAssets=${gameId}`,
                  )
                    .then((res) =>
                      res.json().then(async (jsonres) => {
                        jsonres.grid.length != 0
                          ? downloadImage(
                              "grids\\" + gridImageFileName,
                              jsonres.grid,
                            )
                          : (gridImageFileName = undefined);
                        jsonres.hero.length != 0
                          ? downloadImage(
                              "heroes\\" + heroImageFileName,
                              jsonres.hero,
                            )
                          : (heroImageFileName = undefined);
                        jsonres.logo.length != 0
                          ? downloadImage(
                              "logos\\" + logoImageFileName,
                              jsonres.logo,
                            )
                          : (logoImageFileName = undefined);
                        jsonres.icon.length != 0
                          ? downloadImage(
                              "icons\\" + iconImageFileName,
                              jsonres.icon,
                            )
                          : (iconImageFileName = undefined);

                        libraryData().games[name] = {
                          location: `steam://rungameid/${steamId}`,
                          name: name,
                          heroImage: heroImageFileName,
                          gridImage: gridImageFileName,
                          logo: logoImageFileName,
                          icon: iconImageFileName,
                          favourite: false,
                        };

                        setLibraryData(libraryData());

                        await writeTextFile(
                          {
                            path: "data.json",
                            contents: JSON.stringify(libraryData(), null, 4),
                          },
                          {
                            dir: BaseDirectory.AppData,
                          },
                        );

                        setTotalImportedSteamGames((x) => x + 1);
                      }),
                    )
                    .catch((err) => {
                      // no assets found at all for this game
                    });
                }),
              );
            }
          })
          .then(async () => {
            libraryData().folders["steam"] = {
              name: "steam",
              hide: false,
              games: allGameNames,
              index: currentFolders().length,
            };

            await writeTextFile(
              {
                path: "data.json",
                contents: JSON.stringify(libraryData(), null, 4),
              },
              {
                dir: BaseDirectory.AppData,
              },
            ).then(() => {
              document.querySelector("[data-loadingModal]").close();
              document.querySelector("[data-settingsModal]").close();

              getData();

              setTotalImportedSteamGames(0);
              setTotalSteamGames(0);
            });
          });
      });
    })
    .catch((err) => {
      document.querySelector("[data-loadingModal]").close();

      setShowToast(true);
      setToastMessage(translateText("you're not connected to the internet :("));
      setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return;
    });
}

export function translateText(text) {
  return language() == undefined || language() == "en"
    ? text
    : textLanguages[text][language()];
}

async function updateData() {
  await writeTextFile(
    {
      path: "data.json",
      contents: JSON.stringify(libraryData(), null, 4),
    },
    {
      dir: BaseDirectory.AppData,
    },
  ).then(getData());
}

function App() {
  document.addEventListener("keydown", (e) => {
    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].style.cursor = "pointer";
    }

    if (e.ctrlKey) {
      for (
        let i = 0;
        i < document.querySelectorAll(".sideBarGame").length;
        i++
      ) {
        document
          .querySelectorAll(".sideBarGame")
          [i].classList.add("hint--right");
      }

      for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
        document.querySelectorAll(".gameCard")[i].classList.add("hint--center");
      }
    }

    if (e.ctrlKey && e.code == "Equal") {
      setZoomLevel((x) => (x != 2 ? (x += 1) : (x = 2)));

      libraryData().userSettings.zoomLevel = zoomLevel();

      updateData();
    }

    if (e.ctrlKey && e.code == "Minus") {
      setZoomLevel((x) => (x != 0 ? (x -= 1) : (x = 0)));

      libraryData().userSettings.zoomLevel = zoomLevel();

      updateData();
    }

    if (e.ctrlKey && e.code == "KeyF") {
      e.preventDefault();
      document.querySelector("#searchInput").focus();
    }

    if (e.ctrlKey && e.code == "KeyW") {
      e.preventDefault();
      closeApp();
    }

    if (e.ctrlKey && e.code == "KeyN") {
      e.preventDefault();
      if (document.querySelector("[data-newGameModal]").open) {
        document.querySelector("[data-newGameModal]").close();
      } else {
        document.querySelector("[data-newGameModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "KeyM") {
      e.preventDefault();
      if (document.querySelector("[data-newFolderModal]").open) {
        document.querySelector("[data-newFolderModal]").close();
      } else {
        document.querySelector("[data-newFolderModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "KeyL") {
      e.preventDefault();
      if (document.querySelector("[data-notepadModal]").open) {
        document.querySelector("[data-notepadModal]").close();
      } else {
        document.querySelector("[data-notepadModal]").show();
      }
    }

    if (e.ctrlKey && e.code == "KeyR") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "Period") {
      e.preventDefault();
      if (document.querySelector("[data-settingsModal]").open) {
        document.querySelector("[data-settingsModal]").close();
      } else {
        document.querySelector("[data-settingsModal]").show();
      }
    }

    if (e.code == "Escape") {
      document.querySelector("[data-settingsModal]").close();
      document.querySelector("[data-newGameModal]").close();
      document.querySelector("[data-newFolderModal]").close();
      document.querySelector("[data-notepadModal]").close();
      document.querySelector("[data-gamePopup]").close();
      document.querySelector("[data-editGameModal]").close();
      document.querySelector("[data-editFolderModal]").close();
      document.querySelector("#searchInput").blur();
    }

    if (e.ctrlKey && e.code == "Backslash") {
      e.preventDefault();
      toggleSideBar();
      document.querySelector("#searchInput").blur();
    }

    // ? Disabling Misc WebView Shortcuts

    if (e.ctrlKey && e.code == "KeyG") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyP") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyU") {
      e.preventDefault();
    }

    if (e.ctrlKey && e.code == "KeyU") {
      e.preventDefault();
    }
  });

  async function closeApp() {
    invoke("close_app");
  }

  async function toggleSideBar() {
    setSearchValue("");

    setShowSideBar((x) => !x);

    libraryData().userSettings.showSideBar = showSideBar();

    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
    });
  }

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  document.addEventListener("keyup", (e) => {
    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].style.cursor = "grab";
    }

    for (let i = 0; i < document.querySelectorAll(".sideBarGame").length; i++) {
      document.querySelectorAll(".sideBarGame")[i].classList.remove(
        "hint--right",
        "hint--no-animate",

        "hint--no-arrow",
      );
    }

    for (let i = 0; i < document.querySelectorAll(".gameCard").length; i++) {
      document.querySelectorAll(".gameCard")[i].classList.remove(
        "hint--center",
        "hint--no-animate",

        "hint--no-arrow",
      );
    }
  });

  onMount(async () => {
    await getData();
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    invoke("show_window");
  });

  return (
    <>
      {
        // * fading out bg color to make the app loading look a
        // * bit more smoother
      }

      <div className="pointer-events-none items-center justify-center flex loading w-screen h-screen bg-[#121212] absolute z-[1000]">
        <p className=""></p>
      </div>

      {
        // Ignoring the following few lines for build since it doesnt get minified for some reason
        // While working on it remove the "prettier-ignore" comment
        // prettier-ignore 
      }

      <style jsx>{`
button, input, .panelButton { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
.sideBarFolder { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
.titleBarText { font-family: ${fontName() == "Sans Serif" ? "Segoe UI" : fontName() == "Serif" ? "Times New Roman" : "IBM Plex Mono, Consolas"}; }
* { font-family: ${fontName() == "Sans Serif" ? "Helvetica, Arial, sans-serif" : fontName() == "Serif" ? "Times New Roman" : "IBM Plex Mono, Consolas"}; color: ${currentTheme() == "light" ? "#000000" : "#ffffff"}; }
::-webkit-scrollbar-thumb { border-radius: ${roundedBorders() ? "10px" : "0px"}; }
.gameInput { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
.tooltip { border-radius: ${roundedBorders() ? "6px" : "0px"}; }
.currentlyDragging { box-shadow: 0 -3px 0 0 #646464; border-top-left-radius: 0; border-top-right-radius: 0; }
[class*="hint--"]:after { border-radius: ${roundedBorders() ? "6px" : "0px"} }
`}</style>

      {
        // prettier-ignore
      }

      <Toast />

      <div className={`h-full flex gap-[30px] overflow-y-hidden`}>
        <Show when={showSideBar() == false && windowWidth() >= 1000}>
          <svg
            className={`absolute right-[31px] top-[32px] z-20 rotate-180 cursor-pointer hover:bg-[#D6D6D6] dark:hover:bg-[#232323] duration-150 p-2 w-[25.25px] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }]`}
            onClick={toggleSideBar}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 11L1 6L6 1"
              className="stroke-[#000000] dark:stroke-[#ffffff] "
              stroke-opacity="0.5"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 11L6 6L11 1"
              className="stroke-[#000000] dark:stroke-[#ffffff] "
              stroke-opacity="0.5"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Show>
        <Show when={showSideBar() && windowWidth() >= 1000}>
          <SideBar />
        </Show>

        <Show
          when={
            JSON.stringify(libraryData().folders) == "{}" &&
            (searchValue() == "" || searchValue() == undefined)
          }>
          <div
            className={` flex items-center justify-center flex-col w-full absolute h-[100vh]
            overflow-y-scroll py-[20px] pr-[30px]  ${
              showSideBar() && windowWidth() >= 1000
                ? "pl-[23%] large:pl-[17%]"
                : "pl-[30px] large:pl-[30px]"
            }`}>
            <div className="!z-50">
              <p className="dark:text-[#ffffff80] text-[#000000] ">
                {translateText("hey there! thank you so much for using clear")}
                <br />
                <br />-{" "}
                {translateText("add some new games using the sidebar buttons")}
                <br />
                <br />-{" "}
                {translateText(
                  "create new folders and drag and drop your games into them",
                )}
                <br />
                <br />-{" "}
                {translateText("dont forget to check out the settings!")}
              </p>

              <div className="mt-[35px] flex gap-6">
                <button
                  className="standardButton hint--bottom !flex !w-max !gap-3"
                  aria-label={translateText("might not work perfectly!")}
                  onClick={() => {
                    if (steamFolderExists()) {
                      showImportAndOverwriteConfirm()
                        ? importSteamGames()
                        : setShowImportAndOverwriteConfirm(true);

                      setTimeout(() => {
                        setShowImportAndOverwriteConfirm(false);
                      }, 2500);
                    } else {
                      importSteamGames();
                    }
                  }}>
                  <Show when={steamFolderExists() == true}>
                    <Show when={showImportAndOverwriteConfirm() == true}>
                      <span className="text-[#FF3636]">
                        {translateText(
                          "current 'steam' folder will be overwritten. confirm?",
                        )}
                      </span>
                    </Show>
                    <Show when={showImportAndOverwriteConfirm() == false}>
                      {translateText("import steam games")}
                    </Show>
                  </Show>
                  <Show when={steamFolderExists() == false}>
                    {translateText("import steam games")}
                  </Show>

                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.33521 10.141L10.8362 11.166L11.8246 12.667L15.0096 10.3973L11.5683 6.88281"
                      className="fill-[#00000080] dark:fill-[#ffffff80] "
                    />
                    <path
                      d="M15.0827 8.6404C16.0734 8.6404 16.8765 7.83728 16.8765 6.84657C16.8765 5.85586 16.0734 5.05273 15.0827 5.05273C14.0919 5.05273 13.2888 5.85586 13.2888 6.84657C13.2888 7.83728 14.0919 8.6404 15.0827 8.6404Z"
                      className="fill-[#00000080] dark:fill-[#ffffff80] "
                    />
                    <path
                      d="M9.18868 15.0834C10.4624 15.0834 11.495 14.0508 11.495 12.7771C11.495 11.5033 10.4624 10.4707 9.18868 10.4707C7.91492 10.4707 6.88232 11.5033 6.88232 12.7771C6.88232 14.0508 7.91492 15.0834 9.18868 15.0834Z"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="0.695568"
                    />
                    <path
                      d="M1.97681 9.81055L9.11554 12.7759"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="2.92871"
                      stroke-linecap="round"
                    />
                    <path
                      d="M15.0827 9.81149C16.7204 9.81149 18.0481 8.48388 18.0481 6.84618C18.0481 5.20848 16.7204 3.88086 15.0827 3.88086C13.445 3.88086 12.1174 5.20848 12.1174 6.84618C12.1174 8.48388 13.445 9.81149 15.0827 9.81149Z"
                      className="stroke-[#00000080] dark:stroke-[#ffffff80] "
                      stroke-width="1.17148"
                    />
                  </svg>
                </button>

                <div
                  className={`standardButton flex !justify-between items-center cursor-pointer relative !w-max !p-4 rounded-[${
                    roundedBorders() ? "6px" : "0px"
                  }]`}
                  onClick={() => {
                    setShowLanguageSelector((x) => !x);
                  }}>
                  <div className="w-full">
                    <span className="dark:text-[#ffffff80] text-[#12121280]">
                      [{translateText("language")}]
                    </span>
                    &nbsp;{" "}
                    {language() == "en"
                      ? "english"
                      : language() == "jp"
                      ? "日本語"
                      : language() == "es"
                      ? "español"
                      : language() == "hi"
                      ? "हिंदी"
                      : language() == "ru"
                      ? "русский"
                      : language() == "fr"
                      ? "français"
                      : "english"}
                  </div>

                  <Show when={showLanguageSelector()}>
                    <div
                      className={`flex flex-col gap-4 absolute border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
                        roundedBorders() ? "6px" : "0px"
                      }] p-3 z-[100000] top-[120%] left-0`}>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                        onClick={() => {
                          changeLanguage("en");
                        }}>
                        english
                      </div>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                        onClick={() => {
                          changeLanguage("jp");
                        }}>
                        日本語 [japanese]
                      </div>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                        onClick={() => {
                          changeLanguage("es");
                        }}>
                        español [spanish]
                      </div>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150"
                        onClick={() => {
                          changeLanguage("hi");
                        }}>
                        हिंदी [hindi]
                      </div>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75"
                        onClick={() => {
                          changeLanguage("ru");
                        }}>
                        русский [russian]
                      </div>
                      <div
                        className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75"
                        onClick={() => {
                          changeLanguage("fr");
                        }}>
                        français [french]
                      </div>
                    </div>
                  </Show>
                </div>
              </div>

              <div className="grid grid-cols-2 mt-[35px] gap-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + n
                  </div>

                  {translateText("new game")}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + .
                  </div>
                  {translateText("open settings")}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + m
                  </div>

                  {translateText("new folder")}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + l
                  </div>

                  {translateText("open notepad")}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + w
                  </div>

                  {translateText("close app")}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    escape
                  </div>

                  {translateText("close dialogs")}
                </div>
              </div>

              <div className="grid mt-[35px] gap-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + f
                  </div>

                  {translateText("search bar")}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + \\
                  </div>

                  {translateText("hide sidebar")}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280] rounded-[${
                      roundedBorders() ? "6px" : "0px"
                    }] `}>
                    ctrl + click
                  </div>

                  {translateText("quick open game")}
                </div>
              </div>
            </div>
          </div>
        </Show>
        <div
          className={`w-full absolute h-[100vh] overflow-y-scroll py-[20px] pr-[30px]  ${
            showSideBar() && windowWidth() >= 1000
              ? "pl-[23%] large:pl-[17%]"
              : "pl-[30px] large:pl-[30px]"
          }`}>
          <Show when={searchValue() == "" || searchValue() == undefined}>
            <For each={currentFolders()}>
              {(folderName) => {
                let folder = libraryData().folders[folderName];

                return (
                  <Show when={folder.games != "" && !folder.hide}>
                    <div className="mb-[40px]">
                      <Show when={folderTitle()}>
                        <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                          {folder.name}
                        </p>
                      </Show>
                      <div
                        className={`grid gap-5 mt-4 foldersDiv
                        ${
                          zoomLevel() == 0
                            ? showSideBar()
                              ? "medium:grid-cols-5 grid-cols-4 large:grid-cols-7"
                              : "medium:grid-cols-6 grid-cols-4 large:grid-cols-8"
                            : zoomLevel() == 1
                            ? showSideBar()
                              ? "medium:grid-cols-4 grid-cols-3 large:grid-cols-6"
                              : "medium:grid-cols-5 grid-cols-3 large:grid-cols-7"
                            : zoomLevel() == 2
                            ? showSideBar()
                              ? "medium:grid-cols-3 grid-cols-2 large:grid-cols-5"
                              : "medium:grid-cols-4 grid-cols-2 large:grid-cols-6"
                            : ""
                        }
                        `}>
                        <For each={folder.games}>
                          {(gameName) => {
                            return (
                              <div
                                className="relative w-full bg-transparent cursor-pointer gameCard group"
                                aria-label={translateText("play")}
                                onDragStart={(e) => {
                                  e.preventDefault();
                                }}
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
                                    .show();
                                }}>
                                <Show
                                  when={
                                    !libraryData().games[gameName].favourite
                                  }>
                                  <div className="relative w-full">
                                    <Show
                                      when={
                                        libraryData().games[gameName].gridImage
                                      }>
                                      <div className="relative flex items-center justify-center">
                                        <Show when={!gameTitle()}>
                                          <Show
                                            when={
                                              !libraryData().games[gameName]
                                                .location
                                            }>
                                            <span class="absolute tooltip z-[100] bottom-[30px]">
                                              {translateText("no game file")}
                                            </span>
                                          </Show>
                                        </Show>

                                        <img
                                          className={`z-10 mb-[7px] rounded-[${
                                            roundedBorders() ? "6px" : "0px"
                                          }] group-hover:outline-[#0000001f] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                          src={convertFileSrc(
                                            appDataDirPath() +
                                              "grids\\" +
                                              libraryData().games[gameName]
                                                .gridImage,
                                          )}
                                          alt=""
                                        />
                                      </div>
                                    </Show>
                                    <Show
                                      when={
                                        !libraryData().games[gameName].gridImage
                                      }>
                                      <div className="relative flex items-center justify-center">
                                        <Show when={!gameTitle()}>
                                          <span className="!max-w-[50%] absolute z-[100]">
                                            {gameName}
                                          </span>

                                          <Show
                                            when={
                                              !libraryData().games[gameName]
                                                .location
                                            }>
                                            <span class="absolute tooltip z-[100] bottom-[30px]">
                                              {translateText("no game file")}
                                            </span>
                                          </Show>
                                        </Show>

                                        <div
                                          className={`z-10 mb-[7px] rounded-[${
                                            roundedBorders() ? "6px" : "0px"
                                          }] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] bg-[#F1F1F1]  w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                          alt=""
                                        />
                                      </div>
                                    </Show>
                                  </div>
                                </Show>
                                <Show
                                  when={
                                    libraryData().games[gameName].favourite
                                  }>
                                  <div className="relative w-full">
                                    <Show
                                      when={
                                        libraryData().games[gameName].gridImage
                                      }>
                                      <img
                                        className={`relative z-10 mb-[7px] rounded-[${
                                          roundedBorders() ? "6px" : "0px"
                                        }] outline-[#0000001c] hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                        src={convertFileSrc(
                                          appDataDirPath() +
                                            "grids\\" +
                                            libraryData().games[gameName]
                                              .gridImage,
                                        )}
                                        alt=""
                                        width="100%"
                                      />
                                    </Show>
                                    <Show
                                      when={
                                        !libraryData().games[gameName].gridImage
                                      }>
                                      <div className="relative flex items-center justify-center">
                                        <Show when={!gameTitle()}>
                                          <span className="absolute z-[100] !max-w-[50%]">
                                            {gameName}
                                          </span>

                                          <Show
                                            when={
                                              !libraryData().games[gameName]
                                                .location
                                            }>
                                            <span class="absolute tooltip z-[100] bottom-[30px]">
                                              {translateText("no game file")}
                                            </span>
                                          </Show>
                                        </Show>
                                        <div
                                          className={`relative z-10 mb-[7px] rounded-[${
                                            roundedBorders() ? "6px" : "0px"
                                          }] outline-[#0000001c] w-full aspect-[2/3] dark:bg-[#1C1C1C] bg-[#F1F1F1]  hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                        />
                                      </div>
                                    </Show>
                                    <div className="absolute inset-0 dark:blur-[30px]  dark:group-hover:blur-[50px] duration-500 dark:bg-blend-screen ">
                                      <img
                                        className="absolute inset-0 duration-500 opacity-0 dark:opacity-[40%] dark:group-hover:opacity-60"
                                        src={convertFileSrc(
                                          appDataDirPath() +
                                            "grids\\" +
                                            libraryData().games[gameName]
                                              .gridImage,
                                        )}
                                        alt=""
                                      />
                                      <div
                                        className="dark:bg-[#fff] bg-[#000]  opacity-[0%] dark:opacity-[10%] w-full aspect-[2/3]"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </Show>
                                <Show when={gameTitle()}>
                                  <div className="flex justify-between items-start">
                                    <Show
                                      when={
                                        libraryData().games[gameName].location
                                      }>
                                      <span className="text-[#000000] dark:text-white">
                                        {gameName}
                                      </span>
                                    </Show>

                                    <Show
                                      when={
                                        !libraryData().games[gameName].location
                                      }>
                                      <span className="text-[#000000] dark:text-white !max-w-[50%]">
                                        {gameName}
                                      </span>

                                      <span class=" tooltip z-[100]">
                                        {translateText("no game file")}
                                      </span>
                                    </Show>
                                  </div>
                                </Show>
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
          </Show>

          <Show when={searchValue() != "" && searchValue() != undefined}>
            {() => {
              let searchResults = [];
              let allGameNames = [];

              if (searchValue() != "" && searchValue() != undefined) {
                for (
                  let i = 0;
                  i < Object.values(libraryData().games).length;
                  i++
                ) {
                  allGameNames.push(Object.keys(libraryData().games)[i]);
                }
              }

              let fuse = new Fuse(Object.values(libraryData().games), {
                threshold: 0.5,
                keys: ["name"],
              });

              for (let i = 0; i < fuse.search(searchValue()).length; i++) {
                searchResults.push(fuse.search(searchValue())[i].item["name"]);
              }

              return (
                <div>
                  <div className="grid grid-cols-3 gap-5 mt-4 medium:grid-cols-4 large:grid-cols-6 foldersDiv">
                    <For each={searchResults}>
                      {(gameName) => {
                        return (
                          <div
                            className="relative w-full bg-transparent cursor-pointer gameCard group"
                            aria-label={translateText("play")}
                            onDragStart={(e) => {
                              e.preventDefault();
                            }}
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
                              document.querySelector("[data-gamePopup]").show();
                            }}>
                            <Show
                              when={!libraryData().games[gameName].favourite}>
                              <div className="relative w-full">
                                <Show
                                  when={
                                    libraryData().games[gameName].gridImage
                                  }>
                                  <img
                                    className={`z-10 mb-[7px] rounded-[${
                                      roundedBorders() ? "6px" : "0px"
                                    }] group-hover:outline-[#0000001f] w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                    src={convertFileSrc(
                                      appDataDirPath() +
                                        "grids\\" +
                                        libraryData().games[gameName].gridImage,
                                    )}
                                    alt=""
                                  />{" "}
                                </Show>
                                <Show
                                  when={
                                    !libraryData().games[gameName].gridImage
                                  }>
                                  <div className="relative flex items-center justify-center">
                                    <Show when={!gameTitle()}>
                                      <span className="absolute z-[100] !max-w-[50%]">
                                        {gameName}
                                      </span>

                                      <Show
                                        when={
                                          !libraryData().games[gameName]
                                            .location
                                        }>
                                        <span class="absolute tooltip z-[100] bottom-[30px]">
                                          {translateText("no game file")}
                                        </span>
                                      </Show>
                                    </Show>

                                    <div
                                      className={`z-10 mb-[7px] rounded-[${
                                        roundedBorders() ? "6px" : "0px"
                                      }] group-hover:outline-[#0000001f] dark:bg-[#1C1C1C] bg-[#F1F1F1]  w-full aspect-[2/3] relative dark:group-hover:outline-[#ffffff1f] group-hover:outline-[2px] group-hover:outline-none`}
                                      alt=""
                                    />
                                  </div>
                                </Show>
                              </div>
                            </Show>
                            <Show
                              when={libraryData().games[gameName].favourite}>
                              <Show
                                when={libraryData().games[gameName].gridImage}>
                                <img
                                  className={`relative z-10 mb-[7px] rounded-[${
                                    roundedBorders() ? "6px" : "0px"
                                  }] outline-[#0000001c] w-full aspect-[2/3] hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                  src={convertFileSrc(
                                    appDataDirPath() +
                                      "grids\\" +
                                      libraryData().games[gameName].gridImage,
                                  )}
                                  alt=""
                                  width="100%"
                                />
                              </Show>

                              <Show
                                when={!libraryData().games[gameName].gridImage}>
                                <div className="relative flex items-center justify-center">
                                  <Show when={!gameTitle()}>
                                    <span className="absolute z-[100] !max-w-[50%]">
                                      {gameName}
                                    </span>

                                    <Show
                                      when={
                                        !libraryData().games[gameName].location
                                      }>
                                      <span class="absolute tooltip z-[100] bottom-[30px]">
                                        {translateText("no game file")}
                                      </span>
                                    </Show>
                                  </Show>
                                  <div
                                    className={`relative z-10 mb-[7px] rounded-[${
                                      roundedBorders() ? "6px" : "0px"
                                    }] outline-[#0000001c] w-full aspect-[2/3] dark:bg-[#1C1C1C] bg-[#F1F1F1]  hover:outline-[#0000003b] dark:outline-[#ffffff1a] dark:group-hover:outline-[#ffffff3b] dark:outline-[2px] outline-[4px] outline-none duration-200`}
                                  />
                                </div>
                              </Show>
                              <div className="absolute inset-0 dark:blur-[30px]  dark:group-hover:blur-[50px] duration-500 dark:bg-blend-screen ">
                                <img
                                  className="absolute inset-0 duration-500 opacity-0 dark:opacity-[40%] dark:group-hover:opacity-60"
                                  src={convertFileSrc(
                                    appDataDirPath() +
                                      "grids\\" +
                                      libraryData().games[gameName].gridImage,
                                  )}
                                  alt=""
                                />
                                <div
                                  className="dark:bg-[#fff] bg-[#000]  opacity-[0%] dark:opacity-[10%] w-full aspect-[2/3]"
                                  alt=""
                                />
                              </div>
                            </Show>

                            <Show when={gameTitle()}>
                              <div className="flex justify-between items-start">
                                <span className="text-[#000000] dark:text-white !max-w-[50%]">
                                  {gameName}
                                </span>

                                <Show
                                  when={
                                    !libraryData().games[gameName].location
                                  }>
                                  <span class=" tooltip z-[100]">
                                    {translateText("no game file")}
                                  </span>
                                </Show>
                              </div>
                            </Show>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                  <div className="items-center">
                    <Show when={searchResults == ""}>
                      <div className="flex items-center  justify-center w-full h-[calc(100vh-100px)] gap-3 align-middle">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.04819 12H8.44444L10.2222 14H13.7778L15.5556 12H20.9361M6.70951 5.4902L3.27942 11.2785C3.09651 11.5871 3 11.9393 3 12.2981V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12.2981C21 11.9393 20.9035 11.5871 20.7206 11.2785L17.2905 5.4902C17.1104 5.18633 16.7834 5 16.4302 5H7.5698C7.21659 5 6.88958 5.18633 6.70951 5.4902Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"></path>
                        </svg>

                        {translateText("no games found")}
                      </div>
                    </Show>
                  </div>
                </div>
              );
            }}
          </Show>
        </div>
      </div>

      <div id="abovePage">
        <NewGame />
        <EditGame />
        <NewFolder />
        <EditFolder />
        <GamePopUp />
        <Notepad />
        <Settings />
        <Loading />
      </div>
    </>
  );
}

export default App;
