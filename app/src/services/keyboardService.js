// import { saveLibrary } from "@/services/libraryService";
// import { setLibraryData } from "@/stores/libraryStore";
// import { openModal } from "@/stores/modalStore";
//
// export function handleResizeKeyDown(e) {
//   const modifierKey = isMac() ? e.metaKey : e.ctrlKey;
//   if (!modifierKey) return;
//
//   switch (e.code) {
//     case "Equal":
//       setLibraryData("userSettings", "zoomLevel", (z) => Math.min(z + 1, 2));
//       saveLibrary();
//       break;
//
//     case "Minus":
//       setLibraryData("userSettings", "zoomLevel", (z) => Math.max(z - 1, 0));
//       saveLibrary();
//       break;
//
//     case "KeyN":
//       e.preventDefault();
//       openModal({ type: "newGame" });
//       break;
//
//     case "Backslash":
//       e.preventDefault();
//       toggleSidebar();
//       break;
//   }
// }
//
// function isMac() {
//   return navigator.platform.toLowerCase().includes("mac");
// }
