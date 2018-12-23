const url = require('url');
const { shell } = require('electron');

module.exports = win => ({
    openURL(givenURL) {
        const protocol = url.parse(givenURL).protocol;
        if (protocol === 'http:' || protocol === 'https:') {
            shell.openExternal(givenURL);
            return true;
        }
        return false;
    },
});
