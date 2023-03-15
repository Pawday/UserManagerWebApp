const path  = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PACK_DEBUG_DIRECTORY = path.resolve(__dirname, "__pack__");
const PACK_RELEASE_DIRECTORY = path.resolve(__dirname, "__pack_release__");
const TS_BUILD_DIRECTORY = path.resolve(__dirname, "_ts_build");
const SOURCE_DIRECTORY = path.resolve(__dirname);



const ts_sourcemap =
{
    loader: "source-map-loader",
}


const configDebug =
{
    mode: "development",
    entry: path.resolve(TS_BUILD_DIRECTORY,"Main.js"),
    devtool: "source-map",
    output:
    {
        path: PACK_DEBUG_DIRECTORY,
        filename: "bundle_debug.js"
    },
    plugins: [new HtmlWebpackPlugin()],
    module:
    {
        rules:
        [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ts_sourcemap
            }
        ]
    },
    devServer:
    {
        static: {
            directory: path.join(__dirname, '__pack__'),
        },
        compress: false,
        port: 8000,
    }
}

const configRelease =
    {
        mode: "production",
        entry: path.resolve(TS_BUILD_DIRECTORY,"Main.js"),
        output:
            {
                path: PACK_RELEASE_DIRECTORY,
                filename: "bundle_release.js"
            },
        plugins: [new HtmlWebpackPlugin()]
    }

module.exports = [configDebug, configRelease];