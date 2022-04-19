import NewsEdit from "..";
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
const fakeUsers = [
  {
    id: 1,
    display_text: "wahaj",
    link: "https://www.wahaj.com",
    available_for_child: 1,
  },
  {
    id: 2,
    display_text: "waqas",
    link: "https://www.waqas.com",
    available_for_child: 0,
  },
];

afterEach(cleanup);
describe("Should render Addnews", () => {
  it("Render without crash", () => {
    const { container } = render(<NewsEdit update={fakeUsers} />);

    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    //length of tags
    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(2);
    expect(container.getElementsByTagName("input")).toHaveLength(4);

    //length of simple text and check spell

    expect(
      screen.getAllByText((content, element) => {
        return (
          content !== "" &&
          element.textContent === "Display Text (Limit 256 chars)"
        );
      })[0]
    ).toBeInTheDocument();

    expect(
      screen.getAllByText((content, element) => {
        return (
          content !== "" &&
          element.textContent === "Display Text (Limit 256 chars)"
        );
      })[1]
    ).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(submitButton.textContent).toBe("Submit");
    expect(cancelButton.textContent).toBe("Cancel");
  });
});
