import { Typography, Form } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import messages from "src/messages";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import Otpinput from "./otpInputs";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Title, Text } = Typography;
const { labels } = messages;

function ForgotPasswordUI({
  form,
  onFinish,
  isDisabled,
  onChangeOtp,
  isResend,
  onRsendClick,
  timer,
}) {
  return (
    <Form
      form={form}
      name={"otpverify"}
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
      className="h-full flex flex-col"
    >
      <Title
        level={2}
        className="mt-6 text-sm text-center text-canBlack font-medium"
        id="forgot-password-title"
      >
        {labels.verificationLabel}
      </Title>
      <div className="my-auto">
        <Text
          className="text-center block text-sm font-medium mb-20 text-canBlack w-8/12 lg:w-7/12 mx-auto"
          id="otp-msg"
        >
          An email has been sent to your regsistered email address.
        </Text>
        <div className="w-8/12 lg:w-7/12 mx-auto my-5 overflow-hidden">
          <Otpinput
            label={
              <>
                {messages.labels.otpTitle}
                <span className="required">*</span>
              </>
            }
            onChangeOtp={onChangeOtp}
          />
          <Inputs
            name="otp"
            label={null}
            rules={messages.otpRule}
            placeholder={messages.placeholders.otp}
            inputClassName="hidden"
          />
          {isResend && (
            <div className="text-center">
              <SecondaryButton
                className="border-0"
                onClick={onRsendClick}
                disabled={timer}
              >
                Resend OTP {isResend ? (timer ? `(${timer}s)` : "") : ""}
              </SecondaryButton>
            </div>
          )}
        </div>
        <Form.Item className="text-center mt-4">
          <PrimaryButton
            htmlType="submit"
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12"
            data-testid="submitButton"
            id="submit-btn"
            disabled={!isDisabled}
          >
            Submit <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>
      </div>
    </Form>
  );
}

export default ForgotPasswordUI;
