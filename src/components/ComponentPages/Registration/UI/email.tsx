import { Typography, Form, Button, Card } from "antd";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import Inputs from "src/components/shared/FormInputs";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Title, Text } = Typography;

const EmailConfirmation = ({
  form,
  onFinish,
  isModal,
  closeModal,
  isOTP,
  onResendClick,
  isResend,
}) => (
  <Card className="rounded-lg" bordered={false}>
    <Form
      form={form}
      name="registration"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
      className="relative"
    >
      <Title
        level={4}
        className="mt-4 text-sm text-canBlack font-medium"
        id="otp-title"
      >
        {isOTP ? messages.labels.otpTitle : messages.labels.emailTitle}
      </Title>

      {isModal && (
        <Button
          shape="circle"
          type="link"
          className="text-canBlack absolute !border-0 top-0 right-0 bg-transparent"
          onClick={closeModal}
          icon={<CloseCircleOutlined />}
          id="close-modal-btn"
        />
      )}
      <div className="w-full mt-4">
        <Text
          type="danger"
          className="text-xs text-danger text-center block mb-4 mt-2"
          id="note-text"
        >
          {isOTP ? messages.labels.otpLabel : messages.labels.emailLabel}
        </Text>
        {isOTP ? (
          <Inputs
            name="otp"
            wrapperClassName="w-full md:w-8/12 mx-auto block"
            rules={messages.otpRule}
            placeholder={messages.placeholders.otp}
            min={6}
            max={6}
            maxLength={6}
          />
        ) : (
          <Inputs
            name="email"
            wrapperClassName="w-full md:w-8/12 mx-auto block"
            rules={messages.emailRule}
            placeholder={messages.placeholders.email}
          />
        )}
      </div>
      <Form.Item>
        {isResend && (
          <SecondaryButton
            type="primary"
            htmlType="button"
            className="h-[40px] text-sm rounded-md !w-auto m-auto flex justify-center items-center mb-4 sm:!w-full"
            block
            onClick={onResendClick}
            id="otp-send-btn"
          >
            Resend OTP <RedoOutlined />
          </SecondaryButton>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className="h-[40px] text-sm rounded-md m-auto flex justify-center items-center !w-8/12 lg:!w-4/12"
          block
          data-testid="submitButton"
          id="submit-btn"
        >
          Submit <ArrowRightOutlined />
        </Button>
      </Form.Item>
    </Form>
  </Card>
);

export default EmailConfirmation;
