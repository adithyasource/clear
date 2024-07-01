// prevents additional console window on windows in release, do not remove!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::os::windows::process::CommandExt;
use std::process::{ Command, Stdio };
use tauri::{ Manager, Window };

#[tauri::command]
fn open_location(location: &str) {
  let _ = Command::new("cmd")
    .args(&["/C", "start", "", location])
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .creation_flags(0x08000000)
    .spawn();
}

#[tauri::command]
fn close_app() {
  std::process::exit(0x0);
}

#[tauri::command]
fn read_steam_vdf() -> String {
  match fs::read_to_string("C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf") {
    Ok(file_contents) => file_contents.into(),
    Err(_err) => {
      return "error".to_string();
    }
  }
}

#[tauri::command]
async fn show_window(window: Window) {
  window.get_window("main").expect("no window labeled 'main' found").show().unwrap();
}

#[tauri::command]
fn download_image(link: &str, location: &str) {
  let command_str = format!("Invoke-WebRequest '{}' -Outfile '{}'", link, location);

  let _ = Command::new("powershell")
    .args(&[command_str])
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .creation_flags(0x08000000)
    .output();
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![
        open_location,
        close_app,
        read_steam_vdf,
        show_window,
        download_image
      ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
