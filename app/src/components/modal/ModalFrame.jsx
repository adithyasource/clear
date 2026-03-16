import { modalContent } from "../../stores/modalStore";

export function ModalFrame() {
  const Content = modalContent;

  return (
    <>
      {Content() && (
        <div class="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[#d1d1d1cc] dark:bg-[#121212cc]">
          <div class="flex w-[84rem] justify-between max-large:w-[61rem]">{Content()}</div>
        </div>
      )}
    </>
  );
}
