import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Registration from "../index";
import messages from "../../../../messages";
import React from "react";
import { validations } from "src/messages/validation";

const { placeholders, labels } = messages;

describe("Registration OTP page", () => {
  it("render heading and text", () => {
    render(<Registration isModal={false} isTest={true} />);
    let heading = screen.getByText("Log In One Time Verification Code");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.regOtp)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<Registration isModal={false} isTest={true} />);
    const otp = screen.getByPlaceholderText(placeholders.otp);

    expect(otp).toBeInTheDocument();
    expect(otp).toHaveAttribute("type", "text");
    expect(otp).toHaveAttribute("placeholder", placeholders.otp);
  });

  it("check with 6 digit otp", async () => {
    render(<Registration isModal={false} isTest={true} />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456");
    await waitFor(() => {
      expect(inputEl).toHaveValue("123456");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("check otp length not greater that 6 chars", async () => {
    render(<Registration isModal={false} isTest={true} />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    const btn = screen.getByTestId("submitButton");
    fireEvent.change(inputEl, { target: { value: "123456789" } });
    fireEvent.focusOut(inputEl);
    await waitFor(() => {
      userEvent.click(btn);
      expect(inputEl).toHaveValue("123456789");
      expect(screen.queryByRole("alert"));
    });
  });

  it("blank form should not be submit", async () => {
    render(<Registration isModal={false} isTest={true} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText(validations.otp)).toBeVisible();
    });
  });
});
