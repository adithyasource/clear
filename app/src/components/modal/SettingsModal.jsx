import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { createSignal, Show } from "solid-js";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { Close, Steam } from "@/libraries/Icons.jsx";
import { writeUpdateData } from "@/services/libraryService";
import { CLEAR_VERSION } from "@/stores/applicationStore.js";
import { libraryData, setLibraryData } from "@/stores/libraryStore";
import { closeModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore";
import { translateText } from "@/utils/translateText";
import { importSteamGames } from "../../services/steamService";
import { openModal } from "../../stores/modalStore";
import { LoadingModal } from "./Loading";

export function SettingsModal() {
  const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] = createSignal(false);

  async function handleImportSteamGames() {
    const hasSteamFolder = libraryData.folders.some((folder) => folder.name === "imported from steam");
    let shouldImport = false;

    if (hasSteamFolder) {
      if (showImportAndOverwriteConfirm()) {
        shouldImport = true;
      } else {
        setShowImportAndOverwriteConfirm(true);

        setTimeout(() => {
          setShowImportAndOverwriteConfirm(false);
        }, 2500);
      }
    } else {
      shouldImport = true;
    }

    if (shouldImport) {
      try {
        openModal({
          type: "loading",
          component: LoadingModal,
        });

        await importSteamGames();

        closeModal(true);
      } catch (err) {
        closeModal(true);
        triggerToast(`error: ${err.message}`);
      }
    }
  }

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-[#d1d1d166] align-middle dark:bg-[#12121266]">
      <div class="w-[70%] border-2 border-[#1212121f] border-solid bg-[#FFFFFC] p-6 dark:border-[#ffffff1f] dark:bg-[#121212]">
        <div class="flex justify-between">
          <div>
            <h1 class="title">{translateText("settings")}</h1>
          </div>

          <button
            type="button"
            class="tooltip-delayed-bottom btn w-max"
            onClick={() => {
              closeModal();
            }}
            data-tooltip={translateText("close")}
          >
            <Close />
          </button>
        </div>

        <div class="mt-[25px] grid grid-cols-3 gap-y-4">
          <button
            type="button"
            onClick={async () => {
              setLibraryData("userSettings", "roundedBorders", (x) => !x);

              await writeUpdateData();
            }}
            class="relative cursor-pointer p-0 text-left"
          >
            <Show
              when={libraryData.userSettings.roundedBorders}
              fallback={<div class="">{translateText("rounded borders")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("rounded borders")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("rounded borders")}</div>
              </div>
            </Show>
          </button>
          <button
            type="button"
            onClick={async () => {
              setLibraryData("userSettings", "gameTitle", (x) => !x);

              await writeUpdateData();
            }}
            class="relative cursor-pointer p-0 text-left"
          >
            <Show
              when={libraryData.userSettings.gameTitle}
              fallback={<div class="">{translateText("game title")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("game title")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("game title")}</div>
              </div>
            </Show>
          </button>
          <button
            type="button"
            onClick={async () => {
              setLibraryData("userSettings", "folderTitle", (x) => !x);

              await writeUpdateData();
            }}
            class="relative cursor-pointer p-0 text-left"
          >
            <Show
              when={libraryData.userSettings.folderTitle}
              fallback={<div class="">{translateText("folder title")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("folder title")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("folder title")}</div>
              </div>
            </Show>
          </button>
          <button
            type="button"
            onClick={async () => {
              setLibraryData("userSettings", "quitAfterOpen", (x) => !x);

              await writeUpdateData();
            }}
            class="relative cursor-pointer p-0 text-left"
          >
            <Show
              when={libraryData.userSettings.quitAfterOpen}
              fallback={<div class="">{translateText("quit after opening game")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("quit after opening game")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("quit after opening game")}</div>
              </div>
            </Show>
          </button>

          <button
            type="button"
            onClick={async () => {
              switch (libraryData.userSettings.fontName) {
                case "sans serif":
                  setLibraryData("userSettings", "fontName", "serif");
                  break;
                case "serif":
                  setLibraryData("userSettings", "fontName", "mono");
                  break;
                case "mono":
                  setLibraryData("userSettings", "fontName", "sans serif");
              }

              await writeUpdateData();
            }}
            class="flex cursor-pointer gap-2 p-0 text-left"
          >
            <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("font")}]</span>
            <div class="">{translateText(libraryData.userSettings.fontName) || translateText("sans serif")}</div>
          </button>
          <button
            type="button"
            onClick={async () => {
              libraryData.userSettings.currentTheme === "dark"
                ? setLibraryData("userSettings", "currentTheme", "light")
                : setLibraryData("userSettings", "currentTheme", "dark");

              await writeUpdateData();
            }}
            class="flex cursor-pointer gap-2 p-0 text-left"
          >
            <span class="text-[#12121280] dark:text-[#ffffff80]">[{translateText("theme")}]</span>
            <div class="">{translateText(libraryData.userSettings.currentTheme) || translateText("dark")}</div>
          </button>
          <div class="relative flex cursor-pointer gap-2">
            <LanguageSelector onSettingsPage={true} />
          </div>
        </div>

        <div class="mt-[35px] flex flex-row items-start gap-4">
          <div>
            <button
              type="button"
              class="tooltip-bottom icon-btn"
              data-tooltip={translateText("might not work perfectly!")}
              onClick={handleImportSteamGames}
            >
              <Show when={!libraryData.folders["imported from steam"]} fallback={translateText("import Steam games")}>
                <Show when={showImportAndOverwriteConfirm()} fallback={translateText("import Steam games")}>
                  <span class="text-[#FF3636]">
                    {translateText("'imported from steam' folder will be overwritten. confirm?")}
                  </span>
                </Show>
              </Show>

              <Steam />
            </button>
          </div>

          <div class="flex items-start gap-3">
            <button
              type="button"
              class="btn w-max"
              onClick={async () => {
                const appDataDirPath = await appDataDir();

                invoke("open_location", {
                  location: appDataDirPath,
                });
              }}
            >
              {translateText("open library location")}
            </button>
            <span class="w-[50%] text-[#12121280] dark:text-[#ffffff80]">
              {translateText("these are all the files that the app stores on your pc")}
            </span>
          </div>
        </div>

        <Hotkeys onSettingsPage={true} />

        <div class="mt-[35px] flex justify-between">
          <div>
            clear <span class="text-[#12121280] dark:text-[#ffffff80]">v{CLEAR_VERSION}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              invoke("open_location", {
                location: "https://clear.adithya.zip/feedback",
              });
            }}
            class="cursor-pointer p-0 underline"
          >
            {translateText("feedback")}
          </button>
          <button
            type="button"
            onClick={() => {
              invoke("open_location", {
                location: "https://clear.adithya.zip/",
              });
            }}
            class="cursor-pointer p-0 underline"
          >
            {translateText("website")}
          </button>
          <div>
            {translateText("made by")}{" "}
            <button
              type="button"
              onClick={() => {
                invoke("open_location", {
                  location: "https://adithya.zip/",
                });
              }}
              class="cursor-pointer p-0 underline"
            >
              {" "}
              adithya
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              invoke("open_location", {
                location: "https://ko-fi.com/adithyasource",
              });
            }}
            class="cursor-pointer p-0 underline"
          >
            {translateText("buy me a coffee")}
          </button>
        </div>
      </div>
    </div>
  );
}
