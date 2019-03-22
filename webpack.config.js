const webpack = require("webpack");
const path = require("path");

var jF = path.resolve(__dirname, "js");
var bF = path.resolve(__dirname, "build");

var config = {
    entry: {
        "login": jF + "/login.js",
        "list": jF +"/list.js",
        "cart": jF + "/cart.js",
        "search": jF + "/search.js",
        "book": jF + "/book.js",
    },
    output: {
        filename: "[name]bundle.js",
        path: bF
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
            jQuery: 'jquery'
        })
    ]
};

module.exports = config;