import { createSignal, Match, Show, Switch } from "solid-js";
import { triggerToast } from "@/Globals.jsx";
import { Close, SaveDisk, TrashDelete } from "@/libraries/Icons.jsx";
import { translateText } from "@/utils/translateText";
import { deleteFolder, updateFolder } from "../../services/folderService";
import { libraryData } from "../../stores/libraryStore";
import { closeModal, modalShowCloseConfirm } from "../../stores/modalStore";
import { selectedFolder } from "../../stores/selectedFolderStore";

export function EditFolderModal() {
  const [editedFolderName, setEditedFolderName] = createSignal();
  const [editedHideFolder, setEditedHideFolder] = createSignal();
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);

  const folder = () => libraryData.folders[selectedFolder()];

  async function saveChanges() {
    try {
      await updateFolder({ folderIndex: selectedFolder(), newName: editedFolderName(), newHide: editedHideFolder() });
    } catch (e) {
      triggerToast(`error saving changes: ${e.message}`);
    }

    closeModal(true);
  }

  async function deleteFolderHandler() {
    // setting folder index before since close modal will
    // clear out the selected context
    const folderIndex = selectedFolder();

    closeModal(true);

    // setting timeout cause closemodal animation
    setTimeout(async () => {
      try {
        await deleteFolder({ folderIndex });
      } catch (e) {
        triggerToast(`error deleting folder: ${e.message}`);
      }
    }, 220);
  }

  return (
    <Show when={folder()}>
      <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
        <div class="w-[60%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
          <div
            class={`flex justify-between ${libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
          >
            <div>
              <h1 class="title">
                {translateText("edit")} {folder().name}
              </h1>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  if (editedHideFolder() === undefined) {
                    setEditedHideFolder(!folder().hide);
                  } else {
                    setEditedHideFolder(!editedHideFolder());
                  }
                }}
                class="relative cursor-pointer"
              >
                <Switch>
                  <Match when={editedHideFolder() === undefined}>
                    <Show when={folder().hide} fallback={<div class="">{translateText("hide in expanded view")}</div>}>
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

              <button type="button" onClick={saveChanges} class="icon-btn w-max">
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                type="button"
                onClick={() => {
                  showDeleteConfirm() ? deleteFolderHandler() : setShowDeleteConfirm(true);

                  setTimeout(() => {
                    setShowDeleteConfirm(false);
                  }, 1500);
                }}
                class="icon-btn w-max"
              >
                <span class="text-[#FF3636]">
                  {showDeleteConfirm() ? translateText("confirm?") : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                type="button"
                class="w-max icon-btn "
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
                setEditedFolderName(e.currentTarget.value);
              }}
              placeholder={translateText("name of folder")}
              value={folder().name}
            />
          </div>
        </div>
      </div>
    </Show>
  );
}
