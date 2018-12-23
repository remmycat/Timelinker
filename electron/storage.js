const electron = require('electron');
const ElectronStore = require('electron-store');
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
    main: 'application-state.json',
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
        isFullscreen: false,
        isOpen: false,
    };
}

function setSpacesOpen(ids) {
    return AppStore.set(
        'last-opened',
        AppStore.get('last-opened', []).map(space => ({
            ...space,
            isOpen: ids.includes(space.id),
        }))
    );
}

function saveWindowState(win, id) {
    return AppStore.set(
        'last-opened',
        AppStore.get('last-opened', []).map(space => {
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
    const space = newSpace();
    AppStore.set('last-opened', [...AppStore.get('last-opened', []), space]);
    return space;
}

function getSpaces() {
    const lastOpened = AppStore.get('last-opened', [])
        .filter(space => space.isOpen)
        .reverse();
    return lastOpened.length ? lastOpened : [addSpace()];
}

function getStoreConfigs(id) {
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
    getStoreConfigs,
    getSpaces,
    addSpace,
    setSpacesOpen,
    saveWindowState,
};
