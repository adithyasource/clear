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

function closeModal(closeModalImmediatelyOverride) {
  function closeHandler() {
    setModalVisible(false);

    setTimeout(() => {
      setModalState(null);
      setModalShowCloseConfirm(false);
    }, 200);
  }

  if (!modalState()) return;

  if (closeModalImmediatelyOverride) {
    closeHandler();
    return;
  }

  if (modalState().confirmWhileClosing) {
    if (modalShowCloseConfirm()) {
      closeHandler();
    } else {
      setModalShowCloseConfirm(true);

      const closeConfirmTimer = setTimeout(() => {
        clearTimeout(closeConfirmTimer);

        setModalShowCloseConfirm(false);
      }, 1500);
    }
  } else {
    closeHandler();
  }
}

export { modalState, modalVisible, modalShowCloseConfirm, closeModal, openModal };
