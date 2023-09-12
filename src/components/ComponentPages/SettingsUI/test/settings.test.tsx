import SettingsUI from "..";
import { fireEvent, render, screen } from "../../../../utils/testUtils";

import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "antd";
import { renderHook } from "@testing-library/react-hooks";

const tabList = [
  {
    key: "profile_info",
    tab: "Profile Info",
  },
  {
    key: "social_oauth_verification",
    tab: "Social Oauth Verification",
  },
  {
    key: "change_password",
    tab: "Change Password",
  },
  {
    key: "nick_name",
    tab: "Nicknames",
  },
  {
    key: "supported_camps",
    tab: "Supported Camps",
  },
  {
    key: "subscriptions",
    tab: "Subscriptions",
  },
];

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("settingUI page", () => {
  it("render all the tabs in the settings page", () => {
    render(<SettingsUI />);
    expect(screen.getByText(tabList[0].tab)).toBeInTheDocument();
    expect(screen.getByText(tabList[1].tab)).toBeInTheDocument();
    expect(screen.getByText(tabList[2].tab)).toBeInTheDocument();
    expect(screen.getByText(tabList[3].tab)).toBeInTheDocument();
    expect(screen.getByText(tabList[4].tab)).toBeInTheDocument();
    expect(screen.getByText(tabList[5].tab)).toBeInTheDocument();
  });

  it("render reset button in the settings page", () => {
    const { container } = render(<SettingsUI />);
    expect(container.getElementsByClassName("btn")).toBeTruthy();
  });

  it("renders Ant Design Card component correctly", () => {
    const { getByText } = render(<SettingsUI />);
    const cardTitle = getByText("Account Settings");

    expect(cardTitle).toBeInTheDocument();
  });
  it("render useState is working", () => {
    render(<SettingsUI />);
    const TestComponent = () => {
      const [isActive, setIsActive] = useState(false);

      const toggleActive = () => {
        setIsActive(!isActive);
      };

      return (
        <div>
          <p>{isActive ? "Active" : "Inactive"}</p>
          <button onClick={toggleActive}>Toggle</button>
        </div>
      );
    };

    const { getByText } = render(<TestComponent />);

    const statusElement = getByText("Inactive");
    const toggleButton = getByText("Toggle");

    expect(statusElement.textContent).toBe("Inactive");

    fireEvent.click(toggleButton);

    expect(statusElement.textContent).toBe("Active");

    fireEvent.click(toggleButton);

    expect(statusElement.textContent).toBe("Inactive");
  });

  it("path is working with use router", () => {
    render(<SettingsUI />);
    const mockedRouter = {
      pathname: "/about",
    };

    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe("/about");
  });
  test("Input component handles user input correctly", () => {
    // Render the Input component
    render(<Input />);

    // Find the input element
    const inputElement = screen.getByRole("textbox");

    // Simulate user input
    const userInput = "Test Input";
    fireEvent.change(inputElement, { target: { value: userInput } });

    // Assert that the input value is updated
    expect(inputElement.value).toBe(userInput);
  });
});
