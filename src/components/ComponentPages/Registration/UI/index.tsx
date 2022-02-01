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
  country,
}) {
  const recaptchaRef = createRef();

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 90 }}>
        {country.map((code) => (
          <Option value={code.phone_code} key={code.country_code}>
            {code.phone_code} {code.country_code}
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
        initialValues={{ prefix: "+1" }}
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
                {...messages.firstNameRule}
              >
                <Input placeholder={messages.placeholders.firstName} />
              </Form.Item>
              <Form.Item
                name="last_name"
                label={messages.labels.lastName}
                {...messages.lastNameRule}
              >
                <Input placeholder={messages.placeholders.lastName} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={messages.labels.phone}
                {...messages.phoneRule}
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
                {...messages.getCaptchaRule(showCaptchaError)}
              >
                <div className={styles.captchaCol}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onReCAPTCHAChange}
                    grecaptcha={global.window?.grecaptcha}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="middle_name"
                label={messages.labels.middleName}
                {...messages.middleNameRule}
              >
                <Input placeholder={messages.placeholders.middleName} />
              </Form.Item>
              <Form.Item
                name="email"
                label={messages.labels.email}
                {...messages.emRule}
              >
                <Input placeholder={messages.placeholders.email} />
              </Form.Item>
              <Form.Item
                name="password"
                label={messages.labels.password}
                {...messages.passwordRule}
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
                {...messages.confirmPasswordRule}
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
          <SocialLoginButton isModal={isModal} />
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
