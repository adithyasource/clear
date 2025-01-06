// importing globals
import { ApplicationStateContext, translateText } from "../Globals.jsx";

// importing code snippets and library functions
import { Show, useContext } from "solid-js";

export function Hotkeys(props) {
  const applicationStateContext = useContext(ApplicationStateContext);

  const modifierKeyPrefix = applicationStateContext.systemPlatform() === "windows" ? "ctrl" : "⌘";

  return (
    <>
      <div
        class={`grid mt-[35px] gap-y-4
        ${props.onSettingsPage ? "grid-cols-3" : "grid-cols-2"}`}
      >
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + n
          </div>

          {translateText("new game")}
        </div>

        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + ,
          </div>

          {translateText("open settings")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + f
          </div>

          {translateText("search bar")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + m
          </div>

          {translateText("new folder")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + l
          </div>

          {translateText("open notepad")}
        </div>
        <div class="flex items-center gap-3">
          <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
            {modifierKeyPrefix} + \\
          </div>

          {translateText("hide sidebar")}
        </div>

        <Show when={props.onSettingsPage}>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} + w
            </div>

            {translateText("close app")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} - / =
            </div>

            {translateText("change zoom")}
          </div>

          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} + click
            </div>

            {translateText("quick open game")}
          </div>
        </Show>
      </div>

      <Show when={!props.onSettingsPage}>
        <div class="mt-[35px] grid gap-y-4">
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} + f
            </div>

            {translateText("search bar")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} + \\
            </div>

            {translateText("hide sidebar")}
          </div>
          <div class="flex items-center gap-3">
            <div class="w-[max-content] bg-[#f1f1f1] px-3 py-1 text-[#12121280] dark:bg-[#1c1c1c] dark:text-[#ffffff80]">
              {modifierKeyPrefix} + click
            </div>

            {translateText("quick open game")}
          </div>
        </div>
      </Show>
    </>
  );
}
