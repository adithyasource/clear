import { Loading as LoadingIcon } from "@/libraries/Icons.jsx";
import { translateText } from "@/utils/translateText";
import { totalImportedSteamGames, totalSteamGames } from "../../stores/steamStore";

export function LoadingModal() {
  return (
    <div class="flex h-screen w-screen items-center justify-center bg-overlay align-middle">
      <div class="flex w-max items-center justify-between gap-2 panel-surface p-3">
        <Show when={totalSteamGames()}>{`${totalImportedSteamGames() + 1} / ${totalSteamGames()}`} </Show>
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
