import { Typography, Form, Input, Button, Image, Row, Col } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

import styles from "../../Registration/UI/Registration.module.scss";

import messages from "../../../../messages";
import FormItem from "../../../common/formElements";
import { fallBackSrc } from "../../../../assets/data-images";

const { Title, Text } = Typography;

function ForgotPasswordUI({ form, onFinish, isModal, closeModal, isScreen }) {
  return (
    <section className={styles.signup_wrapper + " " + styles.textCenter}>
      <Form
        form={form}
        name={
          isScreen === 2
            ? "setPassword"
            : isScreen === 1
            ? "otpverify"
            : "forgotPassword"
        }
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Title level={2} className={styles.titles}>
          {isScreen === 2
            ? "Reset Your Password"
            : isScreen === 1
            ? "Create password verification code"
            : "Forgot your password?"}
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
            />
          </div>
          {isScreen === 0 && (
            <Text type="danger" className={styles.otpNote}>
              Don&apos;t worry, it happens. Let us know the email address you
              signed up
              <span className={styles.otpNoteSupport}>
                with and we&apos;ll send you an email with instructions.
              </span>
            </Text>
          )}
          {isScreen === 1 && (
            <Text type="danger" className={styles.otpNote}>
              Note : ForgotPassword code has been sent to your registered email
              address and Phone Number.
            </Text>
          )}
          {isScreen === 0 && (
            <Form.Item
              name="email_id"
              label={messages.labels.emailId}
              style={{ textAlign: "center" }}
              {...messages.emRule}
              className={styles.textCenter}
            >
              <Input
                className={styles.otpInput}
                placeholder={messages.placeholders.emailId}
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
          {isScreen === 2 && (
            <Row gutter={20} justify="center" align="top">
              <Col xs={24} md={8}>
                <FormItem
                  name="password"
                  label={messages.labels.newPassword}
                  rules={messages.passwordRule}
                  placeholder={messages.placeholders.newPassword}
                  type="password"
                />
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="confirm"
                  label={messages.labels.confirmPassword}
                  dependencies={["password"]}
                  {...messages.confirmPasswordRule}
                >
                  <Input
                    type="password"
                    placeholder={messages.placeholders.confirmPassword}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles["login-form-button"]}
            block
            data-testid="submitButton"
          >
            Submit <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default ForgotPasswordUI;
