import {
  libraryData,
  selectedFolder,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
  permissionGranted,
  setPermissionGranted,
} from "../Signals";
import { For, Show, createSignal, onMount } from "solid-js";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import {
  writeTextFile,
  BaseDirectory,
  readTextFile,
  copyFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";

import { exit } from "@tauri-apps/api/process";

import { getData } from "../App";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

import { appDataDir } from "@tauri-apps/api/path";

import { open } from "@tauri-apps/api/dialog";

export function EditFolder() {
  async function editFolder() {
    console.log("oldfoldername" + selectedFolder().name);
    console.log("oldfodlerhide" + selectedFolder().hide);
    console.log(editedFolderName());
    console.log(editedHideFolder());

    delete libraryData().folders[selectedFolder().name];

    libraryData().folders[editedFolderName()] = {
      ...selectedFolder(),
      name: editedFolderName(),
      hide: editedHideFolder(),
    };

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData(), null, 1),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
    });
  }
  return (
    <dialog data-editFolderModal onClose={() => {}}>
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
