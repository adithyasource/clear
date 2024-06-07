import { useContext } from "solid-js";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close } from "../libraries/Icons";

import { GlobalContext, DataEntryContext } from "../Globals";

export function Notepad() {
  const globalContext = useContext(GlobalContext);
  const dataEntryContext = useContext(DataEntryContext);

  async function saveNotepad() {
    globalContext.setLibraryData("notepad", dataEntryContext.notepadValue());
    await updateData();
  }

  setTimeout(() => {
    dataEntryContext.setNotepadValue(globalContext.libraryData.notepad || "");
  }, 50);

  return (
    <>
      <dialog
        data-notepadModal
        onClose={() => {
          dataEntryContext.setNotepadValue(
            globalContext.libraryData.notepad || ""
          );
        }}
        ref={(ref) => {
          closeDialog("notepadModal", ref);

          function handleTab(e) {
            const focusableElements = ref.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

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
        class="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] dark:bg-[#12121266]">
        <div class="flex h-screen w-screen items-center justify-center align-middle ">
          <div class="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
            <div class="flex justify-between">
              <div>
                <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                  {translateText("notepad")}
                </p>
              </div>

              <button
                type="button"
                class="standardButton !w-max !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
                onClick={() => {
                  closeDialog("notepadModal");
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>
            <textarea
              onInput={(e) => {
                dataEntryContext.setNotepadValue(e.target.value);
                saveNotepad();
              }}
              class="mt-6 h-[40vh] w-full resize-none bg-transparent focus:outline-none"
              placeholder={translateText("write anything you want over here!")}
              spellcheck="false"
              value={dataEntryContext.notepadValue()}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
