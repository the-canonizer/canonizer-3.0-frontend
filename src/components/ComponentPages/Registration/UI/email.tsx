import { Typography, Form, Input, Button } from "antd";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";

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
  <section className={styles.signup_wrapper + " " + styles.textCenter}>
    <Form
      form={form}
      name="registration"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
    >
      <Title level={2} className={styles.titles}>
        {isOTP ? "One Time Verification Code" : "User Email Confirmation"}
      </Title>
      {isModal && (
        <Button
          shape="circle"
          type="link"
          className={styles.close_btn}
          onClick={closeModal}
          icon={<CloseCircleOutlined />}
        />
      )}
      <div className={styles.section_one}>
        <Text type="danger" className={styles.otpNote}>
          {isOTP ? messages.labels.otpLabel : messages.labels.emailLabel}
        </Text>
        {isOTP ? (
          <Form.Item
            name="otp"
            className={styles.confirmationINput}
            {...messages.otpRule}
          >
            <Input
              className={styles.otpInput}
              placeholder={messages.placeholders.otp}
              min={6}
              max={6}
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="email"
            className={styles.confirmationINput}
            {...messages.emailRule}
          >
            <Input placeholder={messages.placeholders.email} />
          </Form.Item>
        )}
      </div>
      <Form.Item>
        {isResend && (
          <Button
            type="primary"
            htmlType="button"
            className={styles.resetOTP}
            block
            onClick={onResendClick}
          >
            Resend OTP <RedoOutlined />
          </Button>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className={styles["login-form-button"]}
          block
          data-testid="submitButton"
          style={{ width: "150px" }}
        >
          Submit <ArrowRightOutlined />
        </Button>
      </Form.Item>
    </Form>
  </section>
);

export default EmailConfirmation;
