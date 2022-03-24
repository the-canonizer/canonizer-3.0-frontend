import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Registration from "../index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

describe("Registration page", () => {
  it("render heading and labels", () => {
    render(<Registration isModal={false} />);
    let heading = screen.getByRole("heading", {
      name: /Register Now on Canonizer/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeVisible();
    expect(screen.getByText("Log in Here")).toBeVisible();
    expect(screen.getByText(labels.firstName)).toBeInTheDocument();
    expect(screen.getByText(labels.lastName)).toBeInTheDocument();
    expect(screen.getByText(labels.email)).toBeInTheDocument();
    expect(screen.getByText(labels.phone)).toBeInTheDocument();
    expect(screen.getByText(labels.registrationPassword)).toBeInTheDocument();
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<Registration isModal={false} />);
    const firstName = screen.getByLabelText(labels.firstName);
    const lastName = screen.getByLabelText(labels.lastName);
    const email = screen.getByLabelText(labels.email);
    const phone = screen.getByLabelText(labels.phone);
    const registrationPassword = screen.getByLabelText(
      labels.registrationPassword
    );
    const confirmPassword = screen.getByLabelText(labels.confirmPassword);

    expect(firstName).toBeInTheDocument();
    expect(firstName).toHaveAttribute("type", "text");
    expect(firstName).toHaveAttribute("placeholder", placeholders.firstName);

    expect(lastName).toBeInTheDocument();
    expect(lastName).toHaveAttribute("type", "text");
    expect(lastName).toHaveAttribute("placeholder", placeholders.lastName);

    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("type", "text");
    expect(email).toHaveAttribute("placeholder", placeholders.email);

    expect(phone).toBeInTheDocument();
    expect(phone).toHaveAttribute("type", "number");
    expect(phone).toHaveAttribute("placeholder", placeholders.phone);

    expect(registrationPassword).toBeInTheDocument();
    expect(registrationPassword).toHaveAttribute("type", "password");
    expect(registrationPassword).toHaveAttribute(
      "placeholder",
      placeholders.registrationPassword
    );

    expect(confirmPassword).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute(
      "placeholder",
      placeholders.confirmPassword
    );
  });

  it("pass valid email to test email input field", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.email);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    await waitFor(() => {
      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.email);
    userEvent.type(inputEl, "rahul.singhiffort.com");
    userEvent.tab();
    await waitFor(() => {
      expect(
        screen.queryByText("The input is not valid E-mail!")
      ).toBeVisible();
    });
  });

  it("check phone number length is less than 9 chars", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.phone);
    userEvent.type(inputEl, "12345678");
    userEvent.tab();
    await waitFor(() => {
      expect(inputEl).toHaveValue(12345678);
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.phoneMinLength)).toBeVisible();
    });
  });

  it("check phone number length should be min of 9 chars", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.phone);
    userEvent.type(inputEl, "123456789");
    await waitFor(() => {
      expect(inputEl).toHaveValue(123456789);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("check password minimum length > 8", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.password);
    userEvent.type(inputEl, "1234567");
    userEvent.tab();
    await waitFor(() => {
      expect(inputEl).toHaveValue("1234567");
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(
        screen.queryByText(
          "Password must be contain small, capital letter, number and special character like Abc@1234."
        )
      ).toBeVisible();
    });
  });

  it("pass valid password", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.password);
    userEvent.type(inputEl, "Abc@1234");
    await waitFor(() => {
      expect(inputEl).toHaveValue("Abc@1234");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid confirm password", async () => {
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.password);
    const inputEl2 = screen.getByLabelText(labels.confirmPassword);
    userEvent.type(inputEl, "Abc@1234");
    userEvent.type(inputEl2, "Abc@12344");
    userEvent.tab();
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
    render(<Registration isModal={false} />);
    const inputEl = screen.getByLabelText(labels.password);
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
    render(<Registration isModal={false} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText("Please input your first name!")).toBeVisible();
      expect(screen.queryByText("Please input your last name!")).toBeVisible();
      expect(screen.queryByText("Please input your E-mail!")).toBeVisible();
      expect(screen.queryByText("Please input your password!")).toBeVisible();
      expect(screen.queryByText("Please confirm your password!")).toBeVisible();
      expect(
        screen.queryByText("Please input the captcha you got!")
      ).toBeVisible();
    });
  });
});
