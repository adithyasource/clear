// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

use window_shadows::set_shadow;

#[tauri::command]
fn open_explorer(location: &str) {
    let _ =  open::that(location);
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
        .invoke_handler(tauri::generate_handler![open_explorer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}