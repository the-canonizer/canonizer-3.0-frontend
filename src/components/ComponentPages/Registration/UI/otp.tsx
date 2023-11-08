import { Image, Typography, Form, Input, Button } from "antd";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import { fallBackSrc } from "../../../../assets/data-images";

const { Title, Text } = Typography;

export default function OTPVerify({
  form,
  onFinish,
  isModal,
  closeModal,
  isResend,
  failedMsg,
  onResendClick,
  logMsg = "",
}: any) {
  return (
    <section className={styles.signup_wrapper + " " + styles.textCenter}>
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "001" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
      >
        <Title level={2} className={styles.titles} id="otp-title-text">
          Log In One Time Verification Code
        </Title>
        {isModal && (
          <Button
            shape="circle"
            type="link"
            className={styles.close_btn}
            onClick={closeModal}
            icon={<CloseCircleOutlined />}
            id="modal-close-btn"
          />
        )}
        <div className={styles.section_one}>
          <div className={styles.imageWrapper}>
            <Image
              preview={false}
              alt="otp"
              src="/images/otp-image_sm.png"
              fallback={fallBackSrc}
              id="otp-modal-image"
            />
          </div>
          <Text type="danger" className={styles.otpNote} id="otp-note-text">
            {isResend ? failedMsg : logMsg ? logMsg : messages?.labels?.regOtp}
          </Text>
          <Form.Item
            name="otp"
            style={{ textAlign: "center" }}
            {...messages.otpRule}
          >
            <Input
              className={styles.otpInput}
              placeholder={messages.placeholders.otp}
              min={6}
              max={6}
            />
          </Form.Item>
        </div>
        <Form.Item>
          {isResend && (
            <Button
              type="primary"
              htmlType="button"
              className={styles.resetOTP}
              block
              onClick={onResendClick}
              id="resent-otp-btn"
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
            id="submit-otp-btn"
          >
            Submit <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
