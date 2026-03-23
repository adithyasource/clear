import { createSignal, Show, useContext } from "solid-js";
import { GlobalContext, translateText } from "../../Globals.jsx";
import { Close, SaveDisk } from "../../libraries/Icons.jsx";
import { addFolder } from "../../services/folderService.js";
import { closeModal, modalShowCloseConfirm } from "../../stores/modalStore.js";

export function NewFolderModal() {
  const globalContext = useContext(GlobalContext);

  const [folderName, setFolderName] = createSignal();
  const [hideFolder, setHideFolder] = createSignal(false);

  // async function addFolder() {
  //   if (folderName() === "" || folderName() === undefined) {
  //     triggerToast(translateText("no folder name"));
  //     return;
  //   }
  //
  //   let folderNameAlreadyExists = false;
  //
  //   for (const name of Object.keys(globalContext.libraryData.folders)) {
  //     if (folderName() === name) {
  //       folderNameAlreadyExists = true;
  //     }
  //   }
  //
  //   if (folderNameAlreadyExists) {
  //     triggerToast(`${folderName()} ${translateText("is already in your library")}`);
  //     return;
  //   }
  //
  //   globalContext.setLibraryData(
  //     produce((data) => {
  //       data.folders[folderName()] = {
  //         name: folderName(),
  //         hide: hideFolder(),
  //         games: [],
  //         index: applicationStateContext.currentFolders().length,
  //       };
  //
  //       return data;
  //     }),
  //   );
  //
  //   await updateData();
  //
  //   closeModal(true);
  // }

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="w-[60%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
        <div
          class={`flex justify-between ${globalContext.libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
        >
          <div>
            <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">{translateText("add new folder")}</p>
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
              class="standardButton !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
            >
              {translateText("save")}
              <SaveDisk />
            </button>
            <button
              type="button"
              class="standardButton !w-max !h-full !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
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
            class="!text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] w-full bg-[#E8E8E8] dark:bg-[#232323]"
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
