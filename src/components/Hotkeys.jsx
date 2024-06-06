import { Show } from "solid-js";
import { translateText } from "../Globals";

export function Hotkeys(props) {
  return (
    <>
      <div
        class={`grid ${
          props.onSettingsPage ? "grid-cols-3" : "grid-cols-2"
        } mt-[35px] gap-y-4`}>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + n
          </div>

          {translateText("new game")}
        </div>

        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + .
          </div>

          {translateText("open settings")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + f
          </div>

          {translateText("search bar")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + m
          </div>

          {translateText("new folder")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + l
          </div>

          {translateText("open notepad")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            ctrl + \\
          </div>

          {translateText("hide sidebar")}
        </div>

        <Show when={props.onSettingsPage}>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl + w
            </div>

            {translateText("close app")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl - / =
            </div>

            {translateText("change zoom")}
          </div>

          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl + click
            </div>

            {translateText("quick open game")}
          </div>
        </Show>
      </div>

      <Show when={!props.onSettingsPage}>
        <div class="mt-[35px] grid gap-y-4">
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl + f
            </div>

            {translateText("search bar")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl + \\
            </div>

            {translateText("hide sidebar")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              ctrl + click
            </div>

            {translateText("quick open game")}
          </div>
        </div>
      </Show>
    </>
  );
}
