const electron = require('electron');
const ElectronStore = require('./Store');
const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const migrateStores = require('./migrateStores');

const userData = electron.app.getPath('userData');
if (!fs.existsSync(userData)) fs.mkdirSync(userData);
const storagePath = path.join(userData, 'Store');
if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
const spacePath = path.join(storagePath, 'spaces');
if (!fs.existsSync(spacePath)) fs.mkdirSync(spacePath);

migrateStores(storagePath, {
    application: 'application-state.json',
    shared: 'shared.json',
    spaces: 'spaces/*.json',
});

const AppStore = new ElectronStore({
    cwd: storagePath,
    name: 'application-state',
});

function newSpace() {
    return {
        id: uuid(),
        bounds: { width: 800, height: 600 },
        isMaximized: false,
        isMinimized: false,
        isFullScreen: false,
    };
}

function saveWindowState(win, id) {
    return AppStore.update('last-opened', (old = []) =>
        old.map(space => {
            if (space.id !== id) return space;
            const isMax = win.isMaximized();
            const isFull = win.isFullScreen();
            const isMin = win.isMinimized();
            return {
                ...space,
                bounds: isMax | isFull | isMin ? space.bounds : win.getBounds(),
                isMaximized: isMax,
                isMinimized: isMin,
                isFullscreen: isFull,
            };
        })
    );
}

function addSpace() {
    return AppStore.update('last-opened', (old = []) => [...old, newSpace()]);
}

function getSpaces() {
    return (AppStore.get('last-opened') || addSpace()).reverse();
}

function remoteAPI(id) {
    return {
        SharedStore: {
            cwd: storagePath,
            name: 'shared',
        },
        SpaceStore: {
            cwd: spacePath,
            name: id,
        },
    };
}

module.exports = {
    remoteAPI,
    getSpaces,
    saveWindowState,
};
