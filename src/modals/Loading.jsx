import { translateText } from "../App";
import {
  totalImportedSteamGames,
  totalSteamGames,
  libraryData,
} from "../Signals";

import { Loading as LoadingIcon } from "../components/Icons";

export function Loading() {
  return (
    <dialog
      data-loadingModal
      onClose={() => {}}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`flex justify-between gap-2 items-center border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
            libraryData.userSettings.roundedBorders ? "6px" : "0px"
          }] w-max p-3`}>
          {translateText("loading")}
          <Show when={totalSteamGames() != 0}>
            {" "}
            {totalImportedSteamGames() + " / " + totalSteamGames()}
          </Show>

          <div className="animate-spin-slow absolute">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </dialog>
  );
}
