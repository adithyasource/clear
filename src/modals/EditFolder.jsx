import {
  libraryData,
  selectedFolder,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
  showDeleteConfirm,
  setShowDeleteConfirm,
  setShowToast,
  setToastMessage,
  setLibraryData,
} from "../Signals";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData, translateText, updateData } from "../App";
import { Close, SaveDisk, TrashDelete } from "../components/Icons";
import { produce } from "solid-js/store";

export function EditFolder() {
  async function editFolder() {
    if (editedFolderName() == "") {
      setShowToast(true);
      setToastMessage(translateText("no folder name"));
      setTimeout(() => {
        setShowToast(false);
      }, 1500);
      return;
    }

    if (selectedFolder().name != editedFolderName()) {
      let folderOccurances = 0;

      for (let x = 0; x < Object.keys(libraryData.folders).length; x++) {
        if (editedFolderName() == Object.keys(libraryData.folders)[x]) {
          folderOccurances += 1;
        }
      }

      if (folderOccurances == 1) {
        setShowToast(true);
        setToastMessage(
          editedFolderName() +
            " " +
            translateText("is already in your library"),
        );
        setTimeout(() => {
          setShowToast(false);
        }, 1500);
        return;
      }
    }

    setLibraryData(
      produce((data) => {
        delete data.folders[selectedFolder().name];

        return data;
      }),
    );

    setLibraryData(
      produce((data) => {
        data.folders[editedFolderName()] = {
          ...selectedFolder(),
          name: editedFolderName(),
          hide: editedHideFolder(),
        };

        return data;
      }),
    );

    await updateData();

    getData();

    document.querySelector("[data-editFolderModal]").close();
  }

  async function deleteFolder() {
    for (let x = 0; x < Object.keys(libraryData.folders).length; x++) {
      if (x > libraryData.folders[selectedFolder().name].index) {
        setLibraryData(
          produce((data) => {
            Object.values(data.folders)[x].index -= 1;

            return data;
          }),
        );
      }
    }

    setLibraryData(
      produce((data) => {
        delete data.folders[selectedFolder().name];

        return data;
      }),
    );

    await updateData();

    getData();
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {
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
            libraryData.userSettings.roundedBorders ? "6px" : "0px"
          }] w-[50%] p-6 `}>
          <div
            className={`flex justify-between ${
              libraryData.userSettings.language != "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                {translateText("edit")} {selectedFolder().name}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  if (editedHideFolder() == undefined) {
                    setEditedHideFolder(!selectedGame().hide);
                  } else {
                    setEditedHideFolder(!editedHideFolder());
                  }
                }}
                className="relative cursor-pointer">
                <Show when={editedHideFolder() == undefined}>
                  <Show when={selectedFolder().hide}>
                    <div className="relative">
                      <div className="">
                        {translateText("hide in expanded view")}
                      </div>
                      <div className="absolute blur-[5px] opacity-70 inset-0">
                        {translateText("hide in expanded view")}
                      </div>
                    </div>
                  </Show>
                  <Show when={!selectedFolder().hide}>
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                  </Show>
                </Show>

                <Show when={editedHideFolder() == true}>
                  <div className="relative">
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      {translateText("hide in expanded view")}
                    </div>
                  </div>
                </Show>

                <Show when={editedHideFolder() == false}>
                  <div className="">
                    {translateText("hide in expanded view")}
                  </div>
                </Show>
              </button>

              <button
                onClick={editFolder}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                onClick={() => {
                  showDeleteConfirm()
                    ? deleteFolder()
                    : setShowDeleteConfirm(true);

                  setTimeout(() => {
                    setShowDeleteConfirm(false);
                  }, 1500);
                }}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                <span className="text-[#FF3636]">
                  {showDeleteConfirm()
                    ? translateText("confirm?")
                    : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-editFolderModal]").close();
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
                setEditedFolderName(e.currentTarget.value);
              }}
              placeholder={translateText("name of folder")}
              value={selectedFolder().name}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
