import { Fragment } from "react";
import { render, screen } from "src/utils/testUtils";

import SocialLoginCallback from "../";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe("Social Login Callback", () => {
  it("render heading and labels", () => {
    render(
      <Fragment>
        <SocialLoginCallback />
      </Fragment>
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });
});
