import { createSignal, Show } from "solid-js";
import { Close, SaveDisk } from "@/libraries/Icons.jsx";
import { addFolder } from "@/services/folderService.js";
import { libraryData } from "@/stores/libraryStore";
import { closeModal, modalShowCloseConfirm } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";

export function NewFolderModal() {
  const [folderName, setFolderName] = createSignal();
  const [hideFolder, setHideFolder] = createSignal(false);

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="w-[60%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
        <div
          class={`flex justify-between ${libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
        >
          <div>
            <h1 class="title">{translateText("add new folder")}</h1>
          </div>
          <div class="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                setHideFolder((x) => !x);
              }}
              class="relative cursor-pointer"
            >
              <Show when={hideFolder()} fallback={<div class="">{translateText("hide in expanded view")}</div>}>
                <div class="relative">
                  <div class="">{translateText("hide in expanded view")}</div>
                  <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("hide in expanded view")}</div>
                </div>
              </Show>
            </button>
            <button
              type="button"
              onClick={() => {
                addFolder({ name: folderName(), hide: hideFolder() });

                closeModal(true);
              }}
              class="icon-btn w-max"
            >
              {translateText("save")}
              <SaveDisk />
            </button>
            <button
              type="button"
              class="tooltip-delayed-bottom btn"
              onClick={() => {
                closeModal();
              }}
              data-tooltip={translateText("close")}
            >
              {modalShowCloseConfirm() ? (
                <span class="whitespace-nowrap text-[#FF3636]">{translateText("hit again to confirm")}</span>
              ) : (
                <Close />
              )}
            </button>
          </div>
        </div>
        <div class="mt-6 flex items-end gap-6">
          <input
            aria-autocomplete="none"
            type="text"
            name=""
            id=""
            class="input-field w-full"
            onInput={(e) => {
              setFolderName(e.currentTarget.value);
            }}
            value={folderName() || ""}
            placeholder={translateText("name of folder")}
          />
        </div>
      </div>
    </div>
  );
}
