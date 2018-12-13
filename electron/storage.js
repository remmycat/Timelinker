const electron = require('electron');
const ElectronStore = require('./Store');
const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');

const storagePath = path.join(electron.app.getPath('userData'), 'Store');
const spacePath = path.join(storagePath, 'spaces');
if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath);
if (!fs.existsSync(spacePath)) fs.mkdirSync(spacePath);

const AppStore = new ElectronStore({
    cwd: storagePath,
    name: 'application-state',
});

function newSpace() {
    return {
        id: uuid(),
        bounds: { width: 800, height: 600 },
    };
}

function addSpace() {
    return AppStore.update('last-opened', (old = []) => [...old, newSpace()]);
}

function getSpaces() {
    return (AppStore.get('last-opened') || addSpace()).reverse();
}

function remoteAPI(id) {
    return {
        SpaceId: id,
        AppStore,
        SpaceStore: new ElectronStore({
            cwd: spacePath,
            name: id,
        }),
    };
}

module.exports = {
    remoteAPI,
    getSpaces,
};
