import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

import { libraryData, setNotepadValue, notepadValue } from "../Signals";

import { getData } from "../App";

export function Notepad() {
  async function saveNotepad() {
    libraryData().notepad = notepadValue();

    await writeTextFile(
      {
        path: "data/lib.json",
        contents: JSON.stringify(libraryData(), null, 4),
      },
      {
        dir: BaseDirectory.AppData,
      },
    ).then(() => {
      getData();
    });
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
        className="">
        <div className="flex items-center justify-center w-screen h-screen align-middle ">
          <div className="modalWindow w-[50%]  rounded-[6px] p-6">
            <div className="flex justify-between">
              <div>
                <h1>notepad</h1>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={saveNotepad}
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
            </div>
            <textarea
              onInput={(e) => {
                setNotepadValue(e.target.value);
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
