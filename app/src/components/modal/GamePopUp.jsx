import { createEffect, createResource, onCleanup, Show } from "solid-js";
import { Close, Play, Settings } from "@/libraries/Icons.jsx";
import { openGame } from "@/services/gameService.js";
import { closeModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore.js";
import {
  getCachedGameImageSource,
  getGameImageSource,
  movePreloadedImageElement,
  restorePreloadedImageElement,
} from "@/utils/preloadGameImages.js";
import { translateText } from "@/utils/translateText";
import { libraryData } from "../../stores/libraryStore";
import { openModal } from "../../stores/modalStore";
import { selectedGame, setSelectedGame } from "../../stores/selectedGameStore";
import { EditGameModal } from "./EditGameModal";

export function GamePopUpModal() {
  const game = () => libraryData.games[selectedGame()];
  let heroImageTarget;
  let logoImageTarget;

  const [heroImageFile] = createResource(
    () => libraryData.games[selectedGame()]?.heroImagePath,
    (filePath) => {
      if (!filePath) return null;
      return getCachedGameImageSource("hero", filePath) ?? getGameImageSource("hero", filePath);
    },
  );

  const [logoImageFile] = createResource(
    () => libraryData.games[selectedGame()]?.logoImagePath,
    (filePath) => {
      if (!filePath) return null;
      return getCachedGameImageSource("logo", filePath) ?? getGameImageSource("logo", filePath);
    },
  );

  const hero = () => heroImageFile();
  const logo = () => logoImageFile();

  createEffect(() => {
    const currentGame = game();
    if (!currentGame) return;

    if (heroImageTarget && currentGame.heroImagePath) {
      void movePreloadedImageElement(
        "hero",
        currentGame.heroImagePath,
        heroImageTarget,
        "aspect-96/31 h-[350px] max-large:h-[270px]",
      );
    }

    if (logoImageTarget && currentGame.logoImagePath) {
      void movePreloadedImageElement(
        "logo",
        currentGame.logoImagePath,
        logoImageTarget,
        "relative aspect-auto max-h-[100px] max-w-[400px] max-large:max-h-[70px] max-large:max-w-[300px]",
      );
    }
  });

  onCleanup(() => {
    const currentGame = game();
    if (!currentGame) return;

    restorePreloadedImageElement("hero", currentGame.heroImagePath);
    restorePreloadedImageElement("logo", currentGame.logoImagePath);
  });

  return (
    <div class="flex h-screen w-screen flex-col items-center justify-center bg-overlay px-[40px]">
      <img src={hero()} alt="" class="absolute -z-10 h-[350px] opacity-[0.4] blur-[80px] max-large:h-[270px]" />
      <div class="relative">
        <div class="absolute right-[30px] bottom-[30px] flex gap-[15px]">
          <Show
            when={game()?.gameLocation}
            fallback={
              <button
                type="button"
                class="tooltip-bottom icon-btn-transparent w-max cursor-not-allowed!"
                data-tooltip={translateText("error.no_game_file")}
              >
                <div class="w-max! opacity-50">{translateText("common.play")}</div>
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
              <div class="w-max!">{translateText("common.play")}</div>
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
            data-tooltip={translateText("settings.title")}
          >
            <Settings />
          </button>
          <button
            type="button"
            class="tooltip-delayed-bottom btn-transparent"
            onClick={() => {
              closeModal(true);
            }}
            data-tooltip={translateText("common.close")}
          >
            <Close />
          </button>
        </div>
        <Show when={hero()} fallback={<div class="aspect-96/31 h-[350px] bg-media-placeholder max-large:h-[270px]" />}>
          <div ref={heroImageTarget} class="aspect-96/31 h-[350px] max-large:h-[270px]" />
        </Show>

        <Show when={logo()}>
          <div class="absolute bottom-[30px] left-[25px] flex h-[70px] w-[300px] items-center align-middle max-large:bottom-[15px]">
            <div ref={logoImageTarget} />
          </div>
        </Show>
      </div>
    </div>
  );
}
