import { createSignal } from "solid-js";

export const [menuData, setMenuData] = createSignal();

export function openContextMenu(e, items) {
  e.preventDefault();

  setMenuData({
    visible: true,
    items: items,
    position: [e.clientX, e.clientY],
  });
}

export function clearContextMenuData() {
  setMenuData();
}

// { visible: false, items: [] }
// item will be {
//   title: ""
//   onClick: func
// }
