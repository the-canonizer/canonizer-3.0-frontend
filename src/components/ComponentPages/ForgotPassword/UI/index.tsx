import { Typography, Form } from "antd";
import { ArrowRightOutlined, MailOutlined } from "@ant-design/icons";
import { Fragment } from "react";

import messages from "src/messages";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import LogoHeader from "components/common/headers/logoHeader";

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
      className="h-full flex flex-col p-6"
    >
      <div className="flex justify-center items-center text-center flex-col mb-6 mt-6">
        <LogoHeader />
      </div>
      <Title
        level={4}
        className="text-sm text-center text-canBlack font-normal"
        id="forgot-password-title"
      >
        {labels.forgotModalLabel}
      </Title>
      <Text
        className="text-center block font-normal text-muted mb-10"
        id="forgot-modal-note"
      >
        Let us know the email address you signed up with and we&apos;ll send you
        an email with instructions.
      </Text>

      <div className="mt-10">
        <div className="w-8/12 lg:w-7/12 mx-auto overflow-hidden">
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
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12 flex items-center justify-center mx-auto"
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
