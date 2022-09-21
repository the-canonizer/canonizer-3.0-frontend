import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ResetPassword from "../index";
import messages from "../../../../messages";

const { placeholders, labels, validations } = messages;

describe("Reset Password page", () => {
  it("render heading labels and text", async () => {
    render(<ResetPassword />);
    let heading = screen.getByText("Create new password");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("render inputs field and submit button", async () => {
    render(<ResetPassword />);
    const newPassword = screen.getByPlaceholderText(placeholders.newPassword);
    const confirmPassword = screen.getByPlaceholderText(
      placeholders.confirmPassword
    );

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
    render(<ResetPassword />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    await fireEvent.change(inputEl, { target: { value: "1234567" } });
    await userEvent.tab();
    // await act(async () => {
    // });
    waitFor(() => {
      expect(inputEl).toHaveValue("1234567");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.passwordPattern)).toBeVisible();
    });
  });

  it("pass valid password", async () => {
    render(<ResetPassword />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    await fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    expect(inputEl).toHaveValue("Abc@1234");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("pass invalid confirm password", async () => {
    render(<ResetPassword />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    const inputEl2 = screen.getByPlaceholderText(placeholders.confirmPassword);
    act(async () => {
      await fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
      await userEvent.tab();
      await fireEvent.change(inputEl2, { target: { value: "Abc@12344" } });
      await userEvent.tab();
    });
    waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.confirmPasswordErr)).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(<ResetPassword />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    const inputEl2 = screen.getByPlaceholderText(placeholders.confirmPassword);
    await fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    await fireEvent.change(inputEl2, { target: { value: "Abc@1234" } });
    expect(inputEl).toHaveValue("Abc@1234");
    expect(inputEl2).toHaveValue("Abc@1234");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("blank form should not be submit", async () => {
    render(<ResetPassword />);
    const btnEl = screen.getByTestId("submitButton");
    await act(async () => {
      await fireEvent.click(btnEl);
    });

    await waitFor(() => {
      expect(screen.queryByText("Please input your password!")).toBeVisible();
      expect(screen.queryByText("Please confirm your password!")).toBeVisible();
    });
  });
});
