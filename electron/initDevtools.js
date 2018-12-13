module.exports = () => {
    try {
        // doesn't exist in prod bundle
        const { default: i, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
        return i(REACT_DEVELOPER_TOOLS);
    } catch (err) {}
};
