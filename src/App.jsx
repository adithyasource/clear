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
import * as fs from "@tauri-apps/api/fs";

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
  setGamesDivLeftPadding,
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

  setFontName(libraryData().userSettings.fontName || "Sans Serif");

  document.documentElement.classList.add("dark");

  if (currentTheme() == "light") {
    document.documentElement.classList.remove("dark");
    setGamesDivLeftPadding("10px");
  } else {
    document.documentElement.classList.add("dark");
    setGamesDivLeftPadding("10px");
  }

  try {
    setGamesDivLeftPadding("23%");
    setShowSideBar(libraryData().userSettings.showSideBar || true);
  } catch (error) {
    setGamesDivLeftPadding("30px");
    setShowSideBar(false);
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
  await fs.writeBinaryFile(name, integerBytesList, {
    dir: BaseDirectory.AppData,
  });
}

export async function importSteamGames() {
  document.querySelector("[data-loadingModal]").show();

  await fetch("https://clear-api.vercel.app/?version=a")
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

        console.log(Object.keys(steamData.libraryfolders[1].apps));

        let steamGameIds = Object.keys(steamData.libraryfolders[1].apps);

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
        ).then(() => {
          getData();

          steamGameIds.forEach(async (steamId) => {
            await fetch(
              `https://clear-api.vercel.app/?steamID=${steamId}`,
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
                  `https://clear-api.vercel.app/?limitedAssets=${gameId}`,
                )
                  .then((res) =>
                    res.json().then(async (jsonres) => {
                      console.log(jsonres.grid);
                      console.log(jsonres.hero);
                      console.log(jsonres.logo);

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

                      libraryData().folders["steam"] = {
                        name: "steam",
                        hide: false,
                        games: allGameNames,
                        index: currentFolders().length,
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
                      ).then(() => {
                        setTimeout(() => {
                          getData();
                          document.querySelector("[data-loadingModal]").close();
                          document
                            .querySelector("[data-settingsModal]")
                            .close();
                        }, 3000);
                      });
                    }),
                  )
                  .catch((err) => {
                    console.log("no assets found at all for " + name);
                  });
              }),
            );
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

    libraryData().userSettings.showSideBar == undefined
      ? (libraryData().userSettings.showSideBar = false)
      : (libraryData().userSettings.showSideBar =
          !libraryData().userSettings.showSideBar);

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
                <br />-
                {translateText("add some new games using the sidebar buttons")}
                <br />
                <br />-
                {translateText(
                  "create new folders and drag and drop your games into them",
                )}
                <br />
                <br />-{translateText("dont forget to check out the settings!")}
              </p>

              <div>
                <button
                  className="standardButton mt-[35px] hint--bottom !flex !w-max !gap-3"
                  aria-label={"might not work perfectly!"}
                  onClick={() => {
                    if (steamFolderExists()) {
                      console.log("wh");
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
                      {translateText(
                        "current 'steam' folder will be overwritten. confirm?",
                      )}
                    </Show>
                    <Show when={showImportAndOverwriteConfirm() == false}>
                      {translateText("import steam games")}
                    </Show>
                  </Show>
                  <Show when={steamFolderExists() == false}>
                    {translateText("import steam games")}
                  </Show>

                  <svg
                    width="23"
                    height="14"
                    viewBox="0 0 23 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.3494 2.47291C19.5218 2.47291 20.4722 3.42332 20.4722 4.59569C20.4722 5.76806 19.5218 6.71847 18.3494 6.71847C17.177 6.71847 16.2266 5.76806
                      16.2266 4.59569C16.2266 3.42332 17.177 2.47291 18.3494 2.47291ZM2.97193 2.47286C4.61328 2.47286 5.94386 3.80344 5.94386 5.44479L5.92767 5.75653L10.6125
                      8.16922C11.1109 7.79163 11.7321 7.56762 12.4055 7.56762L14.5284 4.59569C14.5284 2.48541 16.239 0.774658 18.3494 0.774658C20.4597 0.774658 22.1704 2.48541
                      22.1704 4.59569C22.1704 6.70597 20.4597 8.41672 18.3494 8.41672L15.3775 10.5395C15.3775 12.1809 14.0469 13.5114 12.4055 13.5114C10.7642 13.5114 9.43366
                      12.1809 9.43366 10.5395C9.43366 10.5023 9.4343 10.4653 9.43569 10.4284L4.59494 7.93481C4.12832 8.23959 3.5708 8.41672 2.97193 8.41672C1.33058 8.41672
                      0 7.08614 0 5.44479C0 3.80344 1.33058 2.47286 2.97193 2.47286ZM13.2874 9.55643C13.9141 9.87579 14.1634 10.6428 13.844 11.2695C13.5247 11.8963 12.7577
                      12.1455 12.131 11.8261L10.3102 10.8819C10.4739 11.8915 11.3497 12.6623 12.4055 12.6623C13.578 12.6623 14.5284 11.7119 14.5284 10.5395C14.5284 9.36712
                      13.5779 8.41672 12.4055 8.41672C12.0775 8.41672 11.7668 8.49116 11.4895 8.62405L13.2874 9.55643ZM2.97193 3.32201C1.79956 3.32201 0.849154 4.27242 0.849154
                      5.44479C0.849154 6.61716 1.79956 7.56757 2.97193 7.56757C3.21433 7.56757 3.44724 7.52697 3.66422 7.45216L2.25486 6.72126C1.62811 6.4019 1.3789 5.63496
                      1.69825 5.0082C2.01761 4.38144 2.78455 4.13223 3.41136 4.45159L5.09128 5.32278C5.02805 4.20715 4.10333 3.32201 2.97193 3.32201ZM18.3494 1.62376C16.708
                      1.62376 15.3775 2.95433 15.3775 4.59569C15.3775 6.23704 16.708 7.56762 18.3494 7.56762C19.9907 7.56762 21.3213 6.23704 21.3213 4.59569C21.3213 2.95433
                      19.9907 1.62376 18.3494 1.62376Z"
                      className="fill-[#00000080] dark:fill-[#ffffff80] "
                    />
                  </svg>
                </button>
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
                            showSideBar()
                              ? "medium:grid-cols-4 grid-cols-3 large:grid-cols-6"
                              : "medium:grid-cols-5 grid-cols-3 large:grid-cols-7"
                          }`}>
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
