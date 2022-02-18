import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ForgotPassword from "../index";
import messages from "../../../../messages";

const { placeholders, validations } = messages;

describe("OTP page", () => {
  it("render heading and text", () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);

    let heading = screen.getByText("Create password verification code");
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(
        "Note : ForgotPassword code has been sent to your registered email address and Phone Number."
      )
    ).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);
    const otp = screen.getByPlaceholderText(placeholders.otp);

    expect(otp).toBeInTheDocument();
    expect(otp).toHaveAttribute("type", "text");
    expect(otp).toHaveAttribute("placeholder", placeholders.otp);
  });

  it("check with 6 digit otp", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456");
    await waitFor(() => {
      expect(inputEl).toHaveValue("123456");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("check otp length not greater that 6 chars", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456789");
    await waitFor(() => {
      expect(inputEl).toHaveValue("123456789");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={1} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText("Please input your otp!")).toBeVisible();
    });
  });
});
