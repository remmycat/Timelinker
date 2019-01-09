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
        AppStore.get('last-opened', []).map(space => {
            const isOpen = ids.includes(space.id);
            const isOpen_changed =
                space.isOpen !== isOpen ? String(new Date()) : space.isOpen_changed;

            return { ...space, isOpen, isOpen_changed };
        })
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

function getSpaceName(space) {
    const SpaceStore = new ElectronStore({
        cwd: spacePath,
        name: space.id,
    });

    const columns = SpaceStore.get('columns', []);
    delete SpaceStore;
    if (columns.length === 0) return '';

    return columns
        .map(c => new URL(c.url).hostname)
        .reduce((acc, hostname, i) => {
            if (acc.length === 0 || acc[acc.length - 1][0] !== hostname)
                return [...acc, [hostname]];

            acc[acc.length - 1].push(hostname);
            return acc;
        }, [])
        .map(hostnames => `${hostnames[0]}${hostnames.length > 1 ? ` x${hostnames.length}` : ''}`)
        .join(' | ');
}

function getLastSpaces() {
    const allSpaces = AppStore.get('last-opened', []);

    const sortedSpaces = allSpaces.sort((a, b) => {
        const aDate = new Date(a.isOpen_changed);
        const bDate = new Date(b.isOpen_changed);

        return bDate - aDate;
    });

    let lastOpened = sortedSpaces.filter(s => s.isOpen);
    if (!lastOpened.length) {
        lastOpened = [sortedSpaces.length ? sortedSpaces[0] : addSpace()];
    }

    return lastOpened;
}

function getRecentlyClosedSpaces() {
    return AppStore.get('last-opened', [])
        .filter(s => !s.isOpen)
        .sort((a, b) => {
            const aDate = new Date(a.isOpen_changed);
            const bDate = new Date(b.isOpen_changed);

            return bDate - aDate;
        });
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
    getLastSpaces,
    getRecentlyClosedSpaces,
    getSpaceName,
    addSpace,
    setSpacesOpen,
    saveWindowState,
};
