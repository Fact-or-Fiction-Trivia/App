const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  // mode: process.env.NODE_ENV,
  entry: ["./src/index"],
  output: {
    path: __dirname,
    filename: "./build/bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(jpe?g|png|gif|svg|wav|ico)$/i,
        loader: "file-loader",
        options: {
          name: "/build/icons/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".scss"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
    new Dotenv({
      path: ".env", // Path to .env file (this is the default)
    }),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: "./src/sw.js",
      swDest: "service-worker.js",
    }),
  ],
};
