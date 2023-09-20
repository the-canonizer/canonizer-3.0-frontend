import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Typography,
  Form,
  Button,
  Checkbox,
  Image,
  Space,
  Input,
} from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "./Login.module.scss";

import messages from "../../../../messages";
import SocialLoginButton from "../../../common/socialLogin";
import FormItem from "../../../common/formElements";

const { Title, Paragraph, Text } = Typography;

const LoginUi = ({
  form,
  onFinish,
  closeModal,
  isModal,
  openForgotPasswordModal,
  // openRegistration,
  onOTPClick,
  errorMsg,
  rememberValue,
}: any) => {
  const router = useRouter();

  useEffect(() => {
    if (rememberValue) {
      form.setFieldsValue({ username: rememberValue.username });
      form.setFieldsValue({ password: rememberValue.password });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rememberValue]);

  const onForgotPasswordClick = (e) => {
    e.preventDefault();
    if (isModal) {
      closeModal();
      openForgotPasswordModal();
    } else {
      router?.push("/forgot-password");
    }
  };

  const onRegister = (e) => {
    e.preventDefault();
    if (isModal) {
      closeModal();
      router?.push("/registration");
      // openRegistration();
    } else {
      router?.push("/registration");
    }
  };

  return (
    <section className={styles.login_wrapper}>
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
      <Row>
        <Col md={12}>
          <div className={styles.form_section}>
            <Title level={2} className={styles.titles} id="login-title">
              Login To Canonizer
            </Title>
            {errorMsg && (
              <Text
                className={`${styles.errorMsgs}`}
                type="danger"
                id="login-error-label"
              >
                {errorMsg}
              </Text>
            )}
            <Form
              form={form}
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              scrollToFirstError
              validateTrigger={messages.formValidationTypes()}
            >
              <FormItem
                name="username"
                label={
                  <>
                    {messages.labels.emailPhone}{" "}
                    <span className="required">*</span>
                  </>
                }
                rules={messages.usernameRule}
                placeholder={messages.placeholders.emailPhone}
                dataid="username"
                onKeyDown={() => {}}
              />

              <Form.Item
                name="password"
                label={
                  <>
                    {messages.labels.password}
                    <span className="required">*</span>
                  </>
                }
                {...messages.userPassRule}
              >
                <Input.Password
                  className={styles.passwordInput}
                  type="password"
                  placeholder={messages.placeholders.password}
                />
              </Form.Item>
              <Form.Item className={styles.remember}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember Me</Checkbox>
                </Form.Item>
                <Link href="/">
                  <a
                    id="forgot-password-link"
                    data-testid="forgot-password-link"
                    className={styles["login-form-forgot"]}
                    onClick={onForgotPasswordClick}
                  >
                    Forgot Password
                  </a>
                </Link>
              </Form.Item>

              <Form.Item>
                <Button
                  data-testid="submitButton"
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  block
                  id="login-btn"
                >
                  Log In <ArrowRightOutlined />
                </Button>
                <Space className={styles.space}>Or</Space>
                <Button
                  type="primary"
                  htmlType="button"
                  className="login-form-button"
                  block
                  onClick={onOTPClick}
                  id="request-otp-btn"
                  data-testid="request-otp-btn"
                >
                  Request One Time Verification Code
                </Button>
              </Form.Item>

              <Form.Item style={{ marginBottom: "15px" }}>
                <SocialLoginButton />
              </Form.Item>
              <Form.Item noStyle>
                <Text className={styles.ft_link} id="dont-account-link">
                  {`Don't have an account? `}
                  <a
                    onClick={onRegister}
                    style={{ fontWeight: "bold" }}
                    id="dont-account-link-tag"
                    data-testid="dont-account-link-tag"
                  >
                    {" "}
                    Register Now
                  </a>
                </Text>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col md={12}>
          <div className={styles.img_section}>
            <Paragraph className={styles.imgText} id="login-right-text">
              Enter to the best leaderless consensus building and tracking
              system in the world.
            </Paragraph>
            <Image
              width={300}
              alt="login-illustration"
              title=""
              preview={false}
              className={styles.bImg}
              src="/images/login-illustration.png"
              id="login-page-img"
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default LoginUi;
