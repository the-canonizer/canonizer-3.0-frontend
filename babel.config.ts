module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["next/babel","@babel/preset-env", "@zeit/next-typescript/babel"],
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


export {};
