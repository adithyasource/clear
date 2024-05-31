import { produce } from "solid-js/store";
import { Switch, useContext } from "solid-js";
import { getData, translateText, updateData } from "../Globals";
import { Close, SaveDisk, TrashDelete } from "../components/Icons";

import {
  GlobalContext,
  SelectedDataContext,
  ApplicationStateContext,
  DataUpdateContext,
  UIContext,
} from "../Globals";
import { triggerToast } from "../Globals";

export function EditFolder() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataUpdateContext = useContext(DataUpdateContext);

  async function editFolder() {
    if (dataUpdateContext.editedFolderName() == "") {
      triggerToast(translateText("no folder name"));
      return;
    }

    if (
      selectedDataContext.selectedFolder().name !=
      dataUpdateContext.editedFolderName()
    ) {
      let folderOccurances = 0;

      for (
        let x = 0;
        x < Object.keys(globalContext.libraryData.folders).length;
        x++
      ) {
        if (
          dataUpdateContext.editedFolderName() ==
          Object.keys(globalContext.libraryData.folders)[x]
        ) {
          folderOccurances += 1;
        }
      }

      if (folderOccurances == 1) {
        triggerToast(
          dataUpdateContext.editedFolderName() +
            " " +
            translateText("is already in your library"),
        );
        return;
      }
    }

    globalContext.setLibraryData(
      produce((data) => {
        delete data.folders[selectedDataContext.selectedFolder().name];

        return data;
      }),
    );

    globalContext.setLibraryData(
      produce((data) => {
        data.folders[dataUpdateContext.editedFolderName()] = {
          ...selectedDataContext.selectedFolder(),
          name: dataUpdateContext.editedFolderName(),
          hide: dataUpdateContext.editedHideFolder(),
        };

        return data;
      }),
    );

    await updateData();

    getData();

    document.querySelector("[data-editFolderModal]").close();
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

    getData();
  }

  return (
    <dialog
      data-editFolderModal
      onClose={() => {
        getData();
      }}
      ref={(ref) => {
        function handleTab(e) {
          const focusableElements = ref.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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

        ref.addEventListener("close", () => {
          previouslyFocusedElement.focus();
        });
      }}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
            globalContext.libraryData.userSettings.roundedBorders
              ? "6px"
              : "0px"
          }] w-[50%] p-6 `}>
          <div
            className={`flex justify-between ${
              globalContext.libraryData.userSettings.language != "en"
                ? "flex-col large:flex-row"
                : ""
            } `}>
            <div>
              <p className="dark:text-[#ffffff80] text-[#000000] text-[25px]">
                {translateText("edit")}{" "}
                {selectedDataContext.selectedFolder().name}
              </p>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  if (dataUpdateContext.editedHideFolder() == undefined) {
                    dataUpdateContext.setEditedHideFolder(!selectedGame().hide);
                  } else {
                    dataUpdateContext.setEditedHideFolder(
                      !dataUpdateContext.editedHideFolder(),
                    );
                  }
                }}
                className="relative cursor-pointer">
                <Switch>
                  <Match
                    when={dataUpdateContext.editedHideFolder() == undefined}>
                    <Show
                      when={selectedDataContext.selectedFolder().hide}
                      fallback={
                        <div className="">
                          {translateText("hide in expanded view")}
                        </div>
                      }>
                      <div className="relative">
                        <div className="">
                          {translateText("hide in expanded view")}
                        </div>
                        <div className="absolute blur-[5px] opacity-70 inset-0">
                          {translateText("hide in expanded view")}
                        </div>
                      </div>
                    </Show>
                  </Match>

                  <Match when={dataUpdateContext.editedHideFolder() == true}>
                    <div className="relative">
                      <div className="">
                        {translateText("hide in expanded view")}
                      </div>
                      <div className="absolute blur-[5px] opacity-70 inset-0">
                        {translateText("hide in expanded view")}
                      </div>
                    </div>
                  </Match>

                  <Match when={dataUpdateContext.editedHideFolder() == false}>
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                  </Match>
                </Switch>
              </button>

              <button
                onClick={editFolder}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                {translateText("save")}
                <SaveDisk />
              </button>

              <button
                onClick={() => {
                  uiContext.showDeleteConfirm()
                    ? deleteFolder()
                    : uiContext.setShowDeleteConfirm(true);

                  setTimeout(() => {
                    uiContext.setShowDeleteConfirm(false);
                  }, 1500);
                }}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                <span className="text-[#FF3636]">
                  {uiContext.showDeleteConfirm()
                    ? translateText("confirm?")
                    : translateText("delete")}
                </span>
                <TrashDelete />
              </button>

              <button
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-editFolderModal]").close();
                  getData();
                }}>
                ​
                <Close />
              </button>
            </div>
          </div>

          <div className="flex items-end gap-6 mt-6">
            <input
              aria-autocomplete="none"
              type="text"
              name=""
              id=""
              className="w-full dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b]"
              onInput={(e) => {
                dataUpdateContext.setEditedFolderName(e.currentTarget.value);
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
