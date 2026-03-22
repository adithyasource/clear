import { appDataDir } from "@tauri-apps/api/path";
import { dataFileExists } from "../data/storage/fileStorage.ts";
import { dataFileRead } from "../data/storage/fileStorage.ts";
import { triggerToast } from "../Globals.jsx";
import { setLibraryData } from "../stores/libraryStore.js";

export async function getData() {
  let libraryData;
  try {
    libraryData = dataFileRead();
    setLibraryData(libraryData);
  } catch (err) {
    triggerToast(err);
  }

  // if (libraryData.userSettings.currentTheme === "light") {
  //   document.documentElement.classList.remove("dark");
  // } else {
  //   document.documentElement.classList.add("dark");
  // }

  console.log("data fetched");

  return libraryData;
}

export async function updateData() {
  await writeTextFile("data.json", JSON.stringify(libraryData, null, 4), {
    baseDir: BaseDirectory.AppData,
  }).then(getData());
}

export async function addGame({ name, gridImage, heroImage, logoImage, iconImage }) {}
