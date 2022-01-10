module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["next/babel", "@zeit/next-typescript/babel"],
    plugins: [
      ["import", { libraryName: "antd", style: true }],
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};

// {
//   "presets": ["next/babel", "@zeit/next-typescript/babel"]
// }

export {};
