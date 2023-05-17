import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ChangePassword from "../index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

describe("ChangePassword page", () => {
  it("render labels", () => {
    render(<ChangePassword />);
    expect(screen.getByText(labels.currentPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<ChangePassword />);
    const currentPassword = screen.getByPlaceholderText(labels.currentPassword);
    const newPassword = screen.getByPlaceholderText(labels.newPassword);
    const confirmPassword = screen.getByPlaceholderText(
      "Enter Confirm Password"
    );

    expect(currentPassword).toBeInTheDocument();
    expect(currentPassword).toHaveAttribute("type", "password");
    expect(currentPassword).toHaveAttribute(
      "placeholder",
      placeholders.currentPassword
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
    render(<ChangePassword />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    fireEvent.change(inputEl, { target: { value: "123" } });
    await waitFor(() => {
      expect(inputEl).toHaveValue("123");
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toHaveTextContent(validations.passwordPattern);
    });
  });

  it("pass valid password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    const inputEl2 = screen.getByPlaceholderText("Enter Confirm Password");
    fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    fireEvent.change(inputEl2, { target: { value: "Abc@12344" } });
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("Confirm Password does not match.")
      ).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    const inputEl2 = screen.getByPlaceholderText("Enter Confirm Password");
    fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    fireEvent.change(inputEl2, { target: { value: "Abc@1234" } });

    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@1234");

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<ChangePassword />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter current password!")
      ).toBeVisible();
      expect(screen.queryByText("Please enter new password!")).toBeVisible();
      expect(screen.queryByText("Please confirm your password!")).toBeVisible();
    });
  });
});
