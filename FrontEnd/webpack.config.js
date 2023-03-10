const path  = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PACK_DIRECTORY = path.resolve(__dirname, "__pack__");
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
        path: PACK_DIRECTORY,
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

module.exports = [configDebug];