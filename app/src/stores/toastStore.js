import { createSignal } from "solid-js";
import { getErrorMessage } from "@/utils/errorHandling";

export const [toastMessage, setToastMessage] = createSignal("");
export const [toastVisible, setToastVisible] = createSignal(false);

let toastTimeout;

function startCloseTimer() {
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    setToastVisible(false);
  }, 1500);
}

export function triggerToast(message) {
  clearTimeout(toastTimeout);
  setToastVisible(false);
  setToastMessage(getErrorMessage(message));
  setToastVisible(true);
  startCloseTimer();
}

export function pauseTimer() {
  clearTimeout(toastTimeout);
}

export function startTimer() {
  startCloseTimer();
}

export function copyMessage() {
  navigator.clipboard.writeText(toastMessage());
  setToastMessage("copied error to clipboard");
  startCloseTimer();
}
