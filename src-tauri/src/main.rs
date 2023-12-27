// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::prelude::*;
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use tauri::{Manager, Window};

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
    let file_path = "C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf";

    let file = match File::open(file_path) {
        Ok(file) => file,
        Err(_) => {
            return "error".to_string();
        }
    };

    let mut data = String::new();
    if let Err(err) = file.take(1024).read_to_string(&mut data) {
        return "error".to_string();
    }

    // Return the data string
    data.into()
}

#[tauri::command]
async fn show_window(window: Window) {
    window
        .get_window("main")
        .expect("no window labeled 'main' found")
        .show()
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_location,
            close_app,
            read_steam_vdf,
            show_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
