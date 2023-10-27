import {
  libraryData,
  setLibraryData,
  folderName,
  setFolderName,
  hideFolder,
  setHideFolder,
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

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";

import { appDataDir } from "@tauri-apps/api/path";

import { open } from "@tauri-apps/api/dialog";

export function NewFolder() {
  async function addFolder() {
    libraryData().folders[folderName()] = {
      name: folderName(),
      hide: hideFolder(),
      games: [],
    };
    setLibraryData(libraryData());
    //
    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData(), null, 1),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      location.reload();
    });
  }

  return (
    <dialog data-newFolderModal onClose={() => {}}>
      <button
        onClick={() => {
          document.querySelector("[data-newFolderModal]").close();
          location.reload();
        }}>
        close
      </button>

      <br />
      <input
        type="text"
        name=""
        id=""
        onInput={(e) => {
          setFolderName(e.currentTarget.value);
        }}
        placeholder="name of folder"
      />
      <input
        type="checkbox"
        onInput={() => {
          setHideFolder(!hideFolder());
        }}
      />
      <button onClick={addFolder}>save</button>
    </dialog>
  );
}
