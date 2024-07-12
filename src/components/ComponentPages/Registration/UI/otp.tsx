import { Image, Typography, Form, Card } from "antd";
import { ArrowRightOutlined, RedoOutlined } from "@ant-design/icons";

import messages from "src/messages";
import { fallBackSrc } from "src/assets/data-images";
import LogoHeader from "src/components/common/headers/logoHeader";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import Inputs from "src/components/shared/FormInputs";
import SecondaryButton from "src/components/shared/Buttons/SecondaryButton";
import RegistrationUiGoBack from "./goBack";

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
          <RegistrationUiGoBack onBrowseClick={onBrowseClick} />
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-sm text-canBlack font-medium"
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
            className="text-center text-sm block mb-4"
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
            wrapperClassName="w-full md:w-8/12 mx-auto block"
          />
        </div>
        <Form.Item>
          {isResend && (
            <SecondaryButton
              type="text"
              htmlType="button"
              className="h-[40px] text-sm rounded-lg !w-auto m-auto flex justify-center items-center mb-4 sm:!w-full"
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
            className="h-[40px] text-sm rounded-lg m-auto flex justify-center items-center !w-8/12 lg:!w-4/12"
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
