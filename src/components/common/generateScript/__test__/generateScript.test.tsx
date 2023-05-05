import { render, screen, waitFor } from "../../../../utils/testUtils";

import GenerateScript from "../";

describe("Generate Script Component", () => {
  it("check social login links and text exists in page", async () => {
    render(<GenerateScript isNotLogin={false} />);
    await waitFor(() => {
      expect(screen.getByText("Generate Script")).toBeInTheDocument();
      expect(screen.getByText("Copy Script")).toBeInTheDocument();
      expect(screen.getByTestId("generate-btn")).toBeInTheDocument();
    });
  });
});
