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
            class="absolute w-max bg-[#E8E8E8] p-2 dark:bg-[#232323]"
            style={{
              top: `${menuData().position[1]}px`,
              left: `${menuData().position[0]}px`,
            }}
          >
            <For each={menuData().items}>
              {(item, index) => (
                <button
                  data-index={index}
                  class="text-black! hover:bg-[#d6d6d6]! dark:text-white! dark:hover:bg-[#2b2b2b]! bg-[#E8E8E8] dark:bg-[#232323]"
                  type="button"
                  onClick={item.onClick}
                >
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
