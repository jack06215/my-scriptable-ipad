import type { Configuration } from "webpack";
import * as fs from "fs";
import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";

const __dirname = path.resolve();

// Automatically find all top-level .ts files under src (excluding lib/)
const entryFiles = fs.readdirSync(path.join(__dirname, "src"))
  .filter(file => file.endsWith(".ts") && !fs.lstatSync(path.join(__dirname, "src", file)).isDirectory())
  .reduce<Record<string, string>>((entries, file) => {
    const name = path.basename(file, ".ts");
    entries[name] = path.join(__dirname, "src", file);
    return entries;
  }, {});

const config: Configuration = {
  entry: entryFiles,
  mode: "production",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "dist/*.js",
          to: path.join(__dirname, "[name][ext]"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};

export default config;
