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
  language,
} from "../Signals";

import { Show } from "solid-js";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData, translateText } from "../App";
import { Close, SaveDisk } from "../components/Icons";

export function NewFolder() {
  async function addFolder() {
    if (folderName() == "" || folderName() == undefined) {
      setShowToast(true);
      setToastMessage(translateText("no folder name"));
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    for (let x = 0; x < Object.keys(libraryData().folders).length; x++) {
      if (folderName() == Object.keys(libraryData().folders)[x]) {
        setShowToast(true);
        setToastMessage(
          folderName() + " " + translateText("is already in your library"),
        );
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
      ref={(ref) => {
        const focusableElements = ref.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTab(e) {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }

        ref.addEventListener("keydown", handleTab);

        ref.addEventListener("close", () => {
          previouslyFocusedElement.focus();
        });
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
            roundedBorders() ? "6px" : "0px"
          }] w-[50%] p-6 `}>
          <div
            className={`flex justify-between ${
              language() != "en" ? "flex-col large:flex-row" : ""
            } `}>
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                {translateText("add new folder")}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setHideFolder((hideFolder) => !hideFolder);
                }}
                className="relative cursor-pointer">
                <Show when={hideFolder()}>
                  <div className="relative">
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      {translateText("hide in expanded view")}
                    </div>
                  </div>
                </Show>
                <Show when={!hideFolder()}>
                  <div className="">
                    {translateText("hide in expanded view")}
                  </div>
                </Show>
              </button>
              <button
                onClick={addFolder}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                {translateText("save")}
                <SaveDisk />
              </button>
              <button
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-newFolderModal]").close();
                  getData();
                }}>
                ​
                <Close />
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
              placeholder={translateText("name of folder")}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
