import { render, screen, waitFor } from "../../../../utils/testUtils";

import Registration from "../index";

describe("Social Login Component", () => {
  // social login buttons
  it("check social login links and text exists in page", async () => {
    render(<Registration isNotLogin={false} />);
    await waitFor(() => {
      expect(
        screen.getByText("Login with social accounts.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
    });
  });

  it("check social login on signup page links and text exists in page", async () => {
    render(<Registration isNotLogin={true} />);
    await waitFor(() => {
      expect(
        screen.getByText("Signup with social accounts.")
      ).toBeInTheDocument();
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
    });
  });
});
