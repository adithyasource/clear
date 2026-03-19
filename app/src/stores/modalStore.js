import { createSignal } from "solid-js";

const [modalState, setModalState] = createSignal(null);
const [modalVisible, setModalVisible] = createSignal(false);
const [modalShowCloseConfirm, setModalShowCloseConfirm] = createSignal(false);

export function openModal({ type, component, confirmWhileClosing }) {
  setModalState({ type, component: () => component, confirmWhileClosing });

  requestAnimationFrame(() => {
    setModalVisible(true);
  });
}

export function closeModal(closeModalImmediatelyOverride) {
  if (!modalState()) return;

  if (closeModalImmediatelyOverride || (modalState().confirmWhileClosing && modalShowCloseConfirm())) {
    setModalVisible(false);

    setTimeout(() => {
      setModalState(null);
      setModalShowCloseConfirm(false);
    }, 200);
  } else {
    setModalShowCloseConfirm(true);

    const closeConfirmTimer = setTimeout(() => {
      clearTimeout(closeConfirmTimer);

      setModalShowCloseConfirm(false);
    }, 1500);
  }
}

export { modalState, modalVisible, setModalVisible, modalShowCloseConfirm, setModalShowCloseConfirm };
