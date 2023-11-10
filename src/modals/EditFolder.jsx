import {
  libraryData,
  selectedFolder,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
} from "../Signals";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData } from "../App";

export function EditFolder() {
  async function editFolder() {
    delete libraryData().folders[selectedFolder().name];

    libraryData().folders[editedFolderName()] = {
      ...selectedFolder(),
      name: editedFolderName(),
      hide: editedHideFolder(),
    };

    await writeTextFile(
      {
        path: "lib.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
    });
  }
  return (
    <dialog
      data-editFolderModal
      onClose={() => {}}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#ffffff66]">
      <button
        onClick={() => {
          document.querySelector("[data-editFolderModal]").close();
          getData();
        }}>
        close
      </button>

      <br />
      <input
        type="text"
        name=""
        id=""
        onInput={(e) => {
          setEditedFolderName(e.currentTarget.value);
        }}
        placeholder="name of folder"
        value={selectedFolder().name}
      />
      <input
        type="checkbox"
        checked={selectedFolder().hide}
        onInput={() => {
          setEditedHideFolder((x) => !x);
        }}
      />
      <button onClick={editFolder}>save</button>
    </dialog>
  );
}
