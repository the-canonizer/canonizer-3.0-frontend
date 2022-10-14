import { act, render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Login from "../index";
import messages from "../../../../messages";
import { login } from "../../../../network/api/userApi";

const { labels, placeholders, validations } = messages;

const API = {
  login() {
    return login("test222@gmail.com", "Test@123");
  },
};

describe("Login page", () => {
  it("render heading and labels", () => {
    render(<Login isModal={false} />);
    waitFor(async () => {
      let heading = screen.getByRole("heading", {
        name: /Login To Canonizer/i,
      });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText(labels.emailPhone)).toBeInTheDocument();
      expect(screen.getByText(labels.password)).toBeInTheDocument();
      expect(screen.getByText("Forgot Password").closest("a")).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByText("Don't have an account?")).toBeVisible();
      expect(screen.getByText("Register Now")).toBeVisible();
      expect(screen.getByText("Remember Me")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Enter to the best leaderless consensus building and tracking system in the world."
        )
      ).toBeInTheDocument();
    });
  });

  it("render username input field", () => {
    render(<Login isModal={false} />);
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("type", "text");
      expect(inputEl).toHaveAttribute("placeholder", placeholders.emailPhone);
    });
  });

  it("render password input field", () => {
    render(<Login isModal={false} />);
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.password);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("type", "password");
      expect(inputEl).toHaveAttribute("placeholder", placeholders.password);
    });
  });

  it("pass valid email to test email input field", async () => {
    render(<Login isModal={false} />);
    waitFor(async () => {
      const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
      userEvent.type(inputEl, "rahul.singh@iffort.com");

      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(<Login isModal={false} />);
    waitFor(async () => {
      waitFor(async () => {
        const inputEl = screen.getByPlaceholderText(placeholders.emailPhone);
        userEvent.type(inputEl, "rahul.singhiffort.com");
        userEvent.tab();

        expect(screen.getByText("Input is not valid!")).toBeInTheDocument();
      });
    });
  });

  it("blank form should not be submit", async () => {
    render(<Login isModal={false} />);
    await act(async () => {
      const btnEl = screen.getByTestId("submitButton");

      await userEvent.click(btnEl);
    });
    waitFor(() => {
      expect(screen.getByText(validations.username)).toBeVisible();
      expect(screen.getByText(validations.password)).toBeVisible();
    });
  });
});
