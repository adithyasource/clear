// prevents additional console window on windows in release, do not remove!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use std::process::Command;
use std::vec::Vec;

#[tauri::command]
fn open_location(location: &str) {
    let _ = if cfg!(target_os = "windows") {
        Command::new("explorer").arg(location).spawn()
    } else {
        Command::new("open").arg(location).spawn()
    };
}

#[tauri::command]
fn get_platform() -> &'static str {
    std::env::consts::OS
}

#[tauri::command]
fn read_steam_vdf() -> Result<Vec<u32>, String> {
    let mut ids = Vec::new();

    let steam_dir = steamlocate::locate().map_err(|e| e.to_string())?;

    let libraries = steam_dir.libraries().map_err(|e| e.to_string())?;

    for library in libraries {
        let library = library.map_err(|e| e.to_string())?;

        for app in library.apps() {
            let app = app.map_err(|e| e.to_string())?;

            ids.push(app.app_id);
        }
    }

    Ok(ids)
}

#[tauri::command]
async fn download_image(link: String, location: String) -> Result<(), String> {
    use std::process::Command;

    let mut command = if cfg!(target_os = "windows") {
        let mut cmd = Command::new("powershell");
        cmd.args([
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            &format!("Invoke-WebRequest -Uri '{}' -OutFile '{}'", link, location),
        ]);
        cmd
    } else {
        let mut cmd = Command::new("curl");
        cmd.args(["-L", "-s", "-o", &location, &link]);
        cmd
    };

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }

    let status = command
        .status() // <-- wait here
        .map_err(|e| e.to_string())?;

    if status.success() {
        Ok(())
    } else {
        Err("Download failed".into())
    }
}

#[tauri::command]
fn delete_asset(path: String) -> Result<(), String> {
    std::fs::remove_file(&path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            open_location,
            read_steam_vdf,
            download_image,
            get_platform,
            delete_asset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
