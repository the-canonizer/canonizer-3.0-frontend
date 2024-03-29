import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ChangePassword from "../index";
import messages from "../../../../messages";
import ChangePasswordUI from "../ChangePasswordUI";
import { changePassword } from "../../../../network/api/userApi";

const { labels, placeholders, validations } = messages;

describe("ChangePassword page", () => {
  it("render labels", () => {
    render(<ChangePasswordUI />);
    expect(screen.getByText(labels.currentPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(labels.newPassword);

    // Simulate a space key press
    fireEvent.keyDown(input, { key: " ", keyCode: 32 });
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
    render(<ChangePassword isModal={false} />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    userEvent.type(inputEl, "123");
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
    userEvent.type(inputEl, "Abc@1234");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(<ChangePassword />);
    const inputEl = screen.getByPlaceholderText(labels.newPassword);
    const inputEl2 = screen.getByPlaceholderText("Enter Confirm Password");
    userEvent.type(inputEl, "Abc@1234");
    userEvent.type(inputEl2, "Abc@12344");
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
  it("onChangeFun updates state correctly", async () => {
    const // form = jest.fn(),
      onFinish = jest.fn(),
      onFinishFailed = jest.fn(),
      incorrectPasswordData = "",
      setIncorrectPasswordData = jest.fn();
    // const { getByPlaceholderText, getByTestId } =
    render(
      <ChangePasswordUI
        form={null}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        incorrectPasswordData={incorrectPasswordData}
        setIncorrectPasswordData={setIncorrectPasswordData}
      />
    );
    // const input = getByPlaceholderText('password');

    // Simulate a change event with a new value
    const inputEl = screen.getByPlaceholderText(
      messages.placeholders.currentPassword
    );
    expect(inputEl).toBeInTheDocument();
    // expect(inputEl).toHaveAttribute("type", "password");

    await fireEvent.change(inputEl, { target: { value: "123456" } });
    await userEvent.tab();
  });
});
jest.mock("src/network/api/userApi");

afterEach(cleanup);
describe("change password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("click on save button", async () => {
    const { getAllByTestId } = render(<ChangePassword />);
    await waitFor(() => {
      const old_password = getAllByTestId("currentpasssword");
      fireEvent.change(old_password[0], { target: { value: "Test@123" } });
      const newPassword = getAllByTestId("newpassword");
      fireEvent.change(newPassword[0], { target: { value: "Tests@123" } });
      const confirmpassword = getAllByTestId("confirmpassword");
      fireEvent.change(confirmpassword[0], { target: { value: "Tests@123" } });
      changePassword.mockResolvedValue({
        status_code: 200,
      });
      const save_button = getAllByTestId("submitButton");
      expect(save_button.length).toEqual(2);
      fireEvent.click(save_button[0]);
    });
  });
});
