// importing globals
import {
  GlobalContext,
  SelectedDataContext,
  UIContext,
  closeDialog,
  closeDialogImmediately,
  translateText,
  triggerToast,
  updateData,
} from "../Globals.jsx";

// importing code snippets and library functions
import { Match, Show, Switch, createSignal, onMount, useContext } from "solid-js";
import { produce } from "solid-js/store";

// importing style related files
import { Close, SaveDisk, TrashDelete } from "../libraries/Icons.jsx";

export function EditFolder() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);

  const [editedFolderName, setEditedFolderName] = createSignal();
  const [editedHideFolder, setEditedHideFolder] = createSignal();

  const [showCloseConfirm, setShowCloseConfirm] = createSignal(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

  async function editFolder() {
    if (editedFolderName() === "") {
      triggerToast(translateText("no folder name"));
      return;
    }

    if (selectedDataContext.selectedFolder().name !== editedFolderName()) {
      let folderNameAlreadyExists = false;

      for (const folderName of Object.keys(globalContext.libraryData.folders)) {
        if (editedFolderName() === folderName) {
          folderNameAlreadyExists = true;
        }
      }

      if (folderNameAlreadyExists) {
        triggerToast(`${editedFolderName()} ${translateText("is already in your library")}`);
        return;
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      }),
    );

    if (!editedFolderName()) {
      setEditedFolderName(selectedDataContext.selectedFolder().name);
    }

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[editedFolderName()] = {
          ...selectedDataContext.selectedFolder(),
          name: editedFolderName(),
          hide: editedHideFolder(),
        };

        return data;
      }),
    );

    await updateData();
    closeDialog("editFolder");
  }

  async function deleteFolder() {
    for (let x = 0; x < Object.keys(globalContext.libraryData.folders).length; x++) {
      if (x > globalContext.libraryData.folders[selectedDataContext.selectedFolder().name].index) {
        globalContext.setLibraryData(
          produce((data) => {
            Object.values(data.folders)[x].index -= 1;

            return data;
          }),
        );
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      }),
    );

    await updateData();

    closeDialog("editFolder");
  }

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showCloseConfirm()) {
          closeDialogImmediately(document.querySelector("[data-modal='editFolder']"));

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
      data-modal="editFolder"
      onClose={() => {
        uiContext.setShowEditFolderModal(false);
      }}
      class="!p-0 h-screen w-screen overflow-visible backdrop:bg-transparent"
    >
      <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
        <div class="w-[60%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${globalContext.libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
          >
            <div>
              <p class="text-[#000000] text-[25px] dark:text-[#ffffff80]">
                {translateText("edit")} {selectedDataContext.selectedFolder().name}
              </p>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  if (editedHideFolder() === undefined) {
                    setEditedHideFolder(!selectedDataContext.selectedGame().hide);
                  } else {
                    setEditedHideFolder(!editedHideFolder());
                  }
                }}
                class="relative cursor-pointer"
              >
                <Switch>
                  <Match when={editedHideFolder() === undefined}>
                    <Show
                      when={selectedDataContext.selectedFolder().hide}
                      fallback={<div class="">{translateText("hide in expanded view")}</div>}
                    >
                      <div class="relative">
                        <div class="">{translateText("hide in expanded view")}</div>
                        <div class="absolute inset-0 opacity-70 blur-[5px]">
                          {translateText("hide in expanded view")}
                        </div>
                      </div>
                    </Show>
                  </Match>

                  <Match when={editedHideFolder() === true}>
                    <div class="relative">
                      <div class="">{translateText("hide in expanded view")}</div>
                      <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("hide in expanded view")}</div>
                    </div>
                  </Match>

                  <Match when={editedHideFolder() === false}>
                    <div class="">{translateText("hide in expanded view")}</div>
                  </Match>
                </Switch>
              </button>

              <button
                type="button"
                onClick={editFolder}
                class="standardButton !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
              >
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                type="button"
                onClick={() => {
                  showDeleteConfirm() ? deleteFolder() : setShowDeleteConfirm(true);

                  setTimeout(() => {
                    setShowDeleteConfirm(false);
                  }, 1500);
                }}
                class="standardButton !w-max !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
              >
                <span class="text-[#FF3636]">
                  {showDeleteConfirm() ? translateText("confirm?") : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                type="button"
                class="standardButton !w-max !h-full !gap-0 !text-black hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom flex items-center bg-[#E8E8E8] dark:bg-[#232323]"
                onClick={() => {
                  if (showCloseConfirm()) {
                    closeDialog("editFolder");
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
                setEditedFolderName(e.currentTarget.value);
              }}
              placeholder={translateText("name of folder")}
              value={selectedDataContext.selectedFolder().name}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
