import { useContext } from "solid-js";
import { translateText } from "../Globals";
import { Loading as LoadingIcon } from "../libraries/Icons";

import { SteamDataContext } from "../Globals";

export function Loading() {
  const steamDataContext = useContext(SteamDataContext);

  return (
    <dialog
      data-loadingModal
      onClose={() => {}}
      ref={() => {
        // we dont want to close the loading modal through user input, so theres no closeDialog("loadingModal", ref);
      }}
      className="absolute inset-0 z-[100] h-screen w-screen bg-[#d1d1d166] dark:bg-[#12121266]">
      <div className="flex h-screen w-screen items-center justify-center align-middle ">
        <div className="flex w-max items-center justify-between gap-2 border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212]">
          {translateText("loading")}
          <Show when={steamDataContext.totalSteamGames() !== 0}>
            {`${steamDataContext.totalImportedSteamGames()} / ${steamDataContext.totalSteamGames()}`}
          </Show>

          <div className="absolute">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </dialog>
  );
}
