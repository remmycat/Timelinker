const Store = require('electron-store');
const glob = require('glob');
const path = require('path');

function tryRequireVersion(num) {
    let r = undefined;
    try {
        r = require(`./migrations/v${String(num)}.js`);
    } catch (e) {}
    return r;
}

module.exports = function runMigrations(cwd, globMap) {
    const VersionStore = new Store({
        cwd,
        name: 'version',
        fileExtension: '',
    });

    const lastRunVersion = VersionStore.get('version', 0);

    let newVersion = lastRunVersion;
    while ((migration = tryRequireVersion(newVersion + 1))) {
        Object.keys(migration).forEach(key => {
            if (!globMap[key]) return;
            const migrate = migration[key];
            const matches = glob.sync(globMap[key], { cwd, realpath: true });
            matches.forEach(m => {
                const ext = path.extname(m);
                const s = new Store({
                    cwd: path.dirname(m),
                    name: path.basename(m, ext),
                    fileExtension: ext.replace(/^\./, ''),
                });
                s.store = migrate(s.store);
                delete s;
            });
        });
        newVersion += 1;
    }

    VersionStore.set('version', newVersion);
};
