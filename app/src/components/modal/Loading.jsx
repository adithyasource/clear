import { Show, useContext } from "solid-js";
import { SteamDataContext } from "@/Globals.jsx";
import { Loading as LoadingIcon } from "@/libraries/Icons.jsx";
import { translateText } from "@/utils/translateText";

export function LoadingModal() {
  const steamDataContext = useContext(SteamDataContext);

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="flex w-max items-center justify-between gap-2 border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212]">
        {translateText("loading")}{" "}
        <Show when={steamDataContext.totalSteamGames() !== 0}>
          {`${steamDataContext.totalImportedSteamGames()} / ${steamDataContext.totalSteamGames()}`}
        </Show>
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
