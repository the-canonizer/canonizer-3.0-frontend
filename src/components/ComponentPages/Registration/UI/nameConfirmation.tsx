import { Fragment } from "react";
import { Typography, Form, Row, Col, Button, Card } from "antd";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import Inputs from "components/shared/FormInputs";

const { Title, Text } = Typography;
const { labels } = messages;

const NameConfirmation = ({
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
      name="name-confirmation"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
    >
      <Title
        level={4}
        className="mt-4 text-sm text-canBlack font-medium"
        id="name-title"
      >
        {isOTP ? labels.otpTitle : labels.nameConfirmationTitle}
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
          {isOTP ? labels.otpLabel : labels.nameLabel}
        </Text>
        {isOTP ? (
          <Inputs
            name="otp"
            rules={messages.otpRule}
            placeholder={messages.placeholders.otp}
            min={6}
            max={6}
          />
        ) : (
          <Row gutter={30}>
            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="first_name"
                label={
                  <Fragment>
                    {messages.labels.firstName} <span>(Limit 100 Chars)</span>
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.firstNameRule}
                placeholder={messages.placeholders.firstName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Col>

            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="last_name"
                label={
                  <Fragment>
                    {messages.labels.lastName}
                    <span>(Limit 100 Chars)</span>
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.lastNameRule}
                placeholder={messages.placeholders.lastName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Col>
          </Row>
        )}
      </div>
      <Form.Item>
        {isResend && (
          <Button
            type="primary"
            htmlType="button"
            className="h-[40px] text-sm rounded-md !w-auto m-auto flex justify-center items-center mb-4 sm:!w-full"
            block
            onClick={onResendClick}
            id="otp-send-btn"
          >
            Resend OTP <RedoOutlined />
          </Button>
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

export default NameConfirmation;
