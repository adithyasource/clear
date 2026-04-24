import { createSignal } from "solid-js";

export const [userIsTabbing, setUserIsTabbing] = createSignal(false);
export const [showNewVersionAvailable, setShowNewVersionAvailable] = createSignal(false);
export const [windowWidth, setWindowWidth] = createSignal(self.innerWidth);
