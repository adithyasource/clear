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
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div className="flex justify-between gap-2 items-center border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] w-max p-3">
          {translateText("loading")}
          <Show when={steamDataContext.totalSteamGames() != 0}>
            {steamDataContext.totalImportedSteamGames() +
              " / " +
              steamDataContext.totalSteamGames()}
          </Show>

          <div className="animate-spin-slow absolute">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </dialog>
  );
}
