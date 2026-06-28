import { Show } from "solid-js";
import { systemPlatform } from "@/stores/applicationStore";
import { translateText } from "@/utils/translateText";

export function Hotkeys(props) {
  const modifierKeyPrefix = systemPlatform() === "windows" ? "ctrl" : "⌘";

  return (
    <>
      <div class={`mt-8.75 grid gap-y-4 ${props.onSettingsPage ? "grid-cols-3" : "grid-cols-2"}`}>
        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + n</div>

          {translateText("sidebar.new_game")}
        </div>

        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + ,</div>

          {translateText("sidebar.open_settings")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + f</div>

          {translateText("search.search_bar")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + m</div>

          {translateText("sidebar.new_folder")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + l</div>

          {translateText("sidebar.open_notepad")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + \\</div>

          {translateText("sidebar.hide")}
        </div>

        <Show when={props.onSettingsPage}>
          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + w</div>

            {translateText("sidebar.close_app")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} - / =</div>

            {translateText("sidebar.change_zoom")}
          </div>

          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + click</div>

            {translateText("search.quick_open")}
          </div>
        </Show>
      </div>

      <Show when={!props.onSettingsPage}>
        <div class="mt-8.75 grid gap-y-4">
          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + f</div>

            {translateText("search.search_bar")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + \\</div>

            {translateText("sidebar.hide")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-max bg-card-muted px-3 py-1 text-muted">{modifierKeyPrefix} + click</div>

            {translateText("search.quick_open")}
          </div>
        </div>
      </Show>
    </>
  );
}
