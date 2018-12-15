const { remote, webFrame } = require('electron');
const ElectronStore = remote.require('electron-store');
const { API, SpaceStore, SharedStore, SpaceId } = remote.getCurrentWindow().injected;

window.API = API;
window.SpaceId = SpaceId;
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
