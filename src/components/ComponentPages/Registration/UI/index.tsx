import React, { createRef, useEffect } from "react";
import { Row, Col, Typography, Form, Input, Button, Select } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import SocialLoginButton from "../../../common/socialLogin";
import FormItem from "../../../common/formElements";
import { redirectToUrl } from "../../../../utils/generalUtility";

const { Title, Text } = Typography;
const { Option } = Select;

declare global {
  interface Window {
    grecaptcha: any;
  }
}

function RegistrationUi({
  form,
  onFinish,
  isModal,
  closeModal,
  onReCAPTCHAChange,
  resetCaptcha,
  showCaptchaError,
  country,
  openLogin,
}) {
  const recaptchaRef: React.RefObject<{ reset }> = createRef();

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
      recaptchaRef?.current?.reset();
    }
  }, [resetCaptcha, recaptchaRef]);

  const onLoginClick = (e) => {
    e.preventDefault();
    if (isModal) {
      closeModal();
      openLogin();
    } else {
      redirectToUrl(null, "/login");
    }
  };

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
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="first_name"
                label={messages.labels.firstName}
                rules={messages.firstNameRule}
                placeholder={messages.placeholders.firstName}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="middle_name"
                label={messages.labels.middleName}
                rules={messages.middleNameRule}
                placeholder={messages.placeholders.middleName}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="last_name"
                label={messages.labels.lastName}
                rules={messages.lastNameRule}
                placeholder={messages.placeholders.lastName}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="email"
                label={messages.labels.email}
                rules={messages.emRule}
                placeholder={messages.placeholders.email}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
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
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="password"
                label={messages.labels.password}
                rules={messages.passwordRule}
                placeholder={messages.placeholders.password}
                type="password"
              />
            </Col>
            <Col md={{ order: 1, span: 12 }} style={{ width: "100%" }}>
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
            <Col md={12} style={{ width: "100%" }}>
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
                    grecaptcha={global?.window?.grecaptcha}
                  />
                </div>
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
            data-testid="submitButton"
          >
            Register Now <ArrowRightOutlined />
          </Button>
        </Form.Item>

        <Form.Item>
          <SocialLoginButton isModal={isModal} />
        </Form.Item>
        <Form.Item noStyle>
          <Text className={styles.ft_link}>
            Already have an account?{" "}
            <a href="#" onClick={onLoginClick}>
              Login Here
            </a>
          </Text>
        </Form.Item>
      </Form>
    </section>
  );
}

export default RegistrationUi;
