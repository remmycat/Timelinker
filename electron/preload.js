const { remote, webFrame, ipcRenderer: ipc } = require('electron');
const ElectronStore = require('electron-store');
const { is } = require('electron-util');
const { EventEmitter } = require('events');
const { API, StoreConfigs, Metadata } = remote.getCurrentWindow().injected;

class SharedElectronStore extends ElectronStore {
    get store() {
        return super.store;
    }

    set store(store) {
        super.store = store;
        ipc.send('my-shared-store-updated');
    }
}

window.Injected = {
    API,
    Metadata: { ...Metadata },
    env: { ...is },
    SpaceStore: new ElectronStore(StoreConfigs.SpaceStore),
    SharedStore: new SharedElectronStore(StoreConfigs.SharedStore),
    SpaceEvents: ipc,
    Logs: {},
};

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
