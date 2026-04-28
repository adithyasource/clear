import { onCleanup, onMount } from "solid-js";
import { closeModal, modalState, modalVisible } from "@/stores/modalStore";

const focusableSelector = ["button", "input", "textarea", '[tabindex]:not([tabindex="-1"])'].join(", ");

export function ModalFrame() {
  let modalRef;
  let modalContentRef;

  onMount(() => {
    function handler(e) {
      if (!modalState() || !modalRef) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = modalRef.querySelectorAll(focusableSelector);

      if (focusableElements.length === 0) {
        e.preventDefault();
        modalContentRef?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const isInsideModal = modalRef.contains(activeElement);

      if (e.shiftKey) {
        if (activeElement === firstElement || !isInsideModal) {
          e.preventDefault();
          lastElement.focus();
        }

        return;
      }

      if (activeElement === lastElement || !isInsideModal) {
        e.preventDefault();
        firstElement.focus();
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
          class={`fixed inset-0 z-9999 flex h-screen w-screen items-center justify-center bg-[#d1d1d1cc] dark:bg-[#121212cc] ${modalVisible() ? "showModal" : ""}`}
        >
          <div ref={modalContentRef} tabindex="-1" class="flex justify-between">
            {modalState().component}
          </div>
        </div>
      )}
    </>
  );
}
