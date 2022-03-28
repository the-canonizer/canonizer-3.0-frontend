import RecentActivities from "../";
import { cleanup, render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { windowMatchMedia } from "../../../../../utils/testUtils";
afterEach(cleanup);
windowMatchMedia();

describe("RecentActivities on HomePage for authenticated user", () => {
  it("Should render without crash", () => {
    act(() => {
      const { container } = render(<RecentActivities />);
    });
  });
});
