import { render, screen, waitFor } from "../../../../utils/testUtils";

import Notifications from "../";

describe("Notifications List Component", function () {
  it("should render without crash", function () {
    render(<Notifications />);
    waitFor(async () => {
      expect(screen.getByText("View More")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });
  });
});
