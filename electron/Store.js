const ElectronStore = require('electron-store');

module.exports = class Store extends ElectronStore {
    constructor(...args) {
        super(...args);
    }

    update(key, updater, defaultValue) {
        const newValue = updater(this.get(key, defaultValue));
        this.set(key, newValue);
        return newValue;
    }
};
