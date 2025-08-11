const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
outputDir = path.join(__dirname, "../dist")
module.exports = {
   mode: "production",
   entry: {
      background: path.resolve(__dirname, "..", "src", "background.ts"),
      content : path.resolve(__dirname, "..", "src", "content.ts"),
   },
   output: {
      path: outputDir,
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),

        new ZipPlugin({
            filename: 'dist',
            path: outputDir,
            extension: 'zip',
            pathPrefix: '',
        }),
   ],
};