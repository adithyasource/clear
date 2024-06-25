import { useContext } from "solid-js";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close } from "../libraries/Icons";

import { GlobalContext, DataEntryContext, UIContext } from "../Globals";

export function Notepad() {
  const globalContext = useContext(GlobalContext);
  const dataEntryContext = useContext(DataEntryContext);
  const uiContext = useContext(UIContext);

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
          uiContext.setShowNotepadModal(false);
        }}
        class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible">
        <div class="flex h-screen w-screen items-center justify-center align-middle bg-[#d1d1d166] dark:bg-[#12121266]">
          <div class="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
            <div class="flex justify-between">
              <div>
                <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                  {translateText("notepad")}
                </p>
              </div>

              <button
                type="button"
                class="standardButton !w-max aspect-square !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
                onClick={() => {
                  closeDialog("notepadModal");
                  getData();
                }}
                data-tooltip={translateText("close")}>
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
