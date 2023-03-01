import CampRecentActivities from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

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
  it("Render without crash", async () => {
    await render(<CampRecentActivities />);
    const userList = await waitFor(() =>
      screen.getByText(/No Recent Activity Found/i)
    );
    expect(screen.getByText(/recent activities/i)).toBeInTheDocument();
    expect(userList).toBeInTheDocument();
  });
});
