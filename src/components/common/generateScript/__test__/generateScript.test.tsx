import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";

import GenerateScript from "../";

describe("Generate Script Component", () => {
  it("check social login links and text exists in page", async () => {
    render(<GenerateScript topic_num={88} camp_num={1} />);
    const btn = screen.getByTestId("generate-btn");
    expect(btn).toBeInTheDocument();
    expect(screen.getByText("Get Embed Code")).toBeInTheDocument();
    fireEvent.click(btn);

    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Copy Script")).toBeInTheDocument();
  });
});
