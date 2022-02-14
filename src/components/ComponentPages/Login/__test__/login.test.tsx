import { render, screen, waitFor } from "../src/utils/testUtils";
import userEvent from "@testing-library/user-event";

import Login from "../index";

describe("Login page", () => {
  it("render heading", () => {
    render(<Login isModal={false} />);
    let heading = screen.getByRole("heading", { name: /Login to Canonizer/i });
    expect(heading).toBeInTheDocument();
  });

  it("render username input", () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByPlaceholderText("Enter Email / Phone Number");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");
  });

  it("render password input", () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByPlaceholderText("Enter Password");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "password");
  });

  it("pass valid email to test email input field", async () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByPlaceholderText("Enter Email / Phone Number");
    userEvent.type(inputEl, "test@mail.com");
    await waitFor(() => {
      expect(inputEl).toHaveValue("test@mail.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("pass invalid email to test email", async () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByPlaceholderText("Enter Email / Phone Number");
    userEvent.type(inputEl, "abcmail.com");
    await waitFor(() => {
      expect(screen.getByText("Input is not valid!")).toBeInTheDocument();
    });
  });

  it("pass invalid email to test email input field", async () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByPlaceholderText("Enter Email / Phone Number");
    userEvent.type(inputEl, "test@mail");
    expect(inputEl).toHaveValue("test@mail");
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByRole("alert").textContent).toEqual(
        "Input is not valid!"
      );
    });
  });

  it("pass empty form is not submitted", async () => {
    render(<Login isModal={false} />);
    const submitBtn = screen.getByTestId("submitButton");
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByRole("alert").textContent).toEqual(
        "Please input your Email / Phone Number!"
      );
      //   expect((screen.queryAllByRole("alert")[0]).textContent).toEqual(
      //     "Please input your Password!"
      //   );
    });
  });
});
