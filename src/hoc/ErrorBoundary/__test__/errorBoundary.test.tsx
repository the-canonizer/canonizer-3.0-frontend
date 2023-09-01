import ErrorBoundary from "../";
import { render, cleanup, screen } from "@testing-library/react";

afterEach(cleanup);

describe("Error Boundary", () => {
  it("should render without crash", () => {
    const { container } = render(
      <ErrorBoundary>
        <h1>error</h1>
      </ErrorBoundary>
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
    // const goBack = screen.getByRole("link", {
    //   name: "Click here",
    // });
    // expect(container.getElementsByTagName("a")).toHaveLength(1);
    // expect(container.getElementsByTagName("img")).toHaveLength(1);
    // expect(goBack.getAttribute("href")).toBe("/");
  });
});
