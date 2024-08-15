import { Typography, Form } from "antd";
import { ArrowRightOutlined, MailOutlined } from "@ant-design/icons";
import { Fragment } from "react";

import messages from "src/messages";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";

const { Title, Text } = Typography;
const { labels } = messages;

function ForgotPasswordUI({ form, onFinish, isDisabled }) {
  return (
    <Form
      form={form}
      name={"forgotPassword"}
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
        {labels.forgotModalLabel}
      </Title>

      <div className="my-auto">
        <Text
          className="text-center block text-sm font-medium mb-20 text-canBlack w-8/12 lg:w-7/12 mx-auto"
          id="forgot-modal-note"
        >
          Don&apos;t worry, it happens.
          <br /> Let us know the email address you signed up with and we&apos;ll
          send you an email with instructions.
        </Text>
        <div className="w-8/12 lg:w-7/12 mx-auto my-5 overflow-hidden">
          <Inputs
            name="email_id"
            label={
              <Fragment>
                {messages.labels.emailId}
                <span className="required">*</span>
              </Fragment>
            }
            rules={messages.emRule}
            placeholder={messages.placeholders.emailId}
            onKeyDown={(e) =>
              e.key === " " && e.keyCode === 32 && e.preventDefault()
            }
            maxLength={255}
            prefix={<MailOutlined />}
            type="email"
          />
        </div>
        <Form.Item className="text-center mt-4">
          <PrimaryButton
            htmlType="submit"
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-7/12 flex items-center justify-center mx-auto"
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
