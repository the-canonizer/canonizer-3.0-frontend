/**
 * Security Headers E2E Tests
 *
 * These tests verify that security headers are actually present
 * in HTTP responses from the running application.
 *
 * To run these tests:
 * 1. Start the dev server: yarn dev
 * 2. Run: yarn test src/__tests__/e2e/securityHeaders.e2e.test.ts
 *
 * Note: These tests are skipped by default in CI as they require a running server.
 * Set E2E_TEST=true environment variable to enable.
 *
 * @see https://github.com/the-canonizer/canonizer-3.0-frontend/issues/1722
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:4000";
const RUN_E2E = process.env.E2E_TEST === "true";

// Skip E2E tests unless explicitly enabled
const describeE2E = RUN_E2E ? describe : describe.skip;

describeE2E("Security Headers E2E Tests", () => {
  const sensitivePages = [
    "/login",
    "/registration",
    "/settings",
    "/forgot-password",
    "/reset-password",
  ];

  describe("X-Frame-Options header on sensitive pages", () => {
    sensitivePages.forEach((page) => {
      it(`should have X-Frame-Options: DENY on ${page}`, async () => {
        const response = await fetch(`${BASE_URL}${page}`, {
          method: "HEAD",
        });

        const xFrameOptions = response.headers.get("X-Frame-Options");
        expect(xFrameOptions).toBe("DENY");
      });
    });
  });

  describe("Content-Security-Policy header on sensitive pages", () => {
    sensitivePages.forEach((page) => {
      it(`should have frame-ancestors 'none' in CSP on ${page}`, async () => {
        const response = await fetch(`${BASE_URL}${page}`, {
          method: "HEAD",
        });

        const csp = response.headers.get("Content-Security-Policy");
        expect(csp).toContain("frame-ancestors");
        expect(csp).toContain("'none'");
      });
    });
  });

  describe("X-Content-Type-Options header", () => {
    it("should have X-Content-Type-Options: nosniff on homepage", async () => {
      const response = await fetch(`${BASE_URL}/`, {
        method: "HEAD",
      });

      const xContentTypeOptions = response.headers.get(
        "X-Content-Type-Options"
      );
      expect(xContentTypeOptions).toBe("nosniff");
    });
  });

  describe("Referrer-Policy header", () => {
    it("should have Referrer-Policy header on homepage", async () => {
      const response = await fetch(`${BASE_URL}/`, {
        method: "HEAD",
      });

      const referrerPolicy = response.headers.get("Referrer-Policy");
      expect(referrerPolicy).toBe("strict-origin-when-cross-origin");
    });
  });

  describe("Clickjacking protection verification", () => {
    it("should prevent iframe embedding", async () => {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "HEAD",
      });

      const xFrameOptions = response.headers.get("X-Frame-Options");
      const csp = response.headers.get("Content-Security-Policy");

      // Either X-Frame-Options or CSP frame-ancestors should prevent framing
      const isProtected =
        xFrameOptions === "DENY" ||
        xFrameOptions === "SAMEORIGIN" ||
        (csp && csp.includes("frame-ancestors 'none'"));

      expect(isProtected).toBe(true);
    });
  });
});
