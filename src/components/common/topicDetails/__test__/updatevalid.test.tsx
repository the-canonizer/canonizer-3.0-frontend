import FormDataupdate from "../../../addnewsformdata/formupdate";
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
  //   available_for_child: 1
  // display_text: "waqar zaman"
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
    const { container } = render(<FormDataupdate update={fakeUsers} />);
    const formHeading = screen.getByRole("heading", {
      name: /update/i,
    });
    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    //length of tags
    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(2);
    expect(container.getElementsByTagName("input")).toHaveLength(4);
    expect(screen.getAllByText(/display text/i)).toHaveLength(2);
    expect(screen.getAllByText(/link/i)).toHaveLength(2);

    //length of simple text and check spell
    expect(screen.getAllByText(/display text/i)[0].textContent).toBe(
      "Display Text"
    );
    expect(screen.getAllByText(/link/i)[0].textContent).toBe("Link");

    expect(screen.getAllByText(/display text/i)[1].textContent).toBe(
      "Display Text"
    );
    expect(screen.getAllByText(/link/i)[1].textContent).toBe("Link");

    //console.log("wahaj data .,=>", screen.getAllByRole("textbox")[0]);
    // // check mock data update coructelly
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("wahaj");

    expect(screen.getAllByRole("textbox")[1]).toHaveValue(
      "https://www.wahaj.com"
    );
    expect(screen.getAllByRole("textbox")[2]).toHaveValue("waqas");

    expect(screen.getAllByRole("textbox")[3]).toHaveValue(
      "https://www.waqas.com"
    );

    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    expect(
      screen.getAllByRole("checkbox", {
        name: /available for children/i,
      })[1]
    ).not.toBeChecked();
    expect(submitButton.textContent).toBe("Submit");
    expect(cancelButton.textContent).toBe("Cancel");
    expect(formHeading).toBeInTheDocument();
  });
});
