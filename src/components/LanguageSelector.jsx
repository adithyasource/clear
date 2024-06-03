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
          : "standardButton dark:bg-[#232323] !text-black dark:!text-white bg-[#E8E8E8] hover:!bg-[#d6d6d6] dark:hover:!bg-[#2b2b2b] flex !justify-between items-center cursor-pointer relative !w-max !p-4"
      }>
      <span className="dark:text-[#ffffff80] text-[#12121280]">
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
          className={`flex flex-col gap-4 absolute border-2 border-solid dark:border-[#ffffff1f] border-[#1212121f] dark:bg-[#121212] bg-[#FFFFFC] p-3 z-[100000] ${
            props.onSettingsPage ? "top-[150%]" : "top-[120%] left-[1%]"
          }`}
          onMouseLeave={() => {
            props.onSettingsPage
              ? uiContext.setShowSettingsLanguageSelector(false)
              : uiContext.setShowLanguageSelector(false);
          }}>
          <button
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
            id="firstDropdownItem"
            onClick={() => {
              changeLanguage("en");
            }}>
            english
          </button>
          <button
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75 p-0 text-left"
            onClick={() => {
              changeLanguage("fr");
            }}>
            Français [french]
          </button>
          <button
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-75 p-0 text-left"
            onClick={() => {
              changeLanguage("ru");
            }}>
            русский [russian]
          </button>
          <button
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
            onClick={() => {
              changeLanguage("jp");
            }}>
            日本語 [japanese]
          </button>
          <button
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
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
            className="dark:text-[#ffffff80] text-[#12121280] dark:hover:text-[#ffffffcc] hover:text-[#121212cc] duration-150 p-0 text-left"
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
