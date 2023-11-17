import {
  showToast,
  setShowToast,
  toastError,
  roundedBorders,
} from "../Signals";

export function Toast() {
  return (
    <>
      <Show when={showToast()}>
        <div
          onClick={() => {
            setShowToast(false);
          }}
          className="absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center">
          <div
            className={`border-0 p-[10px] rounded-[${
              roundedBorders() ? "6px" : "0px"
            }] relative gap-1 z-[100000000] standardButton !w-max h-max `}>
            {toastError()}
          </div>
        </div>
      </Show>
    </>
  );
}
