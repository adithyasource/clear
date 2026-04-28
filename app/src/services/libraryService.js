import { dataFileRead, dataFileWrite } from "@/data/storage/fileStorage.js";
import { libraryData, setLibraryData } from "@/stores/libraryStore.js";
import { logError } from "@/utils/errorHandling";

export async function getData() {
  try {
    const data = await dataFileRead();

    setLibraryData(data);
    console.log("data fetched");

    return data;
  } catch (err) {
    await logError("libraryService.getData", err);
    throw new Error("failed to load library data", { cause: err });
  }
}

export async function writeUpdateData() {
  console.log(libraryData);

  try {
    await dataFileWrite(libraryData);
  } catch (err) {
    await logError("libraryService.writeUpdateData", err);
    throw new Error("failed to save library data", { cause: err });
  }
}
