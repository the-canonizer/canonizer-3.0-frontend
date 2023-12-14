const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  images: {
    domains: [
      "api3.canonizer.com",
      "canonizer-public-file.s3.us-east-2.amazonaws.com",
      "canonizer.com",
      "beta.canonizer.com",
      "canonizer3.canonizer.com",
      "aws-315.s3.ap-south-1.amazonaws.com",
    ],
  },
  typescript: {
    //ignoreBuildErrors: true,
  },
});

// module.exports = {
//   images: {
//     domains: [
//       "api3.canonizer.com",
//       "canonizer-public-file.s3.us-east-2.amazonaws.com",
//       "canonizer.com",
//       "beta.canonizer.com",
//       "canonizer3.canonizer.com",
//     ],
//   },
//     typescript: {
//         //ignoreBuildErrors: true,
//     }
// };
