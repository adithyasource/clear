import { convertFileSrc } from "@tauri-apps/api/core";
import { createResource, Show } from "solid-js";
import { openGame } from "@/services/gameService.js";
import { Close, Play, Settings } from "@/libraries/Icons.jsx";
import { closeModal } from "@/stores/modalStore.js";
import { translateText } from "@/utils/translateText";
import { getImagePath } from "../../data/storage/imageStroage";
import { libraryData } from "../../stores/libraryStore";
import { selectedGame, setSelectedGame } from "../../stores/selectedGameStore";
import { EditGameModal } from "./EditGameModal";
import { openModal } from "../../stores/modalStore";
import { triggerToast } from "@/stores/toastStore.js";

export function GamePopUpModal() {
  const game = () => libraryData.games[selectedGame()];

  const [heroImageFile] = createResource(
    () => libraryData.games[selectedGame()]?.heroImagePath,
    async (filePath) => {
      if (!filePath) return null;
      const path = await getImagePath({ type: "hero", fileName: filePath });
      return convertFileSrc(path);
    },
  );

  const [logoImageFile] = createResource(
    () => libraryData.games[selectedGame()]?.logoImagePath,
    async (filePath) => {
      if (!filePath) return null;
      const path = await getImagePath({ type: "logo", fileName: filePath });
      return convertFileSrc(path);
    },
  );

  const hero = () => heroImageFile();
  const logo = () => logoImageFile();

  return (
    <div class="flex h-screen w-screen flex-col items-center justify-center bg-[#d1d1d166] px-[40px] dark:bg-[#12121266]">
      <img src={hero()} alt="" class="absolute -z-10 h-[350px] opacity-[0.4] blur-[80px] max-large:h-[270px]" />
      <div class="relative">
        <div class="absolute right-[30px] bottom-[30px] flex gap-[15px]">
          <button type="button" class="invisible-button-gamepopup pointer-events-none" />

          <Show
            when={game()?.gameLocation}
            fallback={
              <button
                type="button"
                class="tooltip-bottom icon-btn-transparent w-max cursor-not-allowed!"
                data-tooltip={translateText("no game file")}
              >
                <div class="w-max! opacity-50">{translateText("play")}</div>
                <div class="opacity-50">
                  <Play />
                </div>
              </button>
            }
          >
            <button
              type="button"
              class="icon-btn-transparent w-max"
              onClick={async () => {
                try {
                  const res = await openGame(game().gameLocation);
                  if (res?.ok) {
                    triggerToast(res.message);
                  }
                } catch (err) {
                  triggerToast(err.message);
                }
                return;
              }}
            >
              <div class="w-max!">{translateText("play")}</div>
              <Play />
            </button>
          </Show>

          <button
            type="button"
            class="tooltip-delayed-bottom btn-transparent"
            onClick={() => {
              openModal({
                type: "editGame",
                component: EditGameModal,
                confirmWhileClosing: true,
                onClose: () => {
                  setSelectedGame();
                },
              });
            }}
            data-tooltip={translateText("settings")}
          >
            <Settings />
          </button>
          <button
            type="button"
            class="tooltip-delayed-bottom btn-transparent"
            onClick={() => {
              closeModal(true);
            }}
            data-tooltip={translateText("close")}
          >
            <Close />
          </button>
        </div>
        <Show
          when={hero()}
          fallback={<div class="aspect-96/31 h-[350px] bg-[#f1f1f1] max-large:h-[270px] dark:bg-[#1c1c1c]" />}
        >
          <img src={hero()} alt="" class="aspect-96/31 h-[350px] max-large:h-[270px]" />
        </Show>

        <div class="absolute bottom-[30px] left-[25px] flex h-[70px] w-[300px] items-center align-middle max-large:bottom-[15px]">
          <Show
            when={logo()}
            fallback={
              <div class="dark:bg-[#272727]! absolute bottom-[5px] h-[90px] w-[250px] bg-[#E8E8E8] max-large:h-[70px] max-large:w-[170px]" />
            }
          >
            <img
              src={logo()}
              alt=""
              class="relative aspect-auto max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]"
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
