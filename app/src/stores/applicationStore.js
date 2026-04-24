import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

export const [userIsTabbing, setUserIsTabbing] = createSignal(false);
export const [windowWidth, setWindowWidth] = createSignal(self.innerWidth);
export const [systemPlatform, setSystemPlatform] = createSignal(null);
export const CLEAR_VERSION = "1.1.0";

export async function initApplicationStore() {
  const platform = await invoke("get_platform");
  setSystemPlatform(platform);
}
