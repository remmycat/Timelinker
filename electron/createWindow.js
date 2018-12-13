const { BrowserWindow } = require('electron');
const path = require('path');
const env = require('./env');

module.exports = (onClose, { x, y, width, height } = { width: 800, height: 600 }) => {
    win = new BrowserWindow({
        width,
        height,
        x,
        y,
        title: 'Timelinker',
        webPreferences: {
            nodeIntegration: true,
            devTools: env.debug || undefined,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        },
    });
    win.on('closed', onClose);
    return win;
};
