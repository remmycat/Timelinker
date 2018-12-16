const { remote, webFrame } = require('electron');
const ElectronStore = require('electron-store');
const { is } = require('electron-util');
const { API, SpaceStore, SharedStore, Metadata } = remote.getCurrentWindow().injected;

window.API = API;
window.Metadata = { ...Metadata };
window.env = { ...is };
window.SpaceStore = new ElectronStore(SpaceStore);
window.SharedStore = new ElectronStore(SharedStore);

window.Logs = {};

const ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class MonkeyPatchedResizeObserver extends ResizeObserver {
    observe(...args) {
        // <webview> implementation uses ResizeObserver to generate 'resize' events, which we truly don't care about
        // ResizeObserver produced weird loop errors on window, which i "fixed" with this hack 🤷🏻‍♀️
        // location: electron/preload.js
        if ('tagName' in args[0] && args[0].tagName === 'IFRAME') return;
        return super.observe(...args);
    }
};
