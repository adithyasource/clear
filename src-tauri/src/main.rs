// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

use window_shadows::set_shadow;

#[tauri::command]
fn openGame(gameLocation: &str) {
    open::that(gameLocation);
}

#[tauri::command]
fn openLibLocation() {
    open::that(format!("C:\\Users\\{}\\AppData\\Roaming\\com.adithya.clear", whoami::username()));
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                let window = app.get_window("main").unwrap();
                set_shadow(&window, true).expect("Unsupported platform!");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![openGame, openLibLocation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}