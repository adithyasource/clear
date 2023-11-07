import { createSignal, onMount } from "solid-js";

import { showToast, setShowToast } from "../Signals";

export function Toast(props) {
  console.log(props.error);

  return (
    <>
      <Show when={showToast()}>
        <div className="absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center">
          <div className="toast relative gap-1 functionalInteractables z-[100000000] w-max h-max ">
            {props.error}
          </div>
        </div>
      </Show>
    </>
  );
}
