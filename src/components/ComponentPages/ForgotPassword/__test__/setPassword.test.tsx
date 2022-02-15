import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ForgotPassword from "../index";
import messages from "../../../../messages";

const { placeholders, validations, labels } = messages;

describe("Reset Password page", () => {
  it("render heading labels and text", () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);

    let heading = screen.getByText("Reset Your Password");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const newPassword = screen.getByLabelText(labels.newPassword);
    const confirmPassword = screen.getByLabelText(labels.confirmPassword);

    expect(newPassword).toBeInTheDocument();
    expect(newPassword).toHaveAttribute("type", "password");
    expect(newPassword).toHaveAttribute(
      "placeholder",
      placeholders.newPassword
    );

    expect(confirmPassword).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute(
      "placeholder",
      placeholders.confirmPassword
    );
  });

  it("check password minimum length > 8", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    userEvent.type(inputEl, "1234567");
    await waitFor(() => {
      expect(inputEl).toHaveValue("1234567");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("Password Should be like Abc@1234.")
      ).toBeVisible();
    });
  });

  it("pass valid password", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    userEvent.type(inputEl, "Abc@1234");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    const inputEl2 = screen.getByLabelText(labels.confirmPassword);
    userEvent.type(inputEl, "Abc@1234");
    userEvent.type(inputEl2, "Abc@12344");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("The two passwords that you entered do not match!")
      ).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    const inputEl2 = screen.getByLabelText(labels.confirmPassword);
    userEvent.type(inputEl, "Abc@1234");
    userEvent.type(inputEl2, "Abc@1234");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<ForgotPassword isModal={false} isTestScreen={2} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText("Please input your password!")).toBeVisible();
      expect(screen.queryByText("Please confirm your password!")).toBeVisible();
    });
  });
});
