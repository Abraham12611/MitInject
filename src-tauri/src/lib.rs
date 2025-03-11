// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//   tauri::Builder::default()
//     .setup(|app| {
//       if cfg!(debug_assertions) {
//         app.handle().plugin(
//           tauri_plugin_log::Builder::default()
//             .level(log::LevelFilter::Info)
//             .build(),
//         )?;
//       }
//       Ok(())
//     })
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

use tauri::{command, Emitter, Window};
use tauri_plugin_oauth::start;
use webbrowser;

#[command]
async fn open_url(url: String) -> Result<(), String> {
    webbrowser::open(&url).map_err(|e| e.to_string())
}

#[command]
async fn start_server(window: Window) -> Result<u16, String> {
    start(move |url| {
        let _ = window.emit("redirect_uri", url);
    })
    .map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();

    builder
        .invoke_handler(tauri::generate_handler![start_server, open_url])
        .plugin(tauri_plugin_oauth::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
