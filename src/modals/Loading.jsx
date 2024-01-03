import { translateText } from "../App";
import {
  roundedBorders,
  totalImportedSteamGames,
  totalSteamGames,
} from "../Signals";

export function Loading() {
  return (
    <dialog
      data-loadingModal
      onClose={() => {}}
      className="absolute inset-0 z-[100] w-screen h-screen dark:bg-[#12121266] bg-[#d1d1d166]">
      <div className="flex items-center justify-center w-screen h-screen align-middle ">
        <div
          className={`flex justify-between gap-2 items-center border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] rounded-[${
            roundedBorders() ? "6px" : "0px"
          }] w-max p-3`}>
          {translateText("Loading")}
          <Show when={totalSteamGames() != 0}>
            {" "}
            {totalImportedSteamGames() + " / " + totalSteamGames()}
          </Show>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-spin-slow"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 16L19 19M18 12H22M8 8L5 5M16 8L19 5M8 16L5 19M2 12H6M12 2V6M12 18V22"
              className="stroke-[#000000] dark:stroke-[#ffffff] "
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    </dialog>
  );
}
