use tauri::{AppHandle, SystemTrayEvent, SystemTray, CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTraySubmenu};
use tauri::Manager;
use tauri::api::dialog::blocking::message;
// 托盘菜单
#[tauri::command]
pub fn tray_init() -> SystemTray {
    let tray_menu_file = SystemTrayMenu::new()
        .add_submenu(SystemTraySubmenu::new( // 子菜单
            "File", // 子菜单名称
            SystemTrayMenu::new()
                .add_item(CustomMenuItem::new("new_file".to_string(), "New File")) // 子菜单项（新增）
                .add_item(CustomMenuItem::new("edit_file".to_string(), "Edit File")), // 子菜单项（编辑）

        ))
        .add_submenu(SystemTraySubmenu::new( // 子菜单
            "语言", // 子菜单名称
            SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("lang_english".to_string(), "English"))
            .add_item(CustomMenuItem::new("lang_zh_CN".to_string(), "简体中文"))
            .add_item(CustomMenuItem::new("lang_zh_HK".to_string(), "繁体中文"))
        ))
        .add_native_item(SystemTrayMenuItem::Separator) // 分割线
        .add_item(CustomMenuItem::new("hide".to_string(), "Hide")) // 隐藏应用窗口
        .add_item(CustomMenuItem::new("show".to_string(), "Show")) // 显示应用窗口
        .add_native_item(SystemTrayMenuItem::Separator) // 分割线
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit")); // 退出
    // 设置在右键单击系统托盘时显示菜单
    SystemTray::new().with_menu(tray_menu_file)
}

// 菜单事件
pub fn tray_handler(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();
    let parent_window = Some(&window);
    // 匹配点击事件
    match event {
        // 左键点击
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            println!("system tray received a left click");
        }
        // 右键点击
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => {
            println!("system tray received a right click");
        }
        // 双击，macOS / Linux 不支持
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            println!("system tray received a double click");
        }
        // 根据菜单 id 进行事件匹配
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "edit_file" => {
                message(parent_window, "Eidt File", "TODO");
            }
            "new_file" => {
                message(parent_window, "New File", "TODO");
            }
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                window.show().unwrap();
            }
            "hide" => {
                window.hide().unwrap();
            }
            lang if lang.contains("lang_") => { // 选择语言，匹配 id 前缀包含 `lang_` 的事件
                Lang::new(
                    app,
                    id, // 点击菜单的 id
                    vec![
                        Lang {
                            name: "English",
                            id: "lang_english",
                        },
                        Lang {
                            name: "繁体中文",
                            id: "lang_zh_HK",
                        },
                        Lang {
                            name: "简体中文",
                            id: "lang_zh_CN",
                        },
                    ],
                );
            }
            _ => {}
        },
        _ => {}
    }
}

struct Lang<'a> {
    name: &'a str,
    id: &'a str,
}

impl Lang<'static> {
    fn new(app: &AppHandle, id: String, langs: Vec<Lang>) {
        // 获取点击的菜单项
        langs.iter().for_each(|lang| {
            let handle = app.tray_handle().get_item(lang.id);
            if lang.id.to_string() == id.as_str() {
                // 设置菜单名称
                handle.set_title(format!("  {}", lang.name)).unwrap();
                // 还可以使用 `set_selected`、`set_enabled` 和 `set_native_image`（仅限 macOS）
                handle.set_selected(true).unwrap();
            } else {
                handle.set_title(lang.name).unwrap();
                handle.set_selected(false).unwrap();
            }
        });
    }
}