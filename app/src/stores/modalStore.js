import { createSignal } from "solid-js";

const [modalState, setModalState] = createSignal(null);
const [modalVisible, setModalVisible] = createSignal(false);
const [modalShowCloseConfirm, setModalShowCloseConfirm] = createSignal(false);

function openModal({ type, component, confirmWhileClosing }) {
  setModalState({ type, component: () => component, confirmWhileClosing });

  requestAnimationFrame(() => {
    setModalVisible(true);
  });
}

let closeConfirmTimer = null;
let closeHandlerTimer = null;

function closeModal(force = false) {
  const state = modalState();
  if (!state) return;

  const doClose = () => {
    setModalVisible(false);

    clearTimeout(closeHandlerTimer);
    closeHandlerTimer = setTimeout(() => {
      setModalState(null);
      setModalShowCloseConfirm(false);
      closeHandlerTimer = null;
    }, 200);
  };

  if (force || !state.confirmWhileClosing) {
    doClose();
    return;
  }

  if (modalShowCloseConfirm()) {
    doClose();
    return;
  }

  setModalShowCloseConfirm(true);

  clearTimeout(closeConfirmTimer);
  closeConfirmTimer = setTimeout(() => {
    setModalShowCloseConfirm(false);
    closeConfirmTimer = null;
  }, 1500);
}

export { closeModal, modalShowCloseConfirm, modalState, modalVisible, openModal };
