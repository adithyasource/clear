// importing globals
import {
  ApplicationStateContext,
  SelectedDataContext,
  UIContext,
  closeDialog,
  locationJoin,
  openDialog,
  openGame,
  translateText,
} from "../Globals.jsx";

import { convertFileSrc } from "@tauri-apps/api/core";
// importing code snippets and library functions
import { Show, useContext } from "solid-js";

// importing style related files
import { Close, Play, Settings } from "../libraries/Icons.jsx";

export function GamePopUp() {
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const uiContext = useContext(UIContext);

  return (
    <dialog
      data-modal="gamePopUp"
      class="!p-0 h-screen w-screen overflow-visible backdrop:bg-transparent"
      onClose={() => {
        uiContext.setShowGamePopUpModal(false);
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      <div class="flex h-screen w-screen flex-col items-center justify-center bg-[#d1d1d166] px-[40px] dark:bg-[#12121266] ">
        <img
          src={convertFileSrc(
            locationJoin([
              applicationStateContext.appDataDirPath(),
              "heroes",
              selectedDataContext.selectedGame().heroImage,
            ]),
          )}
          alt=""
          class="-z-10 absolute h-[350px] opacity-[0.4] blur-[80px] max-large:h-[270px]"
        />
        <div class="relative">
          <div class="absolute right-[30px] bottom-[30px] flex gap-[15px]">
            <button type="button" class="invisible-button-gamepopup pointer-events-none" />

            <Show
              when={selectedDataContext.selectedGame().location}
              fallback={
                <button
                  type="button"
                  class="!flex standardButton !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-bottom focus:!bg-[#d6d6d6] dark:focus:!bg-[#2b2b2b] w-max cursor-not-allowed bg-[#E8E8E8] hover:backdrop-blur-[5px] focus:backdrop-blur-[5px] dark:bg-[#232323]"
                  data-tooltip={translateText("no game file")}
                >
                  <div class="!w-max opacity-50">{translateText("play")}</div>
                  <div class="opacity-50">
                    <Play />
                  </div>
                </button>
              }
            >
              <button
                type="button"
                class="standardButton !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] focus:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] dark:focus:!bg-[#2b2b2b] bg-[#E8E8E8] hover:backdrop-blur-[5px] focus:backdrop-blur-[5px] dark:bg-[#232323]"
                onClick={() => {
                  openGame(selectedDataContext.selectedGame().location);
                }}
              >
                <div class="!w-max">{translateText("play")}</div>
                <Play />
              </button>
            </Show>

            <button
              type="button"
              class="standardButton !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom focus:!bg-[#d6d6d6] dark:focus:!bg-[#2b2b2b] bg-[#E8E8E8] hover:backdrop-blur-[5px] focus:backdrop-blur-[5px] dark:bg-[#232323]"
              onClick={() => {
                closeDialog("gamePopUp");
                openDialog("editGame");
              }}
              data-tooltip={translateText("settings")}
            >
              <Settings />
            </button>
            <button
              type="button"
              class="standardButton !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] dark:!text-white dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom focus:!bg-[#d6d6d6] dark:focus:!bg-[#2b2b2b] bg-[#E8E8E8] hover:backdrop-blur-[5px] focus:backdrop-blur-[5px] dark:bg-[#232323]"
              onClick={() => {
                closeDialog("gamePopUp");
              }}
              data-tooltip={translateText("close")}
            >
              <Close />
            </button>
          </div>
          <Show
            when={selectedDataContext.selectedGame().heroImage}
            fallback={<div class="aspect-[96/31] h-[350px] bg-[#f1f1f1] max-large:h-[270px] dark:bg-[#1c1c1c]" />}
          >
            <img
              src={convertFileSrc(
                locationJoin([
                  applicationStateContext.appDataDirPath(),
                  "heroes",
                  selectedDataContext.selectedGame().heroImage,
                ]),
              )}
              alt=""
              class="aspect-[96/31] h-[350px] max-large:h-[270px]"
            />
          </Show>

          <div class="absolute bottom-[30px] left-[25px] flex h-[70px] w-[300px] items-center align-middle max-large:bottom-[15px]">
            <Show
              when={selectedDataContext.selectedGame().logo}
              fallback={
                <div class="dark:!bg-[#272727] absolute bottom-[5px] h-[90px] w-[250px] bg-[#E8E8E8] max-large:h-[70px] max-large:w-[170px]" />
              }
            >
              <img
                src={convertFileSrc(
                  locationJoin([
                    applicationStateContext.appDataDirPath(),
                    "logos",
                    selectedDataContext.selectedGame().logo,
                  ]),
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
