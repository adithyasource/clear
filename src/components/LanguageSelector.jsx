import { Show, useContext } from "solid-js";
import { translateText, changeLanguage } from "../Globals";

import { GlobalContext, UIContext } from "../Globals";

export function LanguageSelector(props) {
  const globalContext = useContext(GlobalContext);
  const uiContext = useContext(UIContext);

  return (
    <button
      onClick={() => {
        props.onSettingsPage
          ? uiContext.setShowSettingsLanguageSelector((x) => !x)
          : uiContext.setShowLanguageSelector((x) => !x);

        document.getElementById("firstDropdownItem").focus();
      }}
      className={
        props.onSettingsPage
          ? "w-full p-0 text-left"
          : "standardButton relative flex !w-max cursor-pointer items-center !justify-between bg-[#E8E8E8] !p-4 !text-black hover:!bg-[#d6d6d6] dark:bg-[#232323] dark:!text-white dark:hover:!bg-[#2b2b2b]"
      }>
      <span className="text-[#12121280] dark:text-[#ffffff80]">
        [{translateText("language")}]
      </span>
      &nbsp;
      {globalContext.libraryData.userSettings.language == "en"
        ? "english"
        : globalContext.libraryData.userSettings.language == "jp"
        ? "日本語"
        : globalContext.libraryData.userSettings.language == "es"
        ? "Español"
        : globalContext.libraryData.userSettings.language == "hi"
        ? "हिंदी"
        : globalContext.libraryData.userSettings.language == "ru"
        ? "русский"
        : globalContext.libraryData.userSettings.language == "fr"
        ? "Français"
        : "english"}
      <Show
        when={
          props.onSettingsPage
            ? uiContext.showSettingsLanguageSelector()
            : uiContext.showLanguageSelector()
        }>
        <div
          className={`absolute z-[100000] flex flex-col gap-4 border-2 border-solid border-[#1212121f] bg-[#FFFFFC] p-3 dark:border-[#ffffff1f] dark:bg-[#121212] ${
            props.onSettingsPage ? "top-[150%]" : "left-[1%] top-[120%]"
          }`}
          onMouseLeave={() => {
            props.onSettingsPage
              ? uiContext.setShowSettingsLanguageSelector(false)
              : uiContext.setShowLanguageSelector(false);
          }}
          onKeyDown={(e) => {
            if (e.key == "Escape") {
              props.onSettingsPage
                ? uiContext.setShowSettingsLanguageSelector(false)
                : uiContext.setShowLanguageSelector(false);
            }
          }}>
          <button
            className="p-0 text-left text-[#12121280] duration-150 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            id="firstDropdownItem"
            onClick={() => {
              changeLanguage("en");
            }}>
            english
          </button>
          <button
            className="p-0 text-left text-[#12121280] duration-75 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("fr");
            }}>
            Français [french]
          </button>
          <button
            className="p-0 text-left text-[#12121280] duration-75 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("ru");
            }}>
            русский [russian]
          </button>
          <button
            className="p-0 text-left text-[#12121280] duration-150 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("jp");
            }}>
            日本語 [japanese]
          </button>
          <button
            className="p-0 text-left text-[#12121280] duration-150 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("es");
            }}>
            Español [spanish]
          </button>
          <button
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                props.onSettingsPage
                  ? uiContext.setShowSettingsLanguageSelector(false)
                  : uiContext.setShowLanguageSelector(false);
              }
            }}
            className="p-0 text-left text-[#12121280] duration-150 hover:text-[#121212cc] dark:text-[#ffffff80] dark:hover:text-[#ffffffcc]"
            onClick={() => {
              changeLanguage("hi");
            }}>
            हिंदी [hindi]
          </button>
        </div>
      </Show>
    </button>
  );
}
