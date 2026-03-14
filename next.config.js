const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  modularizeImports: {
    "antd": {
      transform: "antd/lib/{{member}}",
    },
    "@ant-design/icons": {
      transform: "@ant-design/icons/lib/icons/{{member}}",
    },
  },
  webpack: (config, { isServer }) => {
    // Resolve @babel/runtime to root copy
    config.resolve.alias["@babel/runtime"] = path.resolve(__dirname, "node_modules/@babel/runtime");

    if (isServer) {
      // On server, redirect ESM (antd/es/) to CJS (antd/lib/) to avoid
      // "Unexpected token 'export'" errors from ESM modules in Node.js
      config.resolve.alias["antd/es"] = "antd/lib";

      // Same for rc-* packages used internally by antd
      const rcPackages = [
        "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip",
        "rc-tree", "rc-table", "rc-input", "rc-input-number", "rc-select",
        "rc-cascader", "rc-checkbox", "rc-collapse", "rc-dialog", "rc-drawer",
        "rc-dropdown", "rc-field-form", "rc-image", "rc-menu", "rc-motion",
        "rc-progress", "rc-rate", "rc-resize-observer", "rc-segmented",
        "rc-slider", "rc-steps", "rc-switch", "rc-tabs", "rc-textarea",
        "rc-upload", "rc-virtual-list", "rc-util",
      ];
      rcPackages.forEach((pkg) => {
        config.resolve.alias[`${pkg}/es`] = `${pkg}/lib`;
      });

      // @ant-design/icons ESM to CJS
      config.resolve.alias["@ant-design/icons/es"] = "@ant-design/icons/lib";
      config.resolve.alias["@ant-design/icons-svg/es"] = "@ant-design/icons-svg/lib";
    }

    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api3.canonizer.com" },
      { protocol: "https", hostname: "canonizer-public-file.s3.us-east-2.amazonaws.com" },
      { protocol: "https", hostname: "canonizer.com" },
      { protocol: "https", hostname: "beta.canonizer.com" },
      { protocol: "https", hostname: "canonizer3.canonizer.com" },
      { protocol: "https", hostname: "aws-315.s3.ap-south-1.amazonaws.com" },
      { protocol: "http", hostname: "localhost", port: "4001" },
      { protocol: "https", hostname: "canonizer-bucket.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "www.gravatar.com" },
      { protocol: "https", hostname: "canonizer-bucket-4276.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "ux-dev.canonizer.com" },
      { protocol: "https", hostname: "development.canonizer.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
