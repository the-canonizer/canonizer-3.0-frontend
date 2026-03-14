import { Typography, Form, Card, Button } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import LogoHeader from "src/components/common/headers/logoHeader";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import Inputs from "src/components/shared/FormInputs";
import SecondaryButton from "src/components/shared/Buttons/SecondaryButton";

const { Title, Text } = Typography;

export default function OTPVerify({
  form,
  onFinish,
  isResend,
  failedMsg,
  onResendClick,
  isDisabled,
  onBrowseClick,
  logMsg = "",
}) {
  return (
    <Card className="rounded-lg h-full p-5" bordered={false} id="otp-card">
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "001" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        className="relative"
        id="otp-form"
      >
        <div
          className="flex justify-center items-center text-center flex-col mb-4"
          id="otp-header"
        >
          <Button
            type="link"
            className="text-sm text-canBlack flex items-start justify-start text-sm font-medium p-0 absolute left-0 top-0"
            onClick={onBrowseClick}
            id="go-back-btn"
          >
            <LeftOutlined /> Go Back
          </Button>
          <LogoHeader />
          <Title
            level={4}
            className="mt-10 text-sm text-canBlack font-normal"
            id="registration-title"
          >
            Enter your OTP to login
          </Title>
          <Text
            className="text-center text-muted text-xs block mb-10"
            id="otp-note-text"
          >
            {isResend ? failedMsg : logMsg ? logMsg : messages?.labels?.regOtp}
          </Text>
        </div>

        <div className="mt-10" id="otp-input-container">
          <Inputs
            name="otp"
            style={{ textAlign: "center" }}
            rules={messages.otpRule}
            placeholder={messages.placeholders.otp}
            min={6}
            max={6}
            maxLength={6}
            wrapperClassName="w-full md:w-8/12 mx-auto block"
            id="otp-input"
          />
        </div>
        <Form.Item className="mt-8" id="otp-form-item">
          {isResend ||
            (true && (
              <SecondaryButton
                type="text"
                htmlType="button"
                className="h-[40px] text-sm rounded-lg !w-auto m-auto flex justify-center items-center mb-4 sm:!w-3/12 border-0"
                onClick={onResendClick}
                id="resent-otp-btn"
              >
                Resend OTP <RedoOutlined />
              </SecondaryButton>
            ))}
          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="h-[40px] text-sm mt-5 rounded-lg m-auto flex justify-center items-center !w-8/12 lg:!w-4/12"
            block
            data-testid="submitButton"
            id="otp-submit-btn"
            disabled={!isDisabled}
          >
            Submit <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>
      </Form>
    </Card>
  );
}
