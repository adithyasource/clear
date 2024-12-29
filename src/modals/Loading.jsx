// importing globals
import { SteamDataContext, translateText, UIContext } from "../Globals.jsx";

// importing code snippets and library functions
import { Show, useContext } from "solid-js";

// importing style related files
import { Loading as LoadingIcon } from "../libraries/Icons.jsx";

export function Loading() {
  const steamDataContext = useContext(SteamDataContext);
  const uiContext = useContext(UIContext);

  return (
    <dialog
      data-modal="loading"
      onClose={() => {
        uiContext.setShowLoadingModal(false);
      }}
      class="h-screen w-screen backdrop:bg-transparent !p-0 overflow-visible"
    >
      <div class="flex h-screen w-screen items-center justify-center align-middle bg-[#d1d1d166] dark:bg-[#12121266]">
        <div class="flex w-max items-center justify-between gap-2 border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212]">
          {translateText("loading")}{" "}
          <Show when={steamDataContext.totalSteamGames() !== 0}>
            {`${steamDataContext.totalImportedSteamGames()} / ${steamDataContext.totalSteamGames()}`}
          </Show>

          <div class="relative">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </dialog>
  );
}
