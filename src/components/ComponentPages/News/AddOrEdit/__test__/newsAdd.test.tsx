import NewsAdd from "..";
import { cleanup, render, screen } from "@testing-library/react";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

afterEach(cleanup);
describe("Should render Addnews", () => {
  it("Render without crash", () => {
    const { container } = render(<NewsAdd />);

    const submitButton = screen.getByRole("button", {
      name: /Create News/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(1);
    expect(container.getElementsByTagName("input")).toHaveLength(3);
    expect(screen.getByText(/display text/i).textContent).toBe(
      "Display Text (Limit 256 chars)"
    );

    expect(submitButton.textContent).toBe("Create News");
    expect(cancelButton.textContent).toBe("Cancel");
  });
});
