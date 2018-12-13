let isDev = require('electron-is-dev');
const { DEBUG, TIMELINKER_PROD_TEST } = process.env;
if (TIMELINKER_PROD_TEST) isDev = false;

module.exports = {
    development: isDev,
    production: !isDev,
    debug: DEBUG === 'timelinker',
};
