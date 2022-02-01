import React, { useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  Image,
  Space,
} from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "./Login.module.scss";

import messages from "../../../../messages";
import SocialLoginButton from "../../../common/social-login/social-login";

const { Title, Paragraph, Text } = Typography;

interface FieldData {
  username: string | number | (string | number)[];
  password: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const LoginUi = ({ form, onFinish, closeModal, isModal }) => {
  useEffect(() => {
    const userValue = JSON.parse(localStorage.getItem("rememberme"));
    if (userValue) {
      form.setFieldsValue({ username: userValue.username });
      form.setFieldsValue({ password: userValue.password });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.login_wrapper}>
      <Row>
        <Col md={12}>
          <div className={styles.form_section}>
            <Title level={2} className={styles.titles}>
              Login to Canonizer
            </Title>
            <Form
              form={form}
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              scrollToFirstError
            >
              <Form.Item
                name="username"
                label={messages.labels.emailPhone}
                {...messages.usernameRule}
              >
                <Input placeholder={messages.placeholders.emailPhone} />
              </Form.Item>
              <Form.Item
                name="password"
                label={messages.labels.password}
                {...messages.userPassRule}
              >
                <Input
                  type="password"
                  placeholder={messages.placeholders.password}
                />
              </Form.Item>
              <Form.Item className={styles.remember}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className={styles["login-form-forgot"]} href="">
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  block
                >
                  Log in <ArrowRightOutlined />
                </Button>
                <Space className={styles.space}>Or</Space>
                <Button
                  type="primary"
                  htmlType="button"
                  className="login-form-button"
                  block
                >
                  Request One Time Verification Code
                </Button>
              </Form.Item>

              <Form.Item>
                <SocialLoginButton isModal={isModal} />
              </Form.Item>
              <Form.Item noStyle>
                <Text className={styles.ft_link}>
                  Don't have an account?{" "}
                  <Link href="/registration">Register Now</Link>
                </Text>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col md={12}>
          <div className={styles.img_section}>
            {isModal && (
              <Button
                shape="circle"
                type="link"
                className={styles.close_btn}
                onClick={closeModal}
                icon={<CloseCircleOutlined />}
              />
            )}
            <Paragraph className={styles.imgText}>
              Enter to the best leaderless consensus building and tracking
              system in the world.
            </Paragraph>
            <Image
              width={300}
              alt=""
              title=""
              preview={false}
              className={styles.bImg}
              src="/images/login-illustration.png"
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default LoginUi;
