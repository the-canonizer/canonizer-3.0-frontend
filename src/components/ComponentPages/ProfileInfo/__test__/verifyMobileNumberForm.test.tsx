import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import VerifyMobileNumberForm from "../../Form/VerifyMobileNumberForm";
import messages from "../../../../messages";

const { labels, validations } = messages;
const onVerifyClick = jest.fn();
const onOTPBtnClick = jest.fn();
const handleOTPCancel = jest.fn();
const handleChangeOTP = jest.fn();
const mobileCarrier = [];
const isOTPModalVisible = false;
const otp = "";

describe("Verify Mobile Number Page", () => {
  it("render heading and labels Of Verfiy Mobile Number Form", () => {
    render(
      <VerifyMobileNumberForm
        onVerifyClick={onVerifyClick}
        mobileCarrier={mobileCarrier}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
      />
    );

    expect(screen.getByText(labels.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText(labels.mobileCarrier)).toBeInTheDocument();
  });

  it("check phone number length is less than 9 chars", async () => {
    render(
      <VerifyMobileNumberForm
        onVerifyClick={onVerifyClick}
        mobileCarrier={mobileCarrier}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
      />
    );

    const inputEl = screen.getByPlaceholderText("Enter Phone Number");
    fireEvent.change(inputEl, { target: { value: "12345678" } });
    await waitFor(() => {
      expect(inputEl).toHaveValue(12345678);
      expect(screen.queryByRole("alert")).toBeInTheDocument();
      expect(screen.queryByText(validations.phoneMinLength)).toBeVisible();
    });
  });

  it("check phone number length should be min of 9 chars", async () => {
    render(
      <VerifyMobileNumberForm
        onVerifyClick={onVerifyClick}
        mobileCarrier={mobileCarrier}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
      />
    );

    const inputEl = screen.getByPlaceholderText("Enter Phone Number");
    fireEvent.change(inputEl, { target: { value: "123456789" } });
    await waitFor(() => {
      expect(inputEl).toHaveValue(123456789);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("blank VerifyMobile form should not be submit", async () => {
    render(
      <VerifyMobileNumberForm
        onVerifyClick={onVerifyClick}
        mobileCarrier={mobileCarrier}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
      />
    );

    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText(validations.phoneNumber)).toBeVisible();
    });
  });
});
