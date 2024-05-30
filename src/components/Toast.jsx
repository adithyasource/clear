import { showToast, setShowToast, toastError, libraryData } from "../Signals";

export function Toast() {
  return (
    <>
      <Show when={showToast()}>
        <div
          onClick={() => {
            setShowToast(false);
          }}
          className="  absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center">
          <div
            className={`border-0 p-[10px] rounded-[${
              libraryData.userSettings.roundedBorders ? "6px" : "0px"
            }] relative gap-1 z-[100000000] standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max h-max toast`}>
            {toastError()}
          </div>
        </div>
      </Show>
    </>
  );
}
