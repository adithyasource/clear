import { createSignal, onCleanup } from "solid-js";
import { getData } from "@/Globals.jsx";
import { Close } from "@/libraries/Icons.jsx";
import { libraryData } from "@/stores/libraryStore";
import { closeModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { updateNotepadData } from "../../services/notepadService";

export function NotepadModal() {
  const [notepadValue, setNotepadValue] = createSignal("");
  let saveTimeout;

  async function saveNotepad() {
    try {
      await updateNotepadData(notepadValue());
    } catch (e) {
      triggerToast(e.message);
    }
  }

  function debounceSaveNotepad() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveNotepad();
    }, 500);
  }

  onCleanup(() => {
    clearTimeout(saveTimeout);
  });

  setTimeout(() => {
    setNotepadValue(libraryData.notepad || "");
  }, 50);

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="w-[50%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
        <div class="flex justify-between">
          <div>
            <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">
              {translateText("notepad")}
              <Show when={libraryData.notepad !== notepadValue()}>*</Show>
            </p>
          </div>

          <button
            type="button"
            class="standardButton !w-max !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom aspect-square bg-[#E8E8E8] dark:bg-[#232323]"
            onClick={() => {
              closeModal();
              getData();
            }}
            data-tooltip={translateText("close")}
          >
            <Close />
          </button>
        </div>
        <textarea
          onInput={(e) => {
            setNotepadValue(e.target.value);
            debounceSaveNotepad();
          }}
          class="mt-6 h-[40vh] w-full resize-none bg-transparent focus:outline-none"
          placeholder={translateText("write anything you want over here!")}
          spellcheck="false"
          value={notepadValue()}
        />
      </div>
    </div>
  );
}
