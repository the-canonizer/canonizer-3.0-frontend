import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Registration from "../index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

describe("Social Login Component", () => {
  // social login buttons
  it("check social login links and text exists in page", async () => {
    render(<Registration isNotLogin={false} />);
    await waitFor(() => {
      expect(screen.getByText("Login with social accounts."));
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
      expect(screen.getByText("Signup with social accounts."));
      expect(screen.getByTestId("facebook")).toBeInTheDocument();
      expect(screen.getByTestId("google")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin")).toBeInTheDocument();
      expect(screen.getByTestId("twitter")).toBeInTheDocument();
      expect(screen.getByTestId("github")).toBeInTheDocument();
    });
  });
});
