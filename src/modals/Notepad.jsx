import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import {
  libraryData,
  setNotepadValue,
  notepadValue,
  roundedBorders,
} from "../Signals";

import { getData } from "../App";

import YAML from "yamljs";

export function Notepad() {
  async function saveNotepad() {
    libraryData().notepad = notepadValue();

    await writeTextFile(
      {
        path: "data.yaml",
        contents: YAML.stringify(libraryData(), 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {});
  }

  setTimeout(() => {
    setNotepadValue(libraryData().notepad || "");
  }, 50);

  return (
    <>
      <dialog
        data-notepadModal
        onClose={() => {
          setNotepadValue(libraryData().notepad || "");
        }}
        className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div
            className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] w-[50%] p-6`}>
            <div className="flex justify-between">
              <div>
                <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                  notepad
                </p>
              </div>

              <button
                className="standardButton !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-notepadModal]").close();
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
            <textarea
              onInput={(e) => {
                setNotepadValue(e.target.value);
                saveNotepad();
              }}
              className="w-full h-[40vh] mt-6 bg-transparent rounded-[6px] focus:outline-none resize-none"
              placeholder="write anything you want over here!"
              spellcheck="false"
              value={notepadValue()}></textarea>
          </div>
        </div>
      </dialog>
    </>
  );
}
