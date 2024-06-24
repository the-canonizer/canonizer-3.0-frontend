import { Image, Typography, Form, Card, Button } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import { fallBackSrc } from "src/assets/data-images";
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
    <Card className="rounded-lg" bordered={false}>
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "001" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
      >
        <div className="flex justify-center items-center text-center flex-col mb-4">
          <Button
            type="link"
            className="h-[50px] text-14 w-2/12 text-black flex items-center justify-start text-14 font-medium p-0 mb-4 hidden sm:block sm:self-start"
            onClick={onBrowseClick}
          >
            <LeftOutlined /> Go Back
          </Button>
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-14 text-black font-medium"
            id="registration-title"
          >
            Log In One Time Verification Code
          </Title>
        </div>

        <div className="">
          <div className="text-center my-3">
            <Image
              preview={false}
              alt="otp"
              src="/images/otp-image_sm.png"
              fallback={fallBackSrc}
              id="otp-modal-image"
            />
          </div>
          <Text
            type="danger"
            className="text-center text-14 block mb-4"
            id="otp-note-text"
          >
            {isResend ? failedMsg : logMsg ? logMsg : messages?.labels?.regOtp}
          </Text>
          <Inputs
            name="otp"
            style={{ textAlign: "center" }}
            rules={messages.otpRule}
            placeholder={messages.placeholders.otp}
            min={6}
            max={6}
            maxLength={6}
            wrapperClassName="w-6/12 mx-auto block sm:w-full"
          />
        </div>
        <Form.Item>
          {isResend && (
            <SecondaryButton
              type="text"
              htmlType="button"
              className="h-[40px] text-14 rounded-md !w-auto m-auto flex justify-center items-center mb-4 sm:!w-full"
              block
              onClick={onResendClick}
              id="resent-otp-btn"
            >
              Resend OTP <RedoOutlined />
            </SecondaryButton>
          )}
          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="h-[40px] text-14 rounded-md !w-4/12 m-auto flex justify-center items-center sm:!w-full"
            block
            data-testid="submitButton"
            id="otp-btn"
            disabled={!isDisabled}
          >
            Submit <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>
      </Form>
    </Card>
  );
}
