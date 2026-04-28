import { open } from "@tauri-apps/plugin-dialog";
import { logError } from "@/utils/errorHandling";

async function openLocateDialog(filters) {
  try {
    return open({
      multiple: false,
      filters: [filters],
    });
  } catch (err) {
    await logError("locateDialog.openLocateDialog", err);
    return null;
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
