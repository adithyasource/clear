import { produce } from "solid-js/store";
import { dataFileWrite } from "../data/storage/fileStorage";
import { libraryData, setLibraryData } from "../stores/libraryStore";

export async function addFolder({ name, hide }) {
  if (!name) {
    throw new Error("no folder name");
  }

  // for (const name of Object.keys(globalContext.libraryData.folders)) {
  //   if (folderName() === name) {
  //     folderNameAlreadyExists = true;
  //   }
  // }
  //
  // if (folderNameAlreadyExists) {
  //   triggerToast(`${folderName()} ${translateText("is already in your library")}`);
  //   return;
  // }

  setLibraryData(
    produce((data) =>
      data.folders.push({
        name,
        hide,
        games: [],
      }),
    ),
  );

  console.log(JSON.stringify(libraryData.folders));

  dataFileWrite(libraryData);
}
