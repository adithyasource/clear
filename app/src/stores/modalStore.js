import { createSignal } from "solid-js";

const [modalContent, setModalContent] = createSignal(null);

export function openModal(component) {
  setModalContent(() => component);
}

export function closeModal() {
  setModalContent(null);
}

export { modalContent };
