const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports =withBundleAnalyzer( {
  images: {
    domains: ["api3.canonizer.com", "canonizer-public-file.s3.us-east-2.amazonaws.com"],
  },
});
