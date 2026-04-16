import { setLibraryData } from "@/stores/libraryStore";
import { writeUpdateData } from "./libraryService";

export async function updateNotepadData(newData) {
  try {
    setLibraryData("notepad", newData);

    await writeUpdateData();
  } catch (e) {
    throw new Error(`error updating notepad data: ${e.message}`, { cause: e });
  }
}
