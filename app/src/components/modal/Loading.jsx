import { Loading as LoadingIcon } from "@/libraries/Icons.jsx";
import { translateText } from "@/utils/translateText";
import { totalSteamGames, totalImportedSteamGames } from "../../stores/steamStore";

export function LoadingModal() {
  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="flex w-max items-center justify-between gap-2 border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212]">
        <Show when={totalSteamGames()}>{`${totalImportedSteamGames()} / ${totalSteamGames()}`} </Show>
        {translateText("loading")}{" "}
        <div class="relative">
          <LoadingIcon />
        </div>
      </div>
    </div>
  );
}

export function LoadingTextAndIcon() {
  return (
    <div class="flex w-max items-center justify-between gap-2">
      {translateText("loading")}{" "}
      <div class="relative">
        <LoadingIcon />
      </div>
    </div>
  );
}
