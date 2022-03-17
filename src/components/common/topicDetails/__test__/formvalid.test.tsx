import FormData from "../../../addnewsformdata/formadd";
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
    const { container } = render(<FormData />);
    const formHeading = screen.getByRole("heading", {
      name: /form/i,
    });

    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(1);
    expect(container.getElementsByTagName("input")).toHaveLength(2);
    expect(screen.getByText(/display text/i).textContent).toBe("Display Text");
    expect(screen.getByText(/link/i).textContent).toBe("Link");
    expect(submitButton.textContent).toBe("Submit");
    expect(cancelButton.textContent).toBe("Cancel");
  });
});
