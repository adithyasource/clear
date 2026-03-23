import { dataFileRead } from "../data/storage/fileStorage.js";
import { triggerToast } from "../Globals.jsx";
import { setLibraryData } from "../stores/libraryStore.js";

export async function getData() {
  let libraryData;
  try {
    libraryData = await dataFileRead();

    setLibraryData(libraryData);
    console.log("data fetched");
  } catch (err) {
    triggerToast(err);
  }

  // if (libraryData.userSettings.currentTheme === "light") {
  //   document.documentElement.classList.remove("dark");
  // } else {
  //   document.documentElement.classList.add("dark");
  // }

  return libraryData;
}
