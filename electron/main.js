const { app } = require('electron');
const createWindow = require('./createWindow');
const initDevtools = require('./initDevtools');
const env = require('./env');
const storage = require('./storage');
const injectedAPI = require('./injectedAPI');
const ReactApp = require('./ReactApp');
const initElectronDL = require('electron-dl');
const { enforceMacOSAppLocation } = require('electron-util');

try {
    // not in prod bundle
    require('electron-reloader')(module, { watchRenderer: false });
} catch (err) {}
initElectronDL();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let SpaceWindows = {};
console.log(`Starting electron instance`);

function onAppReady() {
    enforceMacOSAppLocation();
    env.development && initDevtools();

    const space = storage.getSpaces()[0];
    const win = (SpaceWindows[space.id] = createWindow(() => {
        delete SpaceWindows[space.id];
    }, space.bounds));

    win.injected = {
        ...storage.remoteAPI(space.id),
        API: injectedAPI,
    };
    (env.production ? ReactApp.prod : ReactApp.dev)(win);
    env.debug &&
        win.webContents.on('did-fail-load', e => {
            console.log('window failed to load!');
            console.error(e);
        });

    win.webContents.on('will-attach-webview', (e, preferences, params) => {
        Object.assign(preferences, {
            sandbox: true,
            nodeIntegration: false,
            nativeWindowOpen: true,
            webSecurity: true,
            safeDialogs: true,
            webviewTag: false,
            backgroundThrottling: true,
            scrollBounce: true,
            plugins: false,
            allowRunningInsecureContent: false,
            javascript: true,
        });
    });
}

app.on('ready', onAppReady);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

// darwin only
app.on('activate', () => Object.keys(SpaceWindows).length === 0 && onAppReady());
