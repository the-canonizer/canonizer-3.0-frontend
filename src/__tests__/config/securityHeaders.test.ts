/**
 * Security Headers Configuration Tests
 *
 * These tests verify that the Next.js configuration includes
 * proper security headers to protect against common web vulnerabilities.
 *
 * @see https://github.com/the-canonizer/canonizer-3.0-frontend/issues/1722
 */

describe("Security Headers Configuration", () => {
  let nextConfig: any;

  beforeAll(() => {
    // Clear the require cache to ensure fresh config
    jest.resetModules();
    // Mock the bundle analyzer to return the config as-is
    jest.mock("@next/bundle-analyzer", () => {
      return () => (config: any) => config;
    });
    nextConfig = require("../../../next.config.js");
  });

  afterAll(() => {
    jest.unmock("@next/bundle-analyzer");
  });

  describe("headers() function", () => {
    it("should have a headers function defined", () => {
      expect(typeof nextConfig.headers).toBe("function");
    });

    it("should return an array of header configurations", async () => {
      const headers = await nextConfig.headers();
      expect(Array.isArray(headers)).toBe(true);
      expect(headers.length).toBeGreaterThan(0);
    });

    it("should apply headers to all routes (/:path*)", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");
      expect(allRoutesConfig).toBeDefined();
    });
  });

  describe("X-Frame-Options header", () => {
    it("should include X-Frame-Options header set to DENY", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      const xFrameOptions = allRoutesConfig?.headers?.find(
        (h: any) => h.key === "X-Frame-Options"
      );

      expect(xFrameOptions).toBeDefined();
      expect(xFrameOptions?.value).toBe("DENY");
    });
  });

  describe("Content-Security-Policy header", () => {
    it("should include CSP frame-ancestors directive set to none", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      const csp = allRoutesConfig?.headers?.find(
        (h: any) => h.key === "Content-Security-Policy"
      );

      expect(csp).toBeDefined();
      expect(csp?.value).toContain("frame-ancestors");
      expect(csp?.value).toContain("'none'");
    });
  });

  describe("X-Content-Type-Options header", () => {
    it("should include X-Content-Type-Options header set to nosniff", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      const xContentTypeOptions = allRoutesConfig?.headers?.find(
        (h: any) => h.key === "X-Content-Type-Options"
      );

      expect(xContentTypeOptions).toBeDefined();
      expect(xContentTypeOptions?.value).toBe("nosniff");
    });
  });

  describe("Referrer-Policy header", () => {
    it("should include Referrer-Policy header", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      const referrerPolicy = allRoutesConfig?.headers?.find(
        (h: any) => h.key === "Referrer-Policy"
      );

      expect(referrerPolicy).toBeDefined();
      expect(referrerPolicy?.value).toBe("strict-origin-when-cross-origin");
    });
  });

  describe("Security headers completeness", () => {
    it("should include all required security headers", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      const headerKeys = allRoutesConfig?.headers?.map((h: any) => h.key);

      expect(headerKeys).toContain("X-Frame-Options");
      expect(headerKeys).toContain("Content-Security-Policy");
      expect(headerKeys).toContain("X-Content-Type-Options");
      expect(headerKeys).toContain("Referrer-Policy");
    });

    it("should have exactly 4 security headers configured", async () => {
      const headers = await nextConfig.headers();
      const allRoutesConfig = headers.find((h: any) => h.source === "/:path*");

      expect(allRoutesConfig?.headers?.length).toBe(4);
    });
  });
});
