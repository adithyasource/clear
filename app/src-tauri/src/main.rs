// prevents additional console window on windows in release, do not remove!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use std::io;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{Manager, Window};
#[cfg(target_os = "windows")]
use winreg::enums::*;
#[cfg(target_os = "windows")]
use winreg::RegKey;

#[tauri::command]
fn open_location(location: &str) {
    let mut command = if cfg!(target_os = "windows") {
        let mut cmd = Command::new("cmd");
        cmd.args(&["/C", "start", "", location]);
        cmd
    } else {
        let mut cmd = Command::new("open");
        cmd.arg(location);
        cmd
    };

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }

    let _ = command.stdout(Stdio::null()).stderr(Stdio::null()).spawn();
}

#[tauri::command]
fn close_app() {
    std::process::exit(0x0);
}

#[tauri::command]
fn get_platform() -> String {
    let platform = env::consts::OS;
    return platform.to_string();
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
fn download_image(link: &str, location: &str) {
    let command_str = format!("Invoke-WebRequest '{}' -Outfile '{}'", link, location);

    let mut command = if cfg!(target_os = "windows") {
        let mut cmd = Command::new("powershell");
        cmd.arg("-Command").arg(command_str);
        cmd
    } else {
        let mut cmd = Command::new("curl");
        cmd.args(&["-o", location, link]);
        cmd
    };

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        command.creation_flags(0x08000000);
    }

    let _ = command.stdout(Stdio::null()).stderr(Stdio::null()).spawn();
}

#[tauri::command]
fn delete_assets(hero_image: &str, grid_image: &str, logo: &str, icon: &str) {
    let files = [hero_image, grid_image, logo, icon];

    for file in files.iter() {
        let mut command = if cfg!(target_os = "windows") {
            let command_str = format!(" Remove-Item -Force \"{}\"", file);

            let mut cmd = Command::new("powershell");
            cmd.arg("-Command").arg(command_str);
            cmd
        } else {
            let mut cmd = Command::new("rm");
            cmd.arg("-f").arg(file);
            cmd
        };

        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            command.creation_flags(0x08000000);
        }

        let _ = command.stdout(Stdio::null()).stderr(Stdio::null()).spawn();
    }
}

#[tauri::command]
fn check_connection() -> String {
    let (command, args) = if cfg!(target_os = "windows") {
        (
            "cmd",
            vec![
                "/C",
                "ping -n 1 www.google.com > nul && echo true || echo false",
            ],
        )
    } else {
        (
            "sh",
            vec![
                "-c",
                "ping -c 1 www.google.com > /dev/null && echo true || echo false",
            ],
        )
    };

    let output = Command::new(command)
        .args(args)
        .output()
        .expect("failed to execute process");

    let output_str = String::from_utf8_lossy(&output.stdout);
    output_str.trim().to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            open_location,
            close_app,
            read_steam_vdf,
            show_window,
            download_image,
            check_connection,
            get_platform,
            delete_assets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
