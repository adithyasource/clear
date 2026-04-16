import { produce } from "solid-js/store";
import { setLibraryData } from "@/stores/libraryStore";
import { writeUpdateData } from "./libraryService";
import { setSelectedFolder } from "../stores/selectedFolderStore";
import { batch } from "solid-js";

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

  await writeUpdateData();
}

export async function updateFolder({ folderIndex, newName, newHide }) {
  setLibraryData(
    produce((data) => {
      if (newName) {
        data.folders[folderIndex].name = newName;
      }

      if (newHide !== undefined) {
        data.folders[folderIndex].hide = newHide;
      }

      return data;
    }),
  );

  await writeUpdateData();
}

export async function deleteFolder({ folderIndex }) {
  setLibraryData(
    produce((data) => {
      data.folders.splice(folderIndex, 1);
    }),
  );

  await writeUpdateData();
}
