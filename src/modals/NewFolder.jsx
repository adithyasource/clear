import {
  libraryData,
  setLibraryData,
  folderName,
  setFolderName,
  hideFolder,
  setHideFolder,
  permissionGranted,
  setPermissionGranted,
  currentFolders,
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

export function NewFolder() {
  async function addFolder() {
    libraryData().folders[folderName()] = {
      name: folderName(),
      hide: hideFolder(),
      games: [],
      index: currentFolders().length,
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
      getData();
    });
  }

  return (
    <dialog data-newFolderModal onClose={() => {}} className="">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div className="modalWindow w-[50%]  rounded-[6px] p-6">
          <div className="flex justify-between">
            <div>
              <h1>add new game</h1>
            </div>
            <div className="flex gap-3 ">
              <button
                onClick={addFolder}
                className="flex items-center gap-1 functionalInteractables ">
                save
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M7 3V8H15V3"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M7 21V15H17V21"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              <button
                className="flex items-center functionalInteractables"
                onClick={() => {
                  document.querySelector("[data-newFolderModal]").close();
                  getData();
                }}>
                ​
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L11 10.3369M1 10.3369L11 1"
                    stroke="#FF3636"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-end gap-6 mt-6">
            <input
              type="text"
              name=""
              id=""
              className=""
              onInput={(e) => {
                setFolderName(e.currentTarget.value);
              }}
              placeholder="name of folder"
            />

            <div
              onClick={() => {
                setHideFolder((hideFolder) => !hideFolder);
              }}
              className="relative">
              <Show when={hideFolder()}>
                <div className="relative">
                  <div className="">hide in expanded view</div>
                  <div className="absolute blur-[5px] opacity-70 inset-0">
                    hide in expanded view
                  </div>
                </div>
              </Show>
              <Show when={!hideFolder()}>
                <div className="">hide in expanded view</div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
