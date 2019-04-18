const { app, ipcMain, BrowserWindow } = require('electron');
const { enforceMacOSAppLocation, is } = require('electron-util');
// use different user data path during development, to prevent data loss.
// electron-util is safe to call, as it doesn't reference the userData path on require
if (is.development) app.setPath('userData', `${app.getPath('userData')} dev`);

const createWindow = require('./createWindow');
const initDevtools = require('./initDevtools');
const storage = require('./storage');
const path = require('path');
const injectedAPI = require('./injectedAPI');
const ReactApp = require('./ReactApp');
const initElectronDL = require('electron-dl');
const AppMenu = require('./appMenu.js');

const preloadWebviewPath = `file://${path.join(__dirname, 'preloadWebview.js')}`;

// try {
//     // not in prod bundle
//     require('electron-reloader')(module, { watchRenderer: false });
// } catch (err) {}
initElectronDL();

let SpaceWindows = null;
let forceQuitting = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
console.log(`Starting electron instance`);

function addWindow(space) {
    const win = (SpaceWindows[space.id] = createWindow(() => {
        delete SpaceWindows[space.id];
        if (!forceQuitting) {
            // only execute if not force closed.
            // case where user closes all windows is handled via window-all-closed event.
            storage.setSpacesOpen(Object.keys(SpaceWindows || {}));
            updateMenu();
        }
    }, space.bounds));

    storage.setSpacesOpen(Object.keys(SpaceWindows || {}));
    updateMenu();

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
            enableRemoteModule: false,
            contextIsolation: true,
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

function updateMenu() {
    AppMenu({
        addNewWindow,
        openSpace: addWindow,
        recentlyClosed: storage.getRecentlyClosedSpaces(),
    });
}

function onAppReady() {
    SpaceWindows = {};

    enforceMacOSAppLocation();

    updateMenu();
    is.development && initDevtools();
    storage.getLastSpaces().map(s => addWindow(s));
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
    forceQuitting = true;
});
app.on('window-all-closed', () => {
    if (!is.macos) {
        app.quit();
    }
});

// macos only
app.on('activate', () => SpaceWindows && Object.keys(SpaceWindows).length === 0 && onAppReady());
