import FormData from "../../../addnewsformdata/form";
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
  // it("Renders the home page2", () => {
  //   render(<Showtreedetail result={fakedata} />);

  //   expect(screen.getByText("Topic Details")).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("heading", { name: "Topic Details" })
  //   ).toBeInTheDocument();
  // });

  it("Render without crash", async () => {
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
    expect(screen.getByText(/display text/i));
    expect(screen.getByText(/link/i));
    expect(submitButton.textContent).toBe("Submit");
    expect(cancelButton.textContent).toBe("Cancel");
  });
});
