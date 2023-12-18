// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn open_explorer(location: &str) {
    let _ =  open::that(location);
}

fn main() {
    tauri::Builder::default()        
        .invoke_handler(tauri::generate_handler![open_explorer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}