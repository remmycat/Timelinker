const { BrowserWindow } = require('electron');
const path = require('path');

module.exports = (onClose, { x, y, width, height } = { width: 800, height: 600 }) => {
    win = new BrowserWindow({
        width,
        height,
        x,
        y,
        title: 'Timelinker',
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        },
    });
    win.on('closed', onClose);
    return win;
};
