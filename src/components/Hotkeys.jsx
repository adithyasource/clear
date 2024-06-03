import { Show } from "solid-js";
import { translateText } from "../Globals";

export function Hotkeys(props) {
  return (
    <>
      <div
        className={`grid ${
          props.onSettingsPage ? "grid-cols-3" : "grid-cols-2"
        } mt-[35px] gap-y-4`}>
        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + n
          </div>

          {translateText("new game")}
        </div>

        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + .
          </div>

          {translateText("open settings")}
        </div>
        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + f
          </div>

          {translateText("search bar")}
        </div>
        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + m
          </div>

          {translateText("new folder")}
        </div>
        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + l
          </div>

          {translateText("open notepad")}
        </div>
        <div className="flex items-center gap-3">
          <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
            ctrl + \\
          </div>

          {translateText("hide sidebar")}
        </div>

        <Show when={props.onSettingsPage}>
          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl + w
            </div>

            {translateText("close app")}
          </div>
          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl - / =
            </div>

            {translateText("change zoom")}
          </div>

          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl + click
            </div>

            {translateText("quick open game")}
          </div>
        </Show>
      </div>

      <Show when={!props.onSettingsPage}>
        <div className="grid mt-[35px] gap-y-4">
          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl + f
            </div>

            {translateText("search bar")}
          </div>
          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl + \\
            </div>

            {translateText("hide sidebar")}
          </div>
          <div className="flex items-center gap-3">
            <div className="dark:bg-[#1c1c1c] bg-[#f1f1f1] py-1 px-3 w-[max-content] dark:text-[#ffffff80] text-[#12121280]">
              ctrl + click
            </div>

            {translateText("quick open game")}
          </div>
        </div>
      </Show>
    </>
  );
}
