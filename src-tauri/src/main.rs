// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::prelude::*;
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};

#[tauri::command]
fn open_location(location: &str) {
    Command::new("cmd")
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
    let mut file = File::open("C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf")
        .expect("File not found");
    let mut data = String::new();
    file.read_to_string(&mut data)
        .expect("Error while reading file");
    data.into()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_location,
            close_app,
            read_steam_vdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
