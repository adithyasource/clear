import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

export const [userIsTabbing, setUserIsTabbing] = createSignal(false);
export const [showNewVersionAvailable, setShowNewVersionAvailable] = createSignal(false);
export const [windowWidth, setWindowWidth] = createSignal(self.innerWidth);
export const SYSTEM_PLATFORM = await invoke("get_platform");
export const CLEAR_VERSION = "1.1.0";
