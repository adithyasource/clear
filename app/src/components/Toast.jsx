/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { copyMessage, pauseTimer, startTimer, toastMessage, toastVisible } from "@/stores/toastStore.js";

export function Toast() {
  return (
    <Show when={toastVisible()}>
      <div
        class={`btn toast absolute top-[95%] left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 ${toastVisible() ? "show" : ""}`}
        onMouseEnter={pauseTimer}
        onMouseLeave={startTimer}
        onClick={copyMessage}
      >
        <p>{toastMessage()}</p>
      </div>
    </Show>
  );
}
