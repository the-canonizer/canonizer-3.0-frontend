const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Security headers to protect against common web vulnerabilities.
 * @see https://owasp.org/www-project-secure-headers/
 */
const securityHeaders = [
  {
    // Prevents clickjacking attacks by disabling iframe embedding
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Modern replacement for X-Frame-Options (CSP frame-ancestors)
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  {
    // Prevents MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Controls referrer information sent with requests
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

module.exports = withBundleAnalyzer({
  images: {
    domains: [
      "api3.canonizer.com",
      "canonizer-public-file.s3.us-east-2.amazonaws.com",
      "canonizer.com",
      "beta.canonizer.com",
      "canonizer3.canonizer.com",
      "aws-315.s3.ap-south-1.amazonaws.com",
      "localhost:4001",
      "canonizer-bucket.s3.ap-south-1.amazonaws.com",
      "www.gravatar.com",
      "canonizer-bucket-4276.s3.ap-south-1.amazonaws.com",
      "ux-dev.canonizer.com",
      "development.canonizer.com"
    ],
  },
  typescript: {},
  /**
   * Custom HTTP headers for security hardening.
   * Applied to all routes to ensure comprehensive protection.
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
});
