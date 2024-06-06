import { useContext, Show } from "solid-js";
import { ApplicationStateContext, UIContext, closeToast } from "../Globals";

export function Toast() {
  const uiContext = useContext(UIContext);
  const applicationStateContext = useContext(ApplicationStateContext);

  return (
    <>
      <Show when={uiContext.showToast()}>
        <button
          type="button"
          onClick={() => {
            closeToast();
          }}
          id="toast"
          class="absolute bottom-[20px] flex w-screen content-center items-center justify-center self-center ">
          <div class="standardButton toast relative z-[100000000] h-max !w-max gap-1 border-0 bg-[#E8E8E8] p-[10px] !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]">
            {applicationStateContext.toastMessage()}
          </div>
        </button>
      </Show>
    </>
  );
}
