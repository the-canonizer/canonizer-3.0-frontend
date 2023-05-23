import My404 from "../";
import { render, cleanup, screen } from "@testing-library/react";

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

describe("404 Page", () => {
  it("should render without crash", () => {
    const { container } = render(<My404 />);

    const goBack = screen.getByTestId("go_back");
    expect(goBack).toBeInTheDocument();
    expect(container.getElementsByTagName("a")).toHaveLength(2);
    expect(container.getElementsByTagName("img")).toHaveLength(1);
    expect(goBack.getAttribute("href")).toBe("");
  });
});
