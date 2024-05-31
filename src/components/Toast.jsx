import { useContext } from "solid-js";
import { GlobalContext, ApplicationStateContext, UIContext } from "../Globals";

export function Toast() {
  let globalContext = useContext(GlobalContext);
  let uiContext = useContext(UIContext);
  let applicationStateContext = useContext(ApplicationStateContext);

  return (
    <>
      <Show when={uiContext.showToast()}>
        <div
          onClick={() => {
            uiContext.setShowToast(false);
          }}
          className="  absolute bottom-[20px] w-screen justify-center self-center content-center flex items-center">
          <div
            className={`border-0 p-[10px] rounded-[${
              globalContext.libraryData.userSettings.roundedBorders
                ? "6px"
                : "0px"
            }] relative gap-1 z-[100000000] standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] !w-max h-max toast`}>
            {applicationStateContext.toastMessage()}
          </div>
        </div>
      </Show>
    </>
  );
}
