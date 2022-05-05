const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const resolveApp = require("./paths");

module.exports = {
    mode:"production",
    entry:{
        react:['react','react-dom'],
    },
    output: {
        filename: "dll_[name].js",
        path: resolveApp("dll"),
        library:'dll_[name]'
      },
      optimization: {
        minimizer: [
          new TerserPlugin({
            extractComments: false,
          }),
        ],
    },
    plugins:[
        new webpack.DllPlugin({
            name:'dll_[name]',
            path: resolveApp("./dll/[name].manifest.json")
        })
    ]
}