module.exports = {
  presets: [
    ["next/babel"],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    ["import", { libraryName: "antd", style: true }],
    ["babel-plugin-dynamic-import-node"],
  ],
};
