# 🚀 QuickFire

**Execute VS Code commands and nested workflows instantly with a single keystroke—no Enter required.**

[![Version](https://img.shields.io/visual-studio-marketplace/v/dani84bs.quickfire)](https://marketplace.visualstudio.com/items?itemName=dani84bs.quickfire)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

QuickFire allows you to create a customized menu of actions that you can trigger instantly. Unlike the default QuickPick, QuickFire executes the command as soon as you press the assigned key—no `Enter` required.

---

## ✨ Features

*   🚀 **Single Keystroke Execution**: Press a key, and the command fires immediately.
*   📂 **Nested Menus**: Organize your complex workflows into logical sub-menus.
*   ⚙️ **Argument Support**: Pass strings, objects, or even `vscode://` URIs directly to commands.
*   🔙 **Rapid Navigation**: Use `Backspace` to quickly navigate back up through nested menus.
*   ⌨️ **Keyboard Centric**: Designed for power users who want to keep their hands on the home row.

---

## 🚀 Getting Started

1.  **Install** the extension from the VS Code Marketplace.
2.  **Configure** your actions in `settings.json` (see [Configuration](#-configuration) below).
3.  **Bind** the command `QuickFire: Show actions` (`quickfire.showQuickActions`) to a convenient keyboard shortcut like `Ctrl+Alt+Q` or `Cmd+Shift+Space`.

---

## ⚙️ Configuration

Open your user `settings.json` and add your custom actions to the `quickfire.actions` array.

### Example Configuration

```json
{
  "quickfire.actions": [
    {
      "key": "f",
      "description": "File operations",
      "actions": [
        {
          "key": "n",
          "description": "New File",
          "command": "explorer.newFile"
        },
        {
          "key": "s",
          "description": "Save All",
          "command": "workbench.action.files.saveAll"
        }
      ]
    },
    {
      "key": "g",
      "description": "Open GitHub",
      "command": "vscode.open",
      "args": "https://github.com/dani84bs/quickfire"
    },
    {
      "key": "t",
      "description": "Terminal",
      "command": "workbench.action.terminal.toggleTerminal"
    }
  ]
}
```

### Action Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `key` | `string` | The single character that triggers the action. |
| `description` | `string` | A brief label shown in the menu. |
| `command` | `string` | The VS Code command ID to execute (e.g., `workbench.action.findInFiles`). |
| `args` | `any` | (Optional) Arguments to pass to the command. |
| `actions` | `array` | (Optional) A list of sub-actions to create a nested menu. |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue on [GitHub](https://github.com/dani84bs/quickfire).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by [Daniele Trainini](https://github.com/dani84bs)
