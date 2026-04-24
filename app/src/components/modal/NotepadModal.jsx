import { createSignal, onCleanup } from "solid-js";
import { Close } from "@/libraries/Icons.jsx";
import { updateNotepadData } from "@/services/notepadService";
import { libraryData } from "@/stores/libraryStore";
import { closeModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";

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
            <h1 class="title">
              {translateText("notepad")}
              <Show when={libraryData.notepad !== notepadValue()}>*</Show>
            </h1>
          </div>

          <button
            type="button"
            class="tooltip-delayed-bottom btn w-max"
            onClick={() => {
              closeModal();
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
          class="mt-6 h-[40vh] w-full resize-none bg-transparent focus:outline-hidden"
          placeholder={translateText("write anything you want over here!")}
          spellcheck="false"
          value={notepadValue()}
        />
      </div>
    </div>
  );
}
