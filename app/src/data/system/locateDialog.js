import { open } from "@tauri-apps/plugin-dialog";

async function openLocateDialog(filters) {
  try {
    return open({
      multiple: false,
      filters: [filters],
    });
  } catch (err) {
    console.error("file dialog open error:", err);
  }
}

export async function pickExecutable() {
  return openLocateDialog({
    name: "Executable",
    extensions: ["exe", "lnk", "url", "app"],
  });
}

export async function pickImage() {
  return openLocateDialog({
    name: "Image",
    extensions: ["png", "jpg", "jpeg", "webp"],
  });
}
