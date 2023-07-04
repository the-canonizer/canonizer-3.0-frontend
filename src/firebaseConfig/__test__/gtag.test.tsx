import { pageview } from "../gtag";

describe("pageview", () => {
  it("should call window.gtag with the correct arguments", () => {
    const mockGtag = jest.fn();
    const mockWindow = {
      gtag: mockGtag,
    };

    // Replace the global window object with our mock
    Object.defineProperty(global, "window", {
      value: mockWindow,
      writable: true,
    });

    const url = "/test-page";

    // Call the pageview function
    pageview(url);

    // Check if window.gtag is called with the correct arguments
    expect(mockGtag).toHaveBeenCalledWith(
      "config",
      process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      {
        page_path: url,
      }
    );
  });
});
