import { Show, useContext } from "solid-js";
import { produce } from "solid-js/store";
import { getData, translateText, updateData } from "../Globals";
import { Close, SaveDisk } from "../components/Icons";

import {
  GlobalContext,
  ApplicationStateContext,
  DataEntryContext,
  UIContext,
} from "../Globals";

export function NewFolder() {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const dataEntryContext = useContext(DataEntryContext);

  async function addFolder() {
    if (
      dataEntryContext.folderName() == "" ||
      dataEntryContext.folderName() == undefined
    ) {
      uiContext.setShowToast(true);
      applicationStateContext.setToastMessage(translateText("no folder name"));
      setTimeout(() => {
        uiContext.setShowToast(false);
      }, 1500);
      return;
    }

    for (
      let x = 0;
      x < Object.keys(globalContext.libraryData.folders).length;
      x++
    ) {
      if (
        dataEntryContext.folderName() ==
        Object.keys(globalContext.libraryData.folders)[x]
      ) {
        uiContext.setShowToast(true);
        applicationStateContext.setToastMessage(
          dataEntryContext.folderName() +
            " " +
            translateText("is already in your library"),
        );
        setTimeout(() => {
          uiContext.setShowToast(false);
        }, 1500);
        return;
      }
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
      }),
    );

    await updateData();
    getData();
    document.querySelector("[data-newFolderModal]").close();
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
                {translateText("add new folder")}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  dataEntryContext.setHideFolder((x) => !x);
                }}
                className="relative cursor-pointer">
                <Show when={dataEntryContext.hideFolder()}>
                  <div className="relative">
                    <div className="">
                      {translateText("hide in expanded view")}
                    </div>
                    <div className="absolute blur-[5px] opacity-70 inset-0">
                      {translateText("hide in expanded view")}
                    </div>
                  </div>
                </Show>
                <Show when={!dataEntryContext.hideFolder()}>
                  <div className="">
                    {translateText("hide in expanded view")}
                  </div>
                </Show>
              </button>
              <button
                onClick={addFolder}
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max">
                {translateText("save")}
                <SaveDisk />
              </button>
              <button
                className="flex items-center standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max !gap-0"
                onClick={() => {
                  document.querySelector("[data-newFolderModal]").close();
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
