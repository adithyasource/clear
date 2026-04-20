import { setLibraryData } from "../stores/libraryStore";
import { writeUpdateData } from "./libraryService";

export async function toggleSideBar() {
  setLibraryData("userSettings", "showSideBar", (x) => !x);

  await writeUpdateData();
}
