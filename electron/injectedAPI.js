const url = require('url');
const { shell, Menu } = require('electron');

module.exports = win => ({
    openURL(givenURL) {
        const protocol = url.parse(givenURL).protocol;
        if (protocol === 'http:' || protocol === 'https:') {
            shell.openExternal(givenURL);
            return true;
        }
        return false;
    },
    openContextMenu(template) {
        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: win });
    },
});
