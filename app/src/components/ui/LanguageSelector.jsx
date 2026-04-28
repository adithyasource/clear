/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { createSignal, Show } from "solid-js";
import { writeUpdateData } from "@/services/libraryService.js";
import { libraryData, setLibraryData } from "@/stores/libraryStore.js";
import { translateText } from "@/utils/translateText";

export function LanguageSelector({ onSettingsPage }) {
  const [showSettingsLanguageSelector, setShowSettingsLanguageSelector] = createSignal(false);
  const [showLanguageSelector, setShowLanguageSelector] = createSignal(false);

  async function changeLanguage(lang) {
    console.log(lang);
    setLibraryData("userSettings", "language", lang);
    console.log(libraryData);
    await writeUpdateData();
    setShowLanguageSelector(false);
    setShowSettingsLanguageSelector(false);
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
        onSettingsPage ? setShowSettingsLanguageSelector((x) => !x) : setShowLanguageSelector((x) => !x);

        document.getElementById("firstDropdownItem").focus();
      }}
      class={onSettingsPage ? "w-full cursor-pointer p-0 text-left" : "btn relative"}
    >
      <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("language")}]</span>
      &nbsp;
      {returnLanguageFullName(libraryData.userSettings.language)}
      <Show when={onSettingsPage ? showSettingsLanguageSelector() : showLanguageSelector()}>
        <div
          class={`absolute z-100000 flex flex-col gap-4 border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212] ${
            onSettingsPage ? "top-[150%]" : "top-[120%] left-[1%]"
          }`}
          onMouseLeave={() => {
            onSettingsPage ? setShowSettingsLanguageSelector(false) : setShowLanguageSelector(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onSettingsPage ? setShowSettingsLanguageSelector(false) : setShowLanguageSelector(false);
            }
          }}
        >
          <button
            type="button"
            class="language-item"
            id="firstDropdownItem"
            onClick={() => {
              changeLanguage("en");
            }}
          >
            english
          </button>
          <button
            type="button"
            class="language-item"
            onClick={() => {
              changeLanguage("fr");
            }}
          >
            Français [french]
          </button>
          <button
            type="button"
            class="language-item"
            onClick={() => {
              changeLanguage("ru");
            }}
          >
            русский [russian]
          </button>
          <button
            type="button"
            class="language-item"
            onClick={() => {
              changeLanguage("jp");
            }}
          >
            日本語 [japanese]
          </button>
          <button
            type="button"
            class="language-item"
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
                onSettingsPage ? setShowSettingsLanguageSelector(false) : setShowLanguageSelector(false);
              }
            }}
            class="language-item"
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
