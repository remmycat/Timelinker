const path = require('path');

module.exports = {
    prod: win => win.loadFile(path.join(__dirname, '../build/index.html')),
    dev: win => win.loadURL('http://localhost:3000'),
};
