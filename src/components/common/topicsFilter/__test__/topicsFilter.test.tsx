import CreateTopic from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store";

afterEach(cleanup);

describe("Sidebar Filters Component", () => {
  it("Should render without crash", () => {
    const { container, getByText } = render(
      <Provider store={store}>
        <CreateTopic />
      </Provider>
    );

    expect(container.getElementsByTagName("button")).toHaveLength(1);
    expect(getByText("Create New Topic")).toBeInTheDocument();
    expect(getByText("Canonizer Algorithm:")).toBeInTheDocument();
    expect(getByText("Algorithm Information")).toBeInTheDocument();
  });
});
