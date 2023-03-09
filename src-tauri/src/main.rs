#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]


mod view_operation;
mod menu_config;
mod tray_menu_config;


use view_operation::close_splashscreen;// 过渡页面显示

#[tauri::command]
fn main() {
let context = tauri::generate_context!();
  tauri::Builder::default()
      .menu(menu_config::init(&context)) // 将菜单添加到所有窗口
      .system_tray(tauri::SystemTray::default()) // 绑定系统菜单
      .system_tray(tray_menu_config::tray_init()) // 绑定托盘菜单
      .on_menu_event(menu_config::handler)
      .on_system_tray_event(tray_menu_config::tray_handler) // 绑定托盘菜单事件
      .invoke_handler(tauri::generate_handler![close_splashscreen])
      .run(context)
      .expect("error while running tauri application");

}
