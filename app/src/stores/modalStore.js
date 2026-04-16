import { createSignal } from "solid-js";

const [modalState, setModalState] = createSignal(null);
const [modalVisible, setModalVisible] = createSignal(false);
const [modalShowCloseConfirm, setModalShowCloseConfirm] = createSignal(false);

async function openModal({ type, component, confirmWhileClosing, onClose }) {
  const state = modalState();
  if (state) {
    // we need to close old with animation and open new modal
    await doClose();
  }

  setModalState({ type, component: () => component, confirmWhileClosing, onClose });

  requestAnimationFrame(() => {
    setModalVisible(true);
  });
}

let closeConfirmTimer = null;
let closeHandlerTimer = null;

async function doClose() {
  return new Promise((res, _rej) => {
    setModalVisible(false);

    clearTimeout(closeHandlerTimer);
    closeHandlerTimer = setTimeout(() => {
      setModalState(null);
      setModalShowCloseConfirm(false);
      closeHandlerTimer = null;

      res();
    }, 200);
  });
}

function closeModal(force = false) {
  const state = modalState();
  if (!state) return;

  if (force || !state.confirmWhileClosing) {
    doClose();
    state.onClose?.();
    return;
  }

  if (modalShowCloseConfirm()) {
    doClose();
    state.onClose?.();
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
