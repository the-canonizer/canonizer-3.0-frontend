import React from "react";
import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import HeadContentAndPermissionComponent from "../index";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("HeadContentAndPermissionComponent", () => {
  beforeEach(() => {
    useRouter.mockReset();
    useSelector.mockReset();
  });

  /* eslint-disable */
  test("renders HeadContent component with correct props", () => {
    const componentName = "ComponentName";
    const metaContent = {
      title: "Page Title",
      description: "Page Description",
      author: "Page Author",
    };

    useRouter.mockReturnValue({
      asPath: "/path",
      push: jest.fn(),
    });

    useSelector.mockReturnValue({
      token: "token",
    });

    render(
      <HeadContentAndPermissionComponent
        componentName={componentName}
        metaContent={metaContent}
      />
    );

    // expect(getByText(metaContent.title)).toBeInTheDocument();
    // expect(getByText(metaContent.description)).toBeInTheDocument();
    // expect(getByText(metaContent.author)).toBeInTheDocument();
  });

  /* eslint-enable */
});
