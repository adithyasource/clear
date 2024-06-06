import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { closeDialog, openDialog, openGame, translateText } from "../Globals";
import { Close, Play, Settings } from "../libraries/Icons";

import { SelectedDataContext, ApplicationStateContext } from "../Globals";

export function GamePopUp() {
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <dialog
      data-gamePopup
      class="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166]  dark:bg-[#12121266]"
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
        }
      }}
      ref={(ref) => {
        closeDialog("gamePopup", ref);
      }}>
      <div class="flex h-screen w-screen flex-col items-center justify-center px-[40px]">
        <img
          src={convertFileSrc(
            `${applicationStateContext.appDataDirPath()}heroes\\${
              selectedDataContext.selectedGame().heroImage
            }`
          )}
          alt=""
          class="absolute -z-10 h-[350px] opacity-[0.4] blur-[80px] max-large:h-[270px]"
        />
        <div
          class="relative"
          ref={(ref) => {
            function handleTab(e) {
              const focusableElements = ref.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              const firstElement = focusableElements[0];
              const lastElement =
                focusableElements[focusableElements.length - 1];

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
          }}>
          <div class="absolute bottom-[30px] right-[30px] flex gap-[15px]">
            <button
              type="button"
              class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                openGame(selectedDataContext.selectedGame().location);
              }}>
              <div class="!w-max">{translateText("play")}</div>
              <Play />
            </button>
            <button
              type="button"
              class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("gamePopup");
                openDialog("editGameModal");
              }}>
              <Settings />
            </button>
            <button
              type="button"
              class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("gamePopup");
              }}>
              <Close />
            </button>
          </div>
          <Show
            when={selectedDataContext.selectedGame().heroImage}
            fallback={
              <div class="aspect-[96/31] h-[350px] bg-[#f1f1f1] dark:bg-[#1c1c1c] max-large:h-[270px]" />
            }>
            <img
              src={convertFileSrc(
                `${applicationStateContext.appDataDirPath()}heroes\\${
                  selectedDataContext.selectedGame().heroImage
                }`
              )}
              alt=""
              class="aspect-[96/31] h-[350px] max-large:h-[270px]"
            />
          </Show>

          <div class="absolute bottom-[30px] left-[25px] flex h-[70px] w-[300px] items-center align-middle max-large:bottom-[15px]">
            <Show
              when={selectedDataContext.selectedGame().logo}
              fallback={
                <div class="absolute bottom-[5px] h-[90px] w-[250px] bg-[#E8E8E8] dark:!bg-[#272727] max-large:h-[70px] max-large:w-[170px]" />
              }>
              <img
                src={convertFileSrc(
                  `${applicationStateContext.appDataDirPath()}logos\\${
                    selectedDataContext.selectedGame().logo
                  }`
                )}
                alt=""
                class=" relative aspect-auto max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
              />
            </Show>
          </div>
        </div>
      </div>
    </dialog>
  );
}
