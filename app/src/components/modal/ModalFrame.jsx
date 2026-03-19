import { onMount, onCleanup } from "solid-js";
import { closeModal, modalState, modalVisible } from "../../stores/modalStore";

export function ModalFrame() {
  let modalRef;

  onMount(() => {
    function handler(e) {
      if (e.key === "Escape") {
        e.preventDefault();

        closeModal();
      }
    }

    document.addEventListener("keydown", handler);

    onCleanup(() => {
      document.removeEventListener("keydown", handler);
    });
  });

  return (
    <>
      {modalState() && (
        <div
          ref={modalRef}
          id="modal"
          class={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[#d1d1d1cc] dark:bg-[#121212cc] ${modalVisible() ? "showModal" : ""}`}
        >
          <div class="flex w-[84rem] justify-between max-large:w-[61rem]">{modalState().component}</div>
        </div>
      )}
    </>
  );
}
