import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { createSignal, onMount, Show } from "solid-js";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { Close, Steam } from "@/libraries/Icons.jsx";
import { writeUpdateData } from "@/services/libraryService";
import { CLEAR_VERSION } from "@/stores/applicationStore.js";
import { libraryData, setLibraryData } from "@/stores/libraryStore";
import { closeModal } from "@/stores/modalStore.js";
import { triggerToast } from "@/stores/toastStore";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";
import { translateText } from "@/utils/translateText";
import { Disconnected, Globe, Server } from "../../libraries/Icons";
import { importSteamGames } from "../../services/steamService";
import { openModal } from "../../stores/modalStore";
import { LoadingModal } from "./Loading";

export function SettingsModal() {
  const [showImportAndOverwriteConfirm, setShowImportAndOverwriteConfirm] = createSignal(false);
  const [connectedToInternet, setConnectedToInternet] = createSignal();
  const [connectedToServer, setConnectedToServer] = createSignal();

  onMount(async () => await checkConnections());

  async function checkConnections() {
    try {
      await checkIfConnectedToInternet();
      setConnectedToInternet(true);
    } catch {
      setConnectedToInternet(false);
    }

    try {
      await checkIfConnectedToServer();
      setConnectedToServer(true);
    } catch {
      setConnectedToServer(false);
    }
  }

  async function handleImportSteamGames() {
    try {
      await Promise.all([checkIfConnectedToInternet(), checkIfConnectedToServer()]);
    } catch (e) {
      triggerToast(e.message);
      return;
    }

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
    <div class="flex h-screen w-screen items-center justify-center bg-overlay align-middle">
      <div class="w-[70%] panel-surface p-6">
        <div class="flex justify-between">
          <div>
            <h1 class="title">{translateText("settings.title")}</h1>
          </div>

          <button
            type="button"
            class="tooltip-delayed-bottom btn w-max"
            onClick={() => {
              closeModal();
            }}
            data-tooltip={translateText("common.close")}
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
              fallback={<div class="">{translateText("settings.rounded_borders")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("settings.rounded_borders")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("settings.rounded_borders")}</div>
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
              fallback={<div class="">{translateText("game.title")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("game.title")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("game.title")}</div>
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
              fallback={<div class="">{translateText("folder.title")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("folder.title")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("folder.title")}</div>
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
              fallback={<div class="">{translateText("settings.quit_after_launch")}</div>}
            >
              <div class="relative">
                <div class="">{translateText("settings.quit_after_launch")}</div>
                <div class="absolute inset-0 opacity-70 blur-[5px]">{translateText("settings.quit_after_launch")}</div>
              </div>
            </Show>
          </button>

          <button
            type="button"
            onClick={async () => {
              const fonts = ["sans serif", "serif", "mono"];
              setLibraryData(
                "userSettings",
                "fontName",
                fonts[(fonts.indexOf(libraryData.userSettings.fontName) + 1) % 3],
              );

              await writeUpdateData();
            }}
            class="flex cursor-pointer gap-2 p-0 text-left"
          >
            <span class="text-muted">[{translateText("settings.font")}]</span>
            <div class="">
              {translateText(libraryData.userSettings.fontName) || translateText("settings.font_sans")}
            </div>
          </button>
          <button
            type="button"
            onClick={async () => {
              const themes = ["dark", "black", "light"];
              setLibraryData(
                "userSettings",
                "currentTheme",
                themes[(themes.indexOf(libraryData.userSettings.currentTheme) + 1) % 3],
              );

              await writeUpdateData();
            }}
            class="flex cursor-pointer gap-2 p-0 text-left"
          >
            <span class="text-muted">[{translateText("settings.theme")}]</span>
            <div class="">
              {translateText(libraryData.userSettings.currentTheme) || translateText("settings.theme_dark")}
            </div>
          </button>
          <div class="relative z-999999 flex cursor-pointer gap-2">
            <LanguageSelector onSettingsPage={true} />
          </div>
        </div>

        <div class="mt-[35px] flex flex-row items-start gap-4">
          <div>
            <button
              type="button"
              class="tooltip-bottom icon-btn"
              data-tooltip={translateText("steam.import_warning")}
              onClick={handleImportSteamGames}
            >
              <Show when={!libraryData.folders["imported from steam"]} fallback={translateText("steam.import")}>
                <Show when={showImportAndOverwriteConfirm()} fallback={translateText("steam.import")}>
                  <span class="danger-text">{translateText("steam.import_overwrite_warning")}</span>
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
              {translateText("settings.open_library_location")}
            </button>
            <span class="w-[50%] text-muted">{translateText("settings.library_description")}</span>
          </div>
        </div>

        <Hotkeys onSettingsPage={true} />

        <div class="mt-[35px] flex justify-between">
          <div class="flex items-center gap-2">
            <button
              class="small-btn tooltip-bottom"
              data-tooltip={translateText("settings.connection_retest")}
              type="button"
              onClick={checkConnections}
            >
              clear <span class="text-muted">v{CLEAR_VERSION}</span>
            </button>
            {connectedToInternet() ? (
              <>
                <div data-tooltip={translateText("settings.connected_internet")} class="tooltip-bottom">
                  <Globe />
                </div>

                {connectedToServer() ? (
                  <div data-tooltip={translateText("settings.connected_server")} class="tooltip-bottom">
                    <Server />
                  </div>
                ) : (
                  <div data-tooltip={translateText("settings.disconnected_server")} class="tooltip-bottom">
                    <Disconnected />
                  </div>
                )}
              </>
            ) : (
              <div data-tooltip={translateText("settings.disconnected_internet")} class="tooltip-bottom">
                <Disconnected />
              </div>
            )}
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
            {translateText("settings.feedback")}
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
            {translateText("settings.website")}
          </button>
          <div>
            {translateText("made_by")}{" "}
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
            {translateText("about.buy_me_a_coffee")}
          </button>
        </div>
      </div>
    </div>
  );
}
