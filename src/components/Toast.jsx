import {
  showToast,
  toastError,
  secondaryColor,
  roundedBorders,
} from "../Signals";

export function Toast() {
  return (
    <>
      <Show when={showToast()}>
        <div className="absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center">
          <div
            className={`border-0 p-[10px] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] relative gap-1 functionalInteractables z-[100000000] w-max h-max bg-[${secondaryColor()}]`}>
            {toastError()}
          </div>
        </div>
      </Show>
    </>
  );
}
