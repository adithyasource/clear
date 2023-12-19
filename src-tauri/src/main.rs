// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::os::windows::process::CommandExt;

#[tauri::command]
fn open_location(location: &str) {
    Command::new("cmd")
    .args(&["/C", "start", "", location])
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .creation_flags(0x08000000) 
    .spawn();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_location])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}