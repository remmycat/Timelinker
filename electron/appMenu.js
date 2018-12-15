const { Menu, app, shell } = require('electron');
const { is, aboutMenu } = require('electron-util');

module.exports = () => {
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
                    click: function(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload();
                    },
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (function() {
                        if (is.macos) return 'Ctrl+Command+F';
                        else return 'F11';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (function() {
                        if (is.macos) return 'Alt+Command+I';
                        else return 'Ctrl+Shift+I';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.toggleDevTools();
                    },
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
                    click: function() {
                        shell.openExternal('https://t.me/joinchat/BylIxQ-lCLabrpPcBkojPw');
                    },
                },
            ],
        },
    ].filter(Boolean);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
