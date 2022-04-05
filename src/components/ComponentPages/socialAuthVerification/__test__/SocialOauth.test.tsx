import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import SocialOauth from "..";
import messages from "../../../../messages";

const { placeholders, validations, labels } = messages;

describe("Social oauth verification page", () => {
  it("render labels and text", () => {
    render(<SocialOauth />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("Linkedin")).toBeInTheDocument();
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getAllByTestId("linkBtn").length).toEqual(5);
  });
});
