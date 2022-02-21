import HomeSideBar from "../";

import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

afterEach(cleanup);

describe("HomePage Sidebar Component", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <HomeSideBar />
      </Provider>
    );
  });
});
