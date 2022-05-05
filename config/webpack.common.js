const resolveApp = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlPlugn = require("add-asset-html-webpack-plugin");
// 导入其它的配置
const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");

// 定义对象保存 base 配置信息
const commonConfig = {
  entry: {
    index: "./src/index.js",
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".jsx", ".tsx"],
    alias: {
      "@": resolveApp("./src"),
    },
  },
  externals:{
    lodash:"_",
    
  },
  output: {
    filename: "js/[name].js",
    path: resolveApp("./dist"),
    chunkFilename: "js/chunk_[name].js",
  },
  optimization: {
    chunkIds: "deterministic",
    runtimeChunk:true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 20000,
      minChunks: 1,
      cacheGroups: {
        syVendors: {
          test: /[\\/]node_modules[\\/]/,
          filename: "js/[id]_vendor.js",
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              esModule: false,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: "asset",
        generator: {
          filename: "img/[name].[hash:4][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          },
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:3][ext]",
        },
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // options: {
          //   presets: [
          //     "@babel/preset-env",
          //     "@babel/preset-react",
          //     "@babel/preset-typescript",
          //   ]
          // },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "copyWebpackPlugin",
      template: "./public/index.html",
    }),
    new webpack.DllReferencePlugin({
      context:resolveApp('./'),
      manifest:resolveApp("./dll/react.manifest.json")
    }),
    new AddAssetHtmlPlugn({
      outputPath:"auto",
      filepath:resolveApp("./dll/dll_react.js")
    })
  ],
};

module.exports = (env) => {
  const isProduction = env.production;
  console.log(isProduction)
  process.env.NODE_ENV = isProduction ? "production" : "development";

  // 依据当前的打包模式来合并配置
  const config = isProduction ? prodConfig : devConfig;

  const mergeConfig = merge(commonConfig, config);

  return mergeConfig;
};
