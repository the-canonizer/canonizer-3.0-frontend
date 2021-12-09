const CracoLessPlugin = require("craco-less");

module.exports = {
  reactStrictMode: true,
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            //modifyVars: { "@primary-color": "#1DA57A" },
            modifyVars: { "@primary-color": "#00FF00" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
