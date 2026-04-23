// prevents additional console window on windows in release, do not remove!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use std::fs;
use std::io;
use std::path::PathBuf;
use std::process::Command;
use tauri::Window;
#[cfg(target_os = "windows")]
use winreg::enums::*;
#[cfg(target_os = "windows")]
use winreg::RegKey;

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

#[cfg(target_os = "windows")]
fn get_steam_path() -> io::Result<String> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let steam_key = hkcu.open_subkey("SOFTWARE\\Valve\\Steam")?;
    let steam_path: String = steam_key.get_value("SteamPath")?;
    print!("found steam path: {}", steam_path);
    Ok(steam_path)
}

#[cfg(not(target_os = "windows"))]
fn get_steam_path() -> io::Result<String> {
    let home_dir = std::env::var("HOME").expect("HOME environment variable not set");
    Ok(PathBuf::from(home_dir)
        .join("Library")
        .join("Application Support")
        .join("steam")
        .to_string_lossy()
        .to_string())
}

#[tauri::command]
fn read_steam_vdf() -> String {
    let vdf_location = match get_steam_path() {
        Ok(steam_path) => PathBuf::from(steam_path)
            .join("steamapps")
            .join("libraryfolders.vdf")
            .to_string_lossy()
            .to_string(),
        Err(err) => {
            if cfg!(target_os = "windows") {
                println!("error reading steam path: {}", err);
                PathBuf::from("C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf")
                    .to_string_lossy()
                    .to_string()
            } else {
                let home_dir = std::env::var("HOME").expect("HOME environment variable not set");
                PathBuf::from(home_dir)
                    .join("Library/Application Support/Steam/steamapps/libraryfolders.vdf")
                    .to_string_lossy()
                    .to_string()
            }
        }
    };

    match fs::read_to_string(vdf_location) {
        Ok(file_contents) => file_contents.into(),
        Err(err) => {
            println!("error reading VDF file: {}", err);
            return "error".to_string();
        }
    }
}

#[tauri::command]
fn show_window(window: Window) {
    window.show().unwrap();
    window.set_focus().ok();
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
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {}))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            open_location,
            read_steam_vdf,
            download_image,
            get_platform,
            show_window,
            delete_asset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
