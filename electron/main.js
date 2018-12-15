const { app } = require('electron');
const createWindow = require('./createWindow');
const initDevtools = require('./initDevtools');
const env = require('./env');
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
// initElectronDL();

ContextMenu();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let SpaceWindows = {};
console.log(`Starting electron instance`);

function onAppReady() {
    AppMenu();
    enforceMacOSAppLocation();
    env.development && initDevtools();

    const space = storage.getSpaces()[0];
    const win = (SpaceWindows[space.id] = createWindow(() => {
        delete SpaceWindows[space.id];
    }, space.bounds));

    if (space.isFullscreen) {
        win.setFullScreen(true);
    } else if (space.isMaximized) {
        win.maximize();
    }

    ['resize', 'move', 'close'].map(e => {
        win.on(e, () => storage.saveWindowState(win, space.id));
    });

    win.injected = {
        ...storage.remoteAPI(space.id),
        API: injectedAPI,
        Metadata: {
            SpaceId: space.id,
        },
    };
    (env.production ? ReactApp.prod : ReactApp.dev)(win);
    env.debug &&
        win.webContents.on('did-fail-load', e => {
            console.log('window failed to load!');
            console.error(e);
        });

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

app.on('ready', onAppReady);
app.on('window-all-closed', () => is.macos && app.quit());

// darwin only
app.on('activate', () => Object.keys(SpaceWindows).length === 0 && onAppReady());
