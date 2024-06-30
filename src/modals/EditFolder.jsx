import { produce } from "solid-js/store";
import { Switch, useContext, Match, Show, createSignal } from "solid-js";
import { closeDialog, translateText, updateData } from "../Globals";
import { Close, SaveDisk, TrashDelete } from "../libraries/Icons";

import { GlobalContext, SelectedDataContext, UIContext } from "../Globals";
import { triggerToast } from "../Globals";

export function EditFolder() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);

  const [editedFolderName, setEditedFolderName] = createSignal();
  const [editedHideFolder, setEditedHideFolder] = createSignal();

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
        triggerToast(
          `${editedFolderName()} ${translateText("is already in your library")}`
        );
        return;
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      })
    );

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[editedFolderName()] = {
          ...selectedDataContext.selectedFolder(),
          name: editedFolderName(),
          hide: editedHideFolder()
        };

        return data;
      })
    );

    await updateData();

    closeDialog("editFolderModal");
  }

  async function deleteFolder() {
    for (
      let x = 0;
      x < Object.keys(globalContext.libraryData.folders).length;
      x++
    ) {
      if (
        x >
        globalContext.libraryData.folders[
          selectedDataContext.selectedFolder().name
        ].index
      ) {
        globalContext.setLibraryData(
          produce((data) => {
            Object.values(data.folders)[x].index -= 1;

            return data;
          })
        );
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      })
    );

    await updateData();
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {
        uiContext.setShowEditFolderModal(false);
      }}
      class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible">
      <div class="flex h-screen w-screen items-center justify-center align-middle bg-[#d1d1d166] dark:bg-[#12121266]">
        <div class="w-[50%] border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${
              globalContext.libraryData.userSettings.language !== "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p class="text-[25px] text-[#000000] dark:text-[#ffffff80]">
                {translateText("edit")}{" "}
                {selectedDataContext.selectedFolder().name}
              </p>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  if (editedHideFolder() === undefined) {
                    setEditedHideFolder(
                      !selectedDataContext.selectedGame().hide
                    );
                  } else {
                    setEditedHideFolder(!editedHideFolder());
                  }
                }}
                class="relative cursor-pointer">
                <Switch>
                  <Match when={editedHideFolder() === undefined}>
                    <Show
                      when={selectedDataContext.selectedFolder().hide}
                      fallback={
                        <div class="">
                          {translateText("hide in expanded view")}
                        </div>
                      }>
                      <div class="relative">
                        <div class="">
                          {translateText("hide in expanded view")}
                        </div>
                        <div class="absolute inset-0 opacity-70 blur-[5px]">
                          {translateText("hide in expanded view")}
                        </div>
                      </div>
                    </Show>
                  </Match>

                  <Match when={editedHideFolder() === true}>
                    <div class="relative">
                      <div class="">
                        {translateText("hide in expanded view")}
                      </div>
                      <div class="absolute inset-0 opacity-70 blur-[5px]">
                        {translateText("hide in expanded view")}
                      </div>
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
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                type="button"
                onClick={() => {
                  uiContext.showDeleteConfirm()
                    ? deleteFolder()
                    : uiContext.setShowDeleteConfirm(true);

                  setTimeout(() => {
                    uiContext.setShowDeleteConfirm(false);
                  }, 1500);
                }}
                class="standardButton flex !w-max items-center bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
                <span class="text-[#FF3636]">
                  {uiContext.showDeleteConfirm()
                    ? translateText("confirm?")
                    : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                type="button"
                class="standardButton flex !w-max !h-full items-center !gap-0 bg-[#E8E8E8] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom"
                onClick={() => {
                  if (uiContext.showCloseConfirm()) {
                    closeDialog("editFolderModal");
                  } else {
                    uiContext.setShowCloseConfirm(true);
                  }
                  setTimeout(() => {
                    uiContext.setShowCloseConfirm(false);
                  }, 1500);
                }}
                data-tooltip={translateText("close")}>
                {uiContext.showCloseConfirm() ? (
                  <span class="text-[#FF3636] whitespace-nowrap">
                    {translateText("hit again to confirm")}
                  </span>
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
