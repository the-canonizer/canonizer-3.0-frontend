import React, { createRef, useEffect } from "react";
import { Row, Col, Typography, Form, Input, Button, Select } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import SocialLoginButton from "../../../common/social-login/social-login";

const { Title, Text } = Typography;
const { Option } = Select;

function RegistrationUi({
  form,
  onFinish,
  isModal,
  closeModal,
  onReCAPTCHAChange,
  resetCaptcha,
  showCaptchaError,
}) {
  const recaptchaRef = createRef();

  const countryCodes = ["+91", "+86", "+87"];

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 90 }}>
        {countryCodes.map((code) => (
          <Option value={code} key={code}>
            {code}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    if (resetCaptcha) {
      recaptchaRef.current.reset();
    }
  }, [resetCaptcha, recaptchaRef]);

  return (
    <section className={styles.signup_wrapper}>
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "+91" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Title level={2} className={styles.titles}>
          Register Now on Canonizer
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
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item
                name="first_name"
                label={messages.labels.firstName}
                rules={[
                  {
                    required: true,
                    message: messages.validations.firstName,
                  },
                  {
                    max: 100,
                    message: messages.validations.firstNameMax,
                  },
                ]}
              >
                <Input placeholder={messages.placeholders.firstName} />
              </Form.Item>
              <Form.Item
                name="last_name"
                label={messages.labels.lastName}
                rules={[
                  {
                    required: true,
                    message: messages.validations.lastName,
                  },
                  {
                    max: 100,
                    message: messages.validations.firstNameMax,
                  },
                ]}
              >
                <Input placeholder={messages.placeholders.lastName} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={messages.labels.phone}
                rules={[
                  {
                    required: false,
                    message: messages.validations.phone,
                  },
                  {
                    min: 9,
                    message: messages.validations.phoneLength,
                  },
                  {
                    max: 10,
                    message: messages.validations.phoneLength,
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  placeholder={messages.placeholders.phone}
                />
              </Form.Item>
              <Form.Item
                label={messages.labels.captcha}
                name="captcha"
                rules={[
                  () => ({
                    validator() {
                      if (showCaptchaError) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(messages.validations.captcha)
                      );
                    },
                  }),
                ]}
              >
                <div className={styles.captchaCol}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onReCAPTCHAChange}
                    grecaptcha={global.window?.grecaptcha}
                  />
                </div>
                {/* {showCaptchaError && (
                  <Text type="danger">{messages.validations.captcha}</Text>
                )} */}
                {/* <div className={styles.captchaEnter}>
                  <Input
                    placeholder={messages.placeholders.captcha}
                    onChange={handleOnChange}
                  />
                </div> */}
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="middle_name"
                label={messages.labels.middleName}
                rules={[
                  {
                    max: 100,
                    message: messages.validations.middleName,
                  },
                ]}
              >
                <Input placeholder={messages.placeholders.middleName} />
              </Form.Item>
              <Form.Item
                name="email"
                label={messages.labels.email}
                rules={[
                  {
                    type: "email",
                    message: messages.validations.email,
                  },
                  {
                    max: 255,
                    message: messages.validations.middleName,
                  },
                  {
                    required: true,
                    message: messages.validations.email,
                  },
                  {
                    pattern: messages.patterns.email,
                    message: messages.validations.validEmail,
                  },
                ]}
              >
                <Input placeholder={messages.placeholders.email} />
              </Form.Item>
              <Form.Item
                name="password"
                label={messages.labels.password}
                rules={[
                  {
                    required: true,
                    message: messages.validations.registrationPassword,
                  },
                  {
                    min: 5,
                    message: messages.validations.passwordMinLength,
                  },
                  {
                    pattern: messages.patterns.password,
                    message: messages.validations.passwordPattern,
                  },
                ]}
              >
                <Input
                  type="password"
                  placeholder={messages.placeholders.password}
                />
              </Form.Item>
              <Form.Item
                name="confirm"
                label={messages.labels.confirmPassword}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: messages.validations.confirmPassword,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(messages.validations.confirmPasswordErr)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type="password"
                  placeholder={messages.placeholders.confirmPassword}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            Register Now <ArrowRightOutlined />
          </Button>
        </Form.Item>

        <Form.Item>
          <SocialLoginButton />
        </Form.Item>
        <Form.Item noStyle>
          <Text className={styles.ft_link}>
            Already have an account? <Link href="/login">Login Here</Link>
          </Text>
        </Form.Item>
      </Form>
    </section>
  );
}

export default RegistrationUi;
