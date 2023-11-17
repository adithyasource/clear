import {
  libraryData,
  selectedFolder,
  editedFolderName,
  setEditedFolderName,
  editedHideFolder,
  setEditedHideFolder,
  roundedBorders,
} from "../Signals";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { getData } from "../App";
import { onMount } from "solid-js";

import YAML from "yamljs";

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
        path: "data.yaml",
        contents: YAML.stringify(libraryData(), 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
      location.reload();
    });
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {}}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#ffffff66]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`border-2 border-solid border-[#ffffff1f] bg-[#121212]  rounded-[${
            roundedBorders() ? "6px" : "0px"
          }] w-[50%] p-6 `}>
          <div className="flex justify-between">
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                edit {selectedFolder().name}
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
                      <div className="">hide in expanded view</div>
                      <div className="absolute blur-[5px] opacity-70 inset-0">
                        hide in expanded view
                      </div>
                    </div>
                  </Show>
                  <Show when={!selectedFolder().hide}>
                    <div className="">hide in expanded view</div>
                  </Show>
                </Show>

                <Show when={editedHideFolder() == true}>
                  <div className="relative">
                    <div className="">hide in expanded view</div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      hide in expanded view
                    </div>
                  </div>
                </Show>

                <Show when={editedHideFolder() == false}>
                  <div className="">hide in expanded view</div>
                </Show>
              </div>

              <button onClick={editFolder} className="flex items-center gap-1 ">
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
                className="flex items-center"
                onClick={() => {
                  document.querySelector("[data-editFolderModal]").close();
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
              className="w-full"
              onInput={(e) => {
                setEditedFolderName(e.currentTarget.value);
              }}
              placeholder="name of folder"
              value={selectedFolder().name}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
