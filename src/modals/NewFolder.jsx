import { Show, useContext } from "solid-js";
import { produce } from "solid-js/store";
import { closeDialog, getData, translateText, updateData } from "../Globals";
import { Close, SaveDisk } from "../libraries/Icons";

import {
  GlobalContext,
  ApplicationStateContext,
  DataEntryContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function NewFolder() {
  const globalContext = useContext(GlobalContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  async function addFolder() {
    if (
      dataEntryContext.folderName() === "" ||
      dataEntryContext.folderName() === undefined
    ) {
      triggerToast(translateText("no folder name"));
      return;
    }

    let folderNameAlreadyExists = false;

    for (const folderName of Object.keys(globalContext.libraryData.folders)) {
      if (dataEntryContext.folderName() === folderName) {
        folderNameAlreadyExists = true;
      }
    }

    if (folderNameAlreadyExists) {
      triggerToast(
        `${dataEntryContext.folderName()} ${translateText(
          "is already in your library"
        )}`
      );
      return;
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[dataEntryContext.folderName()] = {
          name: dataEntryContext.folderName(),
          hide: dataEntryContext.hideFolder(),
          games: [],
          index: applicationStateContext.currentFolders().length,
        };

        return data;
      })
    );

    await updateData();
    closeDialog("newFolderModal");
  }

  return (
    <dialog
      data-newFolderModal
      onClose={() => {
        dataEntryContext.setFolderName(undefined);
        dataEntryContext.setHideFolder(undefined);
        getData();
      }}
      ref={(ref) => {
        closeDialog("newFolderModal", ref);

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
      }}
      class="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] dark:bg-[#12121266]">
      <div class="flex h-screen w-screen items-center justify-center align-middle ">
        <div class="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${
              globalContext.libraryData.userSettings.language !== "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                {translateText("add new folder")}
              </p>
            </div>
            <div class="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  dataEntryContext.setHideFolder((x) => !x);
                }}
                class="relative cursor-pointer">
                <Show
                  when={dataEntryContext.hideFolder()}
                  fallback={
                    <div class="">{translateText("hide in expanded view")}</div>
                  }>
                  <div class="relative">
                    <div class="">{translateText("hide in expanded view")}</div>
                    <div class="absolute inset-0 opacity-70 blur-[5px]">
                      {translateText("hide in expanded view")}
                    </div>
                  </div>
                </Show>
              </button>
              <button
                type="button"
                onClick={addFolder}
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                {translateText("save")}
                <SaveDisk />
              </button>
              <button
                type="button"
                class="standardButton flex !w-max !h-full items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
                onClick={() => {
                  closeDialog("newFolderModal");
                  getData();
                }}
                data-tooltiptext="close">
                <Close />
              </button>
            </div>
          </div>
          <div class="mt-6 flex items-end gap-6">
            <input
              aria-autocomplete="none"
              type="text"
              name=""
              id=""
              class="w-full bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                dataEntryContext.setFolderName(e.currentTarget.value);
              }}
              value={dataEntryContext.folderName() || ""}
              placeholder={translateText("name of folder")}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
