import { render, screen, waitFor } from "src/utils/testUtils";

import SocialOauth from "../";

describe("Social oauth verification page", () => {
  it("render labels and text", () => {
    render(<SocialOauth />);
    waitFor(async () => {
      expect(screen.getByText("Google")).toBeInTheDocument();
      expect(screen.getByText("facebook")).toBeInTheDocument();
      expect(screen.getByText("Twitter")).toBeInTheDocument();
      expect(screen.getByText("Linkedin")).toBeInTheDocument();
      expect(screen.getByText("Github")).toBeInTheDocument();
      expect(screen.getAllByTestId("linkBtn").length).toEqual(5);
    });
  });
});
