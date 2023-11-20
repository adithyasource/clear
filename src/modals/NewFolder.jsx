import {
  libraryData,
  setLibraryData,
  folderName,
  setFolderName,
  hideFolder,
  setHideFolder,
  currentFolders,
  roundedBorders,
  setShowToast,
  setToastMessage,
} from "../Signals";

import { Show } from "solid-js";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData } from "../App";

export function NewFolder() {
  async function addFolder() {
    if (folderName() == "" || folderName() == undefined) {
      setShowToast(true);
      setToastMessage("no folder name");
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    for (let x = 0; x < Object.keys(libraryData().folders).length; x++) {
      if (folderName() == Object.keys(libraryData().folders)[x]) {
        setShowToast(true);
        setToastMessage(`${folderName()} is already in your library`);
        setTimeout(() => {
          setShowToast(false);
        }, 1500);
        return;
      }
    }

    libraryData().folders[folderName()] = {
      name: folderName(),
      hide: hideFolder(),
      games: [],
      index: currentFolders().length,
    };
    setLibraryData(libraryData());
    await writeTextFile(
      {
        path: "data.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
      document.querySelector("[data-newFolderModal]").close();
    });
  }

  return (
    <dialog
      data-newFolderModal
      onClose={() => {
        setFolderName(undefined);
        setHideFolder(undefined);
        getData();
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
            roundedBorders() ? "6px" : "0px"
          }] w-[50%] p-6 `}>
          <div className="flex justify-between">
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                add new folder
              </p>
            </div>
            <div className="flex items-center gap-5">
              <div
                onClick={() => {
                  setHideFolder((hideFolder) => !hideFolder);
                }}
                className="relative cursor-pointer">
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
              <button
                onClick={addFolder}
                className="flex items-center standardButton !w-max">
                save
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                    className="stroke-black dark:stroke-white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M7 3V8H15V3"
                    className="stroke-black dark:stroke-white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                  <path
                    d="M7 21V15H17V21"
                    className="stroke-black dark:stroke-white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              <button
                className="flex items-center standardButton !w-max !gap-0"
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
              aria-autocomplete="none"
              type="text"
              name=""
              id=""
              className="w-full dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                setFolderName(e.currentTarget.value);
              }}
              value={folderName() || ""}
              placeholder="name of folder"
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
