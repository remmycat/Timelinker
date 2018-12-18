const ElectronStore = require('electron-store');

module.exports = class Store extends ElectronStore {
    constructor(...args) {
        super(...args);
    }

    update(key, update) {
        const newValue = typeof update === 'function' ? update(this.get(key)) : update;
        this.set(key, newValue);
        return newValue;
    }
};
