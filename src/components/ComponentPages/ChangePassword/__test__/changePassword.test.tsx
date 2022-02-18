import { render, screen, waitFor } from "../../../../utils/testUtils";
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
    const currentPassword = screen.getByLabelText(labels.currentPassword);
    const newPassword = screen.getByLabelText(labels.newPassword);
    const confirmPassword = screen.getByLabelText(labels.confirmPassword);

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
    render(<ChangePassword isModal={false} />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    userEvent.type(inputEl, "123");
    await waitFor(() => {
      expect(inputEl).toHaveValue("123");
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(2);
      expect(alerts[0]).toHaveTextContent(
        /Password must be at least 8 characters long!/i
      );
      expect(alerts[1]).toHaveTextContent(/Password Should be like Abc@1234./i);
    });
  });

  it("pass valid password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    userEvent.type(inputEl, "Abc@1234");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByLabelText(labels.newPassword);
    const inputEl2 = screen.getByLabelText(labels.confirmPassword);
    userEvent.type(inputEl, "Abc@1234");
    userEvent.type(inputEl2, "Abc@12344");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText("The confirm password and new password must match")
      ).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(<ChangePassword />);
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
