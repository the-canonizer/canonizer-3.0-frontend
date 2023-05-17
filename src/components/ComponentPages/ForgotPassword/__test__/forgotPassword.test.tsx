import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ForgotPassword from "../index";
import messages from "../../../../messages";
import { validations } from "src/messages/validation";

const { labels, placeholders } = messages;

describe("Forgot Password", () => {
  it("render heading and labels", () => {
    render(<ForgotPassword isModal={false} />);
    let heading = screen.getByRole("heading", {
      name: labels.forgotModalLabel,
    });
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(
        "Don't worry, it happens. Let us know the email address you signed up"
      )
    ).toBeVisible();
    expect(
      screen.getByText("with and we'll send you an email with instructions.")
    ).toBeVisible();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<ForgotPassword isModal={false} />);
    const emailId = screen.getByTestId("forgot-email-id-input");

    expect(emailId).toBeInTheDocument();
    expect(emailId).toHaveAttribute("type", "text");
    expect(emailId).toHaveAttribute("placeholder", placeholders.emailId);
  });

  it("pass valid email to test email input field", async () => {
    render(<ForgotPassword isModal={false} />);
    const inputEl = screen.getByTestId("forgot-email-id-input");
    fireEvent.change(inputEl, {
      target: { value: "rahul.singh@iffort.com" },
    });
    expect(inputEl).toHaveValue("rahul.singh@iffort.com");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should show error when invalid email enter in field", async () => {
    render(<ForgotPassword isModal={false} />);
    const inputEl = screen.getByTestId("forgot-email-id-input");
    fireEvent.change(inputEl, { target: { value: "rahul.singhiffort.com" } });
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    expect(inputEl).toHaveValue("rahul.singhiffort.com");
  });

  it("blank form should not be submit", async () => {
    render(<ForgotPassword isModal={false} />);
    waitFor(async () => {
      const btnEl = screen.getByTestId("submitButton");

      userEvent.click(btnEl);
    });
    await waitFor(() => {
      expect(screen.queryByText("Please input your E-mail!")).toBeVisible();
    });
  });
});
