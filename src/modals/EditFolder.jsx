import {
  libraryData,
  selectedFolder,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
  roundedBorders,
  showDeleteConfirm,
  setShowDeleteConfirm,
  setShowToast,
  setToastMessage,
  language,
} from "../Signals";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData, translateText } from "../App";
import { Close, SaveDisk, TrashDelete } from "../components/Icons";

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

      for (let x = 0; x < Object.keys(libraryData().folders).length; x++) {
        if (editedFolderName() == Object.keys(libraryData().folders)[x]) {
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

    delete libraryData().folders[selectedFolder().name];

    libraryData().folders[editedFolderName()] = {
      ...selectedFolder(),
      name: editedFolderName(),
      hide: editedHideFolder(),
    };

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
      document.querySelector("[data-editFolderModal]").close();
    });
  }

  async function deleteFolder() {
    for (let x = 0; x < Object.keys(libraryData().folders).length; x++) {
      if (x > libraryData().folders[selectedFolder().name].index) {
        Object.values(libraryData().folders)[x].index -= 1;
      }
    }

    delete libraryData().folders[selectedFolder().name];

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
    });
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {
        getData();
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
                {translateText("edit")} {selectedFolder().name}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div
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
              </div>

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
