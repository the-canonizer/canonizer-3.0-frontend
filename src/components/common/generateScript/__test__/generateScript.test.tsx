import { fireEvent, render, screen } from "../../../../utils/testUtils";

import GenerateScript from "../";

describe("Generate Script Component", () => {
  it("check social login links and text exists in page", async () => {
    render(<GenerateScript topic_num={undefined} camp_num={undefined} />);
    expect(screen.getByText("Get Embed Code")).toBeInTheDocument();
    expect(screen.getByTestId("generate-btn")).toBeInTheDocument();

    const btn = screen.getByTestId("generate-btn");

    fireEvent.click(btn);

    expect(screen.getByText("Copy Script")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });
});
