/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { For, onCleanup, onMount } from "solid-js";
import { clearContextMenuData, menuData } from "../../stores/contextMenuStore";

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
            class="absolute z-100000 flex flex-col gap-4 border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-2 dark:border-[#ffffff1f] dark:bg-[#121212]"
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
