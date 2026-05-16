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
    <div class="flex h-screen w-screen items-center justify-center bg-overlay align-middle">
      <div class="w-[50%] panel-surface p-6">
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
