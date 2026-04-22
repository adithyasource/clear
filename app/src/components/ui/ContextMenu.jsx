/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { For, onCleanup, onMount } from "solid-js";
import { modalVisible } from "@/stores/modalStore";
import { menuData, clearContextMenuData } from "../../stores/contextMenuStore";

export function ContextMenu() {
  onMount(() => {
    function handler(e) {
      if (e.key === "Escape") {
        e.preventDefault();

        clearContextMenuData();
      }
    }

    document.addEventListener("keydown", handler);

    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return (
    <>
      {menuData() && (
        <div
          class="fixed inset-0 z-999999 h-screen w-screen"
          onClick={clearContextMenuData}
          onContextMenu={clearContextMenuData}
        >
          <div
            id="menu"
            class="absolute flex w-max flex-col gap-1 bg-[#E8E8E8cc] p-2 backdrop-blur-[10px] dark:bg-[#272727cc]"
            style={{
              top: `${menuData().position[1]}px`,
              left: `${menuData().position[0]}px`,
            }}
          >
            <For each={menuData().items}>
              {(item, index) => (
                <button data-index={index} class="small-btn" type="button" onClick={item.onClick}>
                  {item.title}
                </button>
              )}
            </For>
          </div>
        </div>
      )}
    </>
  );
}
