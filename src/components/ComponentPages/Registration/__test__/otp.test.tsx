import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Registration from "../index";
import messages from "../../../../messages";
import React from "react";

const { placeholders, labels } = messages;

describe("OTP page", () => {
  it("render heading and text", () => {
    render(<Registration isTest={true} />);
    let heading = screen.getByText("Log In One Time Verification Code");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.regOtp)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<Registration />);
    const otp = screen.getByPlaceholderText(placeholders.otp);

    expect(otp).toBeInTheDocument();
    expect(otp).toHaveAttribute("type", "text");
    expect(otp).toHaveAttribute("placeholder", placeholders.otp);
  });

  it("check with 6 digit otp", async () => {
    render(<Registration />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456");
    await waitFor(() => {
      expect(inputEl).toHaveValue("123456");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("check otp length not greater that 6 chars", async () => {
    render(<Registration />);
    const inputEl = screen.getByPlaceholderText(placeholders.otp);
    userEvent.type(inputEl, "123456789");
    userEvent.tab();
    await waitFor(() => {
      expect(inputEl).toHaveValue("123456789");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<Registration />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText("Please input your OTP!")).toBeVisible();
    });
  });
});
