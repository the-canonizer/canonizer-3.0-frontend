import NewsEdit from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { setCampNewsToEdit } from "../../../../../store/slices/news";
import { store } from "../../../../../store";

const renderComp = () =>
  render(
    <Provider store={store}>
      <NewsEdit />
    </Provider>
  );

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
    store.dispatch(
      setCampNewsToEdit({
        available_for_child: 0,
        display_text: "test add",
        id: 329,
        link: "www.abc.com",
        submitter_nick_id: 1013,
      })
    );
    const { container } = renderComp();

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /Cancel/i,
    });

    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(1);
    expect(container.getElementsByTagName("input")).toHaveLength(2);
    expect(screen.getByText(/display text/i).textContent).toBe(
      "Display Text (Limit 256 chars)"
    );
    // expect(screen.getByText(/link/i).textContent).toBe(
    //   "Link (Limit 2000 chars)"
    // );

    // expect(screen.getByText("test add")).toBeInTheDocument();
    // console.log("link", screen.getByText("www.abc.com"));
    // expect(screen.getByText("www.abc.com")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("test add");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("www.abc.com");
    expect(
      screen.getByRole("checkbox", {
        name: /available for children/i,
      })
    ).not.toBeChecked();
    expect(submitButton.textContent).toBe("Submit");
    expect(cancelButton.textContent).toBe("Cancel");
  });
});
