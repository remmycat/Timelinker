const { Menu, app, shell, BrowserWindow } = require('electron');
const { is, aboutMenu } = require('electron-util');

function sendMenuEvent(eventType, focusedWindow = BrowserWindow.getFocusedWindow()) {
    focusedWindow && focusedWindow.webContents.send(`menu__${eventType}`);
}

module.exports = ({ addNewWindow }) => {
    const template = [
        is.macos && {
            label: app.getName(),
            submenu: [
                {
                    role: 'about',
                },
                {
                    type: 'separator',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'services',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'hide',
                },
                {
                    role: 'hideothers',
                },
                {
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'quit',
                },
            ],
        },
        {
            label: 'Space',
            submenu: [
                {
                    label: 'New Column',
                    accelerator: 'CmdOrCtrl+N',
                    click: (item, focusedWindow) => sendMenuEvent('new-column', focusedWindow),
                },
                {
                    label: 'Control / Arrange Columns',
                    accelerator: 'CmdOrCtrl+P',
                    click: (item, focusedWindow) =>
                        sendMenuEvent('control-arrange-columns', focusedWindow),
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Open New Space',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => addNewWindow(),
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo',
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut',
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy',
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste',
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall',
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => focusedWindow && focusedWindow.reload(),
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: is.macos ? 'Ctrl+Command+F' : 'F11',
                    click: (item, focusedWindow) =>
                        focusedWindow && focusedWindow.setFullScreen(!focusedWindow.isFullScreen()),
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: is.macos ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: (item, focusedWindow) => focusedWindow && focusedWindow.toggleDevTools(),
                },
            ],
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize',
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Bring All to Front',
                    role: 'front',
                },
                ...(is.macos
                    ? [
                          {
                              type: 'separator',
                          },
                          {
                              label: 'Bring All to Front',
                              role: 'front',
                          },
                      ]
                    : []),
            ],
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Join Telegram Feedback Group',
                    click: () => shell.openExternal('https://t.me/joinchat/BylIxQ-lCLabrpPcBkojPw'),
                },
            ],
        },
    ].filter(Boolean);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
