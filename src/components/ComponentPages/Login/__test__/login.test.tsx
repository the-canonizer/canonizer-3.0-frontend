import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import Login from "../index";
import messages from "../../../../messages";
import { login } from "../../../../network/api/userApi";

const { labels, placeholders } = messages;

const API = {
  login() {
    return login("test222@gmail.com", "Test@123");
  },
};

describe("Login page", () => {
  it("render heading and labels", () => {
    render(<Login isModal={false} />);
    let heading = screen.getByRole("heading", { name: /Login to Canonizer/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.emailPhone)).toBeInTheDocument();
    expect(screen.getByText(labels.password)).toBeInTheDocument();
    expect(screen.getByText("Forgot password").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText("Don't have an account?")).toBeVisible();
    expect(screen.getByText("Register Now")).toBeVisible();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter to the best leaderless consensus building and tracking system in the world."
      )
    ).toBeInTheDocument();
  });

  it("render username input field", () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByLabelText(labels.emailPhone);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");
    expect(inputEl).toHaveAttribute("placeholder", placeholders.emailPhone);
  });

  it("render password input field", () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByLabelText(labels.password);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "password");
    expect(inputEl).toHaveAttribute("placeholder", placeholders.password);
  });

  it("pass valid email to test email input field", async () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByLabelText(labels.emailPhone);
    userEvent.type(inputEl, "rahul.singh@iffort.com");
    await waitFor(() => {
      expect(inputEl).toHaveValue("rahul.singh@iffort.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
    render(<Login isModal={false} />);
    const inputEl = screen.getByLabelText(labels.emailPhone);
    userEvent.type(inputEl, "rahul.singhiffort.com");
    await waitFor(() => {
      expect(screen.getByText("Input is not valid!")).toBeInTheDocument();
    });
  });

  it("blank form should not be submit", async () => {
    render(<Login isModal={false} />);
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(
        screen.queryByText("Please input your Email / Phone Number!")
      ).toBeVisible();
      expect(screen.queryByText("Please input your Password!")).toBeVisible();
    });
  });

  // it("should not login with unregistered email", async () => {
  //   const { getByTestId } = render(<Login isModal={false} />);
  //   const resD = { data: { auth: {}, user: {} } };

  //   const res = jest.spyOn(API, "login").mockImplementationOnce(() => {
  //     return Promise.resolve(resD);
  //   });

  //   userEvent.click(getByTestId("submitButton"));

  //   await waitFor(() => {
  //     expect(screen.queryByText("Something went wrong")).toBeInTheDocument();
  //   });

  //   // jest.mock("../../../../network/api/userApi", () => {
  //   //   return {
  //   //     getLoginRes: jest.fn(() => Promise.resolve(resD)),
  //   //   };
  //   // });

  //   // // const res = await login("test@gmail.com", "Test@123");
  //   // await waitFor(() => {
  //   //   expect(res.status_code).not.toBe(200);
  //   // });
  // });

  // it("should not login with valid email and invalid password", async () => {
  //   const res = await login("rahul.singh@iffort.com", "Test@1234");
  //   await waitFor(() => {
  //     expect(res.status_code).not.toBe(200);
  //   });
  // });

  // it("should not login with invalid email and valid password", async () => {
  //   const res = await login("rahul123@test.com", "Test@123");
  //   await waitFor(() => {
  //     expect(res.status_code).not.toBe(200);
  //   });
  // });

  // it("should get access token from api with valid credential", async () => {
  //   const res = await login("rahul.singh@iffort.com", "Test@123");
  //   await waitFor(() => {
  //     expect(res.status_code).toBe(200);
  //   });
  // });
});
