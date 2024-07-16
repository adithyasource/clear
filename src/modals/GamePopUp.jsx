import { Show, useContext } from "solid-js";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { closeDialog, openDialog, openGame, translateText } from "../Globals";
import { Close, Play, Settings } from "../libraries/Icons";

import {
  SelectedDataContext,
  ApplicationStateContext,
  UIContext
} from "../Globals";

export function GamePopUp() {
  const selectedDataContext = useContext(SelectedDataContext);
  const applicationStateContext = useContext(ApplicationStateContext);
  const uiContext = useContext(UIContext);

  return (
    <dialog
      data-modal="gamePopUp"
      class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible"
      onClose={() => {
        uiContext.setShowGamePopUpModal(false);
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}>
      <div class="flex h-screen w-screen flex-col items-center justify-center px-[40px] bg-[#d1d1d166] dark:bg-[#12121266] ">
        <img
          src={convertFileSrc(
            `${applicationStateContext.appDataDirPath()}heroes\\${
              selectedDataContext.selectedGame().heroImage
            }`
          )}
          alt=""
          class="absolute -z-10 h-[350px] opacity-[0.4] blur-[80px] max-large:h-[270px]"
        />
        <div class="relative">
          <div class="absolute bottom-[30px] right-[30px] flex gap-[15px]">
            <Show
              when={selectedDataContext.selectedGame().location}
              fallback={
                <button
                  type="button"
                  class="!flex standardButton w-max bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b] tooltip-bottom cursor-not-allowed focus:!bg-[#d6d6d6] focus:backdrop-blur-[5px] dark:focus:!bg-[#2b2b2b]"
                  data-tooltip={translateText("no game file")}>
                  <div class="!w-max opacity-50">{translateText("play")}</div>
                  <div class="opacity-50">
                    <Play />
                  </div>
                </button>
              }>
              <button
                type="button"
                class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] focus:!bg-[#d6d6d6] hover:backdrop-blur-[5px] focus:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b] dark:focus:!bg-[#2b2b2b]"
                onClick={() => {
                  openGame(selectedDataContext.selectedGame().location);
                }}>
                <div class="!w-max">{translateText("play")}</div>
                <Play />
              </button>
            </Show>

            <button
              type="button"
              class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom focus:!bg-[#d6d6d6] focus:backdrop-blur-[5px] dark:focus:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("gamePopUp");
                openDialog("editGame");
              }}
              data-tooltip={translateText("settings")}>
              <Settings />
            </button>
            <button
              type="button"
              class="standardButton bg-[#E8E8E8] !bg-opacity-80 !text-black !backdrop-blur-[10px] hover:!bg-[#d6d6d6] hover:backdrop-blur-[5px] dark:bg-[#232323] dark:!text-white  dark:hover:!bg-[#2b2b2b] tooltip-delayed-bottom focus:!bg-[#d6d6d6] focus:backdrop-blur-[5px] dark:focus:!bg-[#2b2b2b]"
              onClick={() => {
                closeDialog("gamePopUp");
              }}
              data-tooltip={translateText("close")}>
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
