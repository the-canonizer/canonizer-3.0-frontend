import CampStatementCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

afterEach(cleanup);

describe("Camp statement on camp details page", () => {
  it("Should render without crash", () => {
    render(
      <Provider store={store}>
        <CampStatementCard />
      </Provider>
    );
  });
});
