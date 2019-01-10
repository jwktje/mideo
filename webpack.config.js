const path = require('path');

module.exports = {
    entry: {
        client: './app/js/client/main.js',
        //admin: './app/js/admin/main.js',
    },
    output: {
        path: path.join(__dirname, "app/dist/js"),
        filename: "[name].entry.js"
    },
    watch: true,
    mode: "development",
    resolve: { modules: ['node_modules'] }
};
