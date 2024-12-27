// importing globals
import {
  GlobalContext,
  ApplicationStateContext,
  UIContext,
  closeDialog,
  closeDialogImmediately,
  translateText,
  updateData,
  triggerToast,
} from "../Globals";

// importing code snippets and library functions
import { Show, useContext, createSignal, onMount } from "solid-js";
import { produce } from "solid-js/store";

// importing style related files
import { Close, SaveDisk } from "../libraries/Icons";

export function NewFolder() {
  const globalContext = useContext(GlobalContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const uiContext = useContext(UIContext);

  const [folderName, setFolderName] = createSignal();
  const [hideFolder, setHideFolder] = createSignal(false);

  const [showCloseConfirm, setShowCloseConfirm] = createSignal(false);

  async function addFolder() {
    if (folderName() === "" || folderName() === undefined) {
      triggerToast(translateText("no folder name"));
      return;
    }

    let folderNameAlreadyExists = false;

    for (const name of Object.keys(globalContext.libraryData.folders)) {
      if (folderName() === name) {
        folderNameAlreadyExists = true;
      }
    }

    if (folderNameAlreadyExists) {
      triggerToast(`${folderName()} ${translateText("is already in your library")}`);
      return;
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[folderName()] = {
          name: folderName(),
          hide: hideFolder(),
          games: [],
          index: applicationStateContext.currentFolders().length,
        };

        return data;
      }),
    );

    await updateData();

    closeDialog("newFolder");
  }

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showCloseConfirm()) {
          closeDialogImmediately(document.querySelector("[data-modal='newFolder']"));

          setShowCloseConfirm(false);
        } else {
          setShowCloseConfirm(true);

          const closeConfirmTimer = setTimeout(() => {
            clearTimeout(closeConfirmTimer);

            setShowCloseConfirm(false);
          }, 1500);
        }
      }
    });
  });

  return (
    <dialog
      data-modal="newFolder"
      onClose={() => {
        uiContext.setShowNewFolderModal(false);
      }}
      class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible"
    >
      <div class="flex h-screen w-screen items-center justify-center align-middle bg-[#d1d1d166] dark:bg-[#12121266]">
        <div class="w-[60%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${globalContext.libraryData.userSettings.language !== "en" ? "flex-col large:flex-row" : ""
              } `}
          >
            <div>
              <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">{translateText("add new folder")}</p>
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
                onClick={addFolder}
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              >
                {translateText("save")}
                <SaveDisk />
              </button>
              <button
                type="button"
                class="standardButton flex !w-max !h-full items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
                onClick={() => {
                  if (showCloseConfirm()) {
                    closeDialog("newFolder");
                  } else {
                    setShowCloseConfirm(true);
                  }
                  setTimeout(() => {
                    setShowCloseConfirm(false);
                  }, 1500);
                }}
                data-tooltip={translateText("close")}
              >
                {showCloseConfirm() ? (
                  <span class="text-[#FF3636] whitespace-nowrap">{translateText("hit again to confirm")}</span>
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
              class="w-full bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                setFolderName(e.currentTarget.value);
              }}
              value={folderName() || ""}
              placeholder={translateText("name of folder")}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
