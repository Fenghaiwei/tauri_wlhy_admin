use tauri::api::dialog::message;
use tauri::utils::assets::EmbeddedAssets;
use tauri::{AboutMetadata, Context, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};


#[tauri::command]
pub fn init(context: &Context<EmbeddedAssets>) -> Menu {
    // 获取应用名称
    let name = &context.package_info().name;
    // 应用主菜单
    let app_menu = Submenu::new(
        "",
        // MenuItem::About 为原生菜单
        Menu::new().add_native_item(MenuItem::About(name.into(), AboutMetadata::new())),
    );
    // 文件菜单（自定义菜单）
    let file_menu = Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("new_file".to_string(), "New File"))
            .add_item(CustomMenuItem::new("edit_file".to_string(), "Edit File")),
    );
    Menu::new()
    .add_submenu(app_menu)
    .add_submenu(file_menu)

}

//应用菜单处理事件
#[tauri::command]
pub fn handler(event: WindowMenuEvent) {
    // 菜单所属的窗口
    let win = Some(event.window());
    // 匹配菜单 id
    match event.menu_item_id() {
        "new_file" => {
            // debug 信息（终端输出）
            dbg!("new file");
        }
        "edit_file" => {
            // 发送信息到菜单所属窗口（弹窗形式）
            message(win, "Eidt File 菜单事件", "TODO 菜单事件");
        }
        "undo" => {
            dbg!("undo");
        }
        "redo" => {
            dbg!("redo");
        }
        _ => {}
    }
}


