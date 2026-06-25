import { createSignal, Match, Show, Switch } from "solid-js";
import { Close, SaveDisk, TrashDelete } from "@/libraries/Icons.jsx";
import { triggerToast } from "@/stores/toastStore.js";
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
      <div class="flex h-screen w-screen items-center justify-center bg-overlay align-middle">
        <div class="w-[60%] panel-surface p-6">
          <div
            class={`flex justify-between ${libraryData.userSettings.language !== "en" ? "large:flex-row flex-col" : ""} `}
          >
            <div>
              <h1 class="title">
                {translateText("common.edit")} {folder().name}
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
                    <Show when={folder().hide} fallback={<div class="">{translateText("folder.hide_expanded")}</div>}>
                      <div class="relative">
                        <div class="">{translateText("folder.hide_expanded")}</div>
                        <div class="absolute inset-0 opacity-70 blur-[5px]">
                          {translateText("folder.hide_expanded")}
                        </div>
                      </div>
                    </Show>
                  </Match>

                  <Match when={editedHideFolder() === true}>
                    <div class="relative">
                      <div class="">{translateText("folder.hide_expanded")}</div>
                      <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("folder.hide_expanded")}</div>
                    </div>
                  </Match>

                  <Match when={editedHideFolder() === false}>
                    <div class="">{translateText("folder.hide_expanded")}</div>
                  </Match>
                </Switch>
              </button>

              <button type="button" onClick={saveChanges} class="icon-btn w-max">
                {translateText("common.save")}
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
                <span class="danger-text">
                  {showDeleteConfirm() ? translateText("common.confirm") : translateText("common.delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                type="button"
                class="w-max icon-btn "
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
                setEditedFolderName(e.currentTarget.value);
              }}
              placeholder={translateText("folder.name")}
              value={folder().name}
            />
          </div>
        </div>
      </div>
    </Show>
  );
}
