import { produce } from "solid-js/store";
import { dataFileWrite } from "@/data/storage/fileStorage";
import { libraryData, setLibraryData } from "@/stores/libraryStore";

export async function addFolder({ name, hide }) {
  if (!name) {
    throw new Error("no folder name");
  }

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
