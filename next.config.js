const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
   images: {
    domains: [
      "api3.canonizer.com",
      "canonizer-public-file.s3.us-east-2.amazonaws.com",
      "canonizer.com",
      "beta.canonizer.com",
      "canonizer3.canonizer.com",
    ],
  },
    typescript: {
        //ignoreBuildErrors: true,
    }
})



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
