const { app, ipcMain, BrowserWindow } = require('electron');
const createWindow = require('./createWindow');
const initDevtools = require('./initDevtools');
const storage = require('./storage');
const path = require('path');
const injectedAPI = require('./injectedAPI');
const ReactApp = require('./ReactApp');
const initElectronDL = require('electron-dl');
const { enforceMacOSAppLocation, is } = require('electron-util');
const AppMenu = require('./appMenu.js');
const ContextMenu = require('electron-context-menu');

const preloadWebviewPath = `file://${path.join(__dirname, 'preloadWebview.js')}`;

// try {
//     // not in prod bundle
//     require('electron-reloader')(module, { watchRenderer: false });
// } catch (err) {}
initElectronDL();

let SpaceWindows = null;
let quitting = false;

ContextMenu();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
console.log(`Starting electron instance`);

function addWindow(space) {
    const win = (SpaceWindows[space.id] = createWindow(() => {
        delete SpaceWindows[space.id];
        if (!quitting) {
            // only execute if not force closed.
            // case where user closes all windows is handled via window-all-closed event.
            storage.setSpacesOpen(Object.keys(SpaceWindows || {}));
        }
    }, space.bounds));

    storage.setSpacesOpen(Object.keys(SpaceWindows || {}));

    if (space.isFullscreen) {
        win.setFullScreen(true);
    } else if (space.isMaximized) {
        win.maximize();
    }

    ['resize', 'move', 'close'].map(e => {
        win.on(e, () => storage.saveWindowState(win, space.id));
    });

    win.injected = {
        StoreConfigs: storage.getStoreConfigs(space.id),
        API: injectedAPI(win),
        Metadata: {
            SpaceId: space.id,
        },
    };
    (is.development ? ReactApp.dev : ReactApp.prod)(win);

    win.webContents.on('will-attach-webview', (e, preferences, params) => {
        Object.assign(preferences, {
            sandbox: false, // otherwise preload script doesn't work. urgh.
            nativeWindowOpen: true,
            nodeIntegration: false,
            webSecurity: true,
            safeDialogs: true,
            webviewTag: false,
            backgroundThrottling: true,
            scrollBounce: true,
            plugins: false,
            allowRunningInsecureContent: false,
            javascript: true,
            preloadURL: preloadWebviewPath,
        });
    });
}

function addNewWindow() {
    const space = storage.addSpace();
    addWindow(space);
}

function onAppReady() {
    SpaceWindows = {};

    enforceMacOSAppLocation();

    AppMenu({ addNewWindow });
    is.development && initDevtools();

    storage.getSpaces().map(s => addWindow(s));
}

ipcMain.on('my-shared-store-updated', event => {
    if (SpaceWindows) {
        Object.values(SpaceWindows)
            .filter(w => w.webContents !== event.sender)
            .forEach(w => {
                w.webContents.send('shared-store-updated');
            });
    }
});

app.on('ready', onAppReady);

app.on('before-quit', () => {
    quitting = true;
});
app.on('window-all-closed', () => {
    storage.setSpacesOpen([]);
    !is.macos && app.quit();
});

// darwin only
app.on('activate', () => SpaceWindows && Object.keys(SpaceWindows).length === 0 && onAppReady());
