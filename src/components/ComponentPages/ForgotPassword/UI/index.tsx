import { Typography, Form, Input, Button, Image } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

import styles from "../../Registration/UI/Registration.module.scss";

import messages from "../../../../messages";
import { fallBackSrc } from "../../../../assets/data-images";
import { Fragment } from "react";

const { Title, Text } = Typography;
const { labels } = messages;

function ForgotPasswordUI({
  form,
  onFinish,
  isModal,
  closeModal,
  isScreen,
}: any) {
  return (
    <section className={styles.signup_wrapper + " " + styles.textCenter}>
      <Form
        form={form}
        name={isScreen === 1 ? "otpverify" : "forgotPassword"}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
      >
        <Title level={2} className={styles.titles} id="forgot-password-title">
          {isScreen === 1 ? labels.verificationLabel : labels.forgotModalLabel}
        </Title>
        {isModal && (
          <Button
            shape="circle"
            type="link"
            className={styles.close_btn}
            onClick={closeModal}
            icon={<CloseCircleOutlined />}
            id="forgot-modal-close-btn"
          />
        )}
        <div className={styles.section_one}>
          <div className={styles.imageWrapper}>
            <Image
              preview={false}
              alt="otp"
              src={
                isScreen === 1
                  ? "/images/otp-image.png"
                  : "/images/forgot-password.png"
              }
              fallback={fallBackSrc}
              width={200}
              id="forgot-modal-img"
            />
          </div>
          {isScreen === 0 && (
            <Text
              type="danger"
              className={styles.otpNote}
              id="forgot-modal-note"
            >
              Don&apos;t worry, it happens. Let us know the email address you
              signed up{" "}
              <span className={styles.otpNoteSupport}>
                with and we&apos;ll send you an email with instructions.
              </span>
            </Text>
          )}
          {isScreen === 1 && (
            <Text type="danger" className={styles.otpNote} id="otp-msg">
              {messages.validations.otpMsgs}
            </Text>
          )}
          {isScreen === 0 && (
            <Form.Item
              name="email_id"
              label={
                <Fragment>
                  {messages.labels.emailId}
                  <span className="required">*</span>
                </Fragment>
              }
              style={{ textAlign: "center" }}
              {...messages.emRule}
              className={styles.textCenter}
            >
              <Input
                className={styles.otpInput}
                placeholder={messages.placeholders.emailId}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
              />
            </Form.Item>
          )}
          {isScreen === 1 && (
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
          )}
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles["login-form-button"]}
            block
            data-testid="submitButton"
            id="submit-btn"
          >
            Submit <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default ForgotPasswordUI;
