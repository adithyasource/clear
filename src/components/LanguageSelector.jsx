// importing globals
import { GlobalContext, translateText, UIContext, updateData } from "../Globals.jsx";

// importing code snippets and library functions
import { createSignal, Show, useContext } from "solid-js";

export function LanguageSelector(props) {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);

  const [showLanguageSelector, setShowLanguageSelector] = createSignal(false);

  async function changeLanguage(lang) {
    globalContext.setLibraryData("userSettings", "language", lang);

    await updateData();
    setShowLanguageSelector(false);
    uiContext.setShowSettingsLanguageSelector(false);
  }

  function returnLanguageFullName(shortName) {
    switch (shortName) {
      case "en":
        return "english";
      case "jp":
        return "日本語";
      case "es":
        return "Español";
      case "hi":
        return "हिंदी";
      case "ru":
        return "русский";
      case "fr":
        return "Français";
    }
    return "english";
  }

  return (
    <button
      type="button"
      onClick={() => {
        props.onSettingsPage
          ? uiContext.setShowSettingsLanguageSelector((x) => !x)
          : setShowLanguageSelector((x) => !x);

        document.getElementById("firstDropdownItem").focus();
      }}
      class={
        props.onSettingsPage
          ? "w-full p-0 text-left"
          : "standardButton relative flex !w-max cursor-pointer items-center !justify-between bg-[#E8E8E8] !p-4 !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
      }
    >
      <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("language")}]</span>
      &nbsp;
      {returnLanguageFullName(globalContext.libraryData.userSettings.language)}
      <Show when={props.onSettingsPage ? uiContext.showSettingsLanguageSelector() : showLanguageSelector()}>
        <div
          class={`absolute z-[100000] flex flex-col gap-4 border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212] ${
            props.onSettingsPage ? "top-[150%]" : "left-[1%] top-[120%]"
          }`}
          onMouseLeave={() => {
            props.onSettingsPage ? uiContext.setShowSettingsLanguageSelector(false) : setShowLanguageSelector(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              props.onSettingsPage ? uiContext.setShowSettingsLanguageSelector(false) : setShowLanguageSelector(false);
            }
          }}
        >
          <button
            type="button"
            class="p-0 text-left text-[#12121280] duration-150 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            id="firstDropdownItem"
            onClick={() => {
              changeLanguage("en");
            }}
          >
            english
          </button>
          <button
            type="button"
            class="p-0 text-left text-[#12121280] duration-75 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("fr");
            }}
          >
            Français [french]
          </button>
          <button
            type="button"
            class="p-0 text-left text-[#12121280] duration-75 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("ru");
            }}
          >
            русский [russian]
          </button>
          <button
            type="button"
            class="p-0 text-left text-[#12121280] duration-150 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("jp");
            }}
          >
            日本語 [japanese]
          </button>
          <button
            type="button"
            class="p-0 text-left text-[#12121280] duration-150 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("es");
            }}
          >
            Español [spanish]
          </button>
          <button
            type="button"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                props.onSettingsPage
                  ? uiContext.setShowSettingsLanguageSelector(false)
                  : setShowLanguageSelector(false);
              }
            }}
            class="p-0 text-left text-[#12121280] duration-150 motion-reduce:duration-0 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("hi");
            }}
          >
            हिंदी [hindi]
          </button>
        </div>
      </Show>
    </button>
  );
}
