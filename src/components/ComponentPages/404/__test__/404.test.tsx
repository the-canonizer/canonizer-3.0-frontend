import My404 from "../";
import { render, cleanup, screen } from "@testing-library/react";

afterEach(cleanup);

describe("404 Page", () => {
  it("should render without crash", () => {
    const { container } = render(<My404 />);

    const goBack = screen.getByRole("link", {
      name: "Go Back",
    });
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    expect(container.getElementsByTagName("img")).toHaveLength(1);
    expect(goBack.getAttribute("href")).toBe("/");
  });
});
