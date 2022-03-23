import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ForgotPassword from "../index";
import messages from "../../../../messages";

const { labels, placeholders } = messages;

describe("Forgot Password", () => {
  it("render heading and labels", () => {
    render(<ForgotPassword isModal={false} />);
    let heading = screen.getByRole("heading", {
      name: /Forgot your password?/i,
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
    const emailId = screen.getByLabelText(labels.emailId);

    expect(emailId).toBeInTheDocument();
    expect(emailId).toHaveAttribute("type", "text");
    expect(emailId).toHaveAttribute("placeholder", placeholders.emailId);
  });

  it("pass valid email to test email input field", async () => {
    render(<ForgotPassword isModal={false} />);
    const inputEl = screen.getByLabelText(labels.emailId);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    await waitFor(() => {
      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(<ForgotPassword isModal={false} />);
    const inputEl = screen.getByLabelText(labels.emailId);
    userEvent.type(inputEl, "rahul.singhiffort.com");
    userEvent.tab();
    await waitFor(() => {
      expect(inputEl).toHaveValue("rahul.singhiffort.com");
      expect(
        screen.queryByText("The input is not valid E-mail!")
      ).toBeVisible();
    });
  });

  it("blank form should not be submit", async () => {
    render(<ForgotPassword isModal={false} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText("Please input your E-mail!")).toBeVisible();
    });
  });
});
