import ErrorBoundary from "../";
import { render, cleanup } from "@testing-library/react";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

afterEach(cleanup);

describe("Error Boundary", () => {
  it("should render without crash", () => {
    render(
      <ErrorBoundary>
        <h1>error</h1>
      </ErrorBoundary>
    );

    // const goBack = screen.getByRole("link", {
    //   name: "Click here",
    // });
    // expect(container.getElementsByTagName("a")).toHaveLength(1);
    // expect(container.getElementsByTagName("img")).toHaveLength(1);
    // expect(goBack.getAttribute("href")).toBe("/");
  });
});
