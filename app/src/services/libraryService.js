import { dataFileRead, dataFileWrite } from "@/data/storage/fileStorage.js";
import { triggerToast } from "@/Globals.jsx";
import { libraryData, setLibraryData } from "@/stores/libraryStore.js";

export async function getData() {
  let data;
  try {
    data = await dataFileRead();

    setLibraryData(data);
    console.log("data fetched");

    // if (libraryData.userSettings.currentTheme === "light") {
    //   document.documentElement.classList.remove("dark");
    // } else {
    //   document.documentElement.classList.add("dark");
    // }

    return data;
  } catch (err) {
    triggerToast(err);
  }
}

export async function writeUpdateData() {
  console.log(libraryData);
  await dataFileWrite(libraryData);
}
