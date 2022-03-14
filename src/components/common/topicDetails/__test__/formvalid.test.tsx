import FormData from "../../../testtrees/form";
import { cleanup, render, screen } from "@testing-library/react";

describe("Should render the app without crashing list", () => {
  // it("Renders the home page2", () => {
  //   render(<Showtreedetail result={fakedata} />);

  //   expect(screen.getByText("Topic Details")).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("heading", { name: "Topic Details" })
  //   ).toBeInTheDocument();
  // });

  it("Renders the home page2", async () => {
    render(<FormData />);

    const input = screen.getByText("form");
    expect(input).toBeInTheDocument();
  });
});
