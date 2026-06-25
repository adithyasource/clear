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
    <div class="flex h-screen w-screen items-center justify-center bg-overlay align-middle">
      <div class="w-[60%] panel-surface p-6">
        <div
          class={`flex justify-between ${libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
        >
          <div>
            <h1 class="title">{translateText("folder.add_new")}</h1>
          </div>
          <div class="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                setHideFolder((x) => !x);
              }}
              class="relative cursor-pointer"
            >
              <Show when={hideFolder()} fallback={<div class="">{translateText("folder.hide_expanded")}</div>}>
                <div class="relative">
                  <div class="">{translateText("folder.hide_expanded")}</div>
                  <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("folder.hide_expanded")}</div>
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
              {translateText("common.save")}
              <SaveDisk />
            </button>
            <button
              type="button"
              class="tooltip-delayed-bottom btn"
              onClick={() => {
                closeModal();
              }}
              data-tooltip={translateText("common.close")}
            >
              {modalShowCloseConfirm() ? (
                <span class="danger-text whitespace-nowrap">{translateText("common.hit_confirm")}</span>
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
            placeholder={translateText("folder.name")}
          />
        </div>
      </div>
    </div>
  );
}
