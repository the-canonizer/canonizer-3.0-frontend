import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ResetPassword from "../";
import messages from "../../../../messages";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const { placeholders, labels, validations } = messages;

describe("Reset Password page", () => {
  it("render heading labels and text", async () => {
    render(<ResetPassword is_test={true} />);
    let heading = screen.getByText(labels.createPassword);
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("render inputs field and submit button", async () => {
    render(<ResetPassword is_test={true} />);
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
    render(<ResetPassword is_test={true} />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    await fireEvent.change(inputEl, { target: { value: "1234567" } });
    await userEvent.tab();
    waitFor(() => {
      expect(inputEl).toHaveValue("1234567");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.passwordPattern)).toBeVisible();
    });
  });

  it("pass valid password", async () => {
    render(<ResetPassword is_test={true} />);
    const inputEl = screen.getByPlaceholderText(placeholders.newPassword);
    await fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    expect(inputEl).toHaveValue("Abc@1234");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("pass invalid confirm password", async () => {
    render(<ResetPassword is_test={true} />);
    const inputEl = screen.getByPlaceholderText(
      messages.placeholders.newPassword
    );
    const inputEl2 = screen.getByPlaceholderText(
      messages.placeholders.confirmPassword
    );
    fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
    fireEvent.focusOut(inputEl);
    fireEvent.change(inputEl2, { target: { value: "Abc@12344" } });
    fireEvent.focusOut(inputEl2);
    waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@12344");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.confirmPasswordErr)).toBeVisible();
    });
  });

  it("pass valid confirm password", async () => {
    render(<ResetPassword is_test={true} />);
    const inputEl = await screen.getByPlaceholderText(placeholders.newPassword);
    const inputEl2 = await screen.getByPlaceholderText(
      placeholders.confirmPassword
    );
    act(async () => {
      await fireEvent.change(inputEl, { target: { value: "Abc@1234" } });
      await fireEvent.change(inputEl2, { target: { value: "Abc@1234" } });
    });
    waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(inputEl2).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
