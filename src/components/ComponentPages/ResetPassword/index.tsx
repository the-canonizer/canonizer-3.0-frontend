import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Button, Form, Input, Typography, message } from "antd";

import styles from "../Registration/UI/Registration.module.scss";

import messages from "../../../messages";
import { forgotPasswordUpdate } from "../../../network/api/userApi";
import SideBar from "../CampForum/UI/sidebar";

const { Title } = Typography;

const ResetPassword = ({ is_test = false }: any) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const backToLogin = async () => {
    if (localStorage.getItem("verified")) {
      await localStorage.removeItem("verified");
    }

    router?.push({ pathname: "/login" });
  };

  useEffect(() => {
    const getData = async () => {
      const verified = await localStorage.getItem("verified");

      if (!verified && !is_test) {
        backToLogin();
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    const email = await localStorage.getItem("verified");
    let body = {
      username: email?.trim(),
      new_password: values.password,
      confirm_password: values.confirm,
    };

    let res = await forgotPasswordUpdate(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      backToLogin();
    }
  };

  return (
    <div className={styles.wrapper}>
      <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
        <SideBar />
      </aside>
      <div className={`pageContentWrap ${styles.pageContentWrap}`}>
        <div className={`${styles.signup_wrapper} ${styles.resetPassword}`}>
          <Form
            form={form}
            name="setPassword"
            onFinish={onFinish}
            layout="vertical"
            scrollToFirstError
            validateTrigger={messages.formValidationTypes()}
          >
            <Title level={2} className={styles.titles} id="create-pass-title">
              {messages.labels.createPassword}
            </Title>
            <div className={styles.section_one}>
              <div className={styles.imageWrapper}>
                <Row gutter={20} align="top" className={styles.inputRows}>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="password"
                      label={
                        <Fragment>
                          {messages.labels.newPassword}
                          <span className="required">*</span>
                        </Fragment>
                      }
                      {...messages.passwordRule}
                    >
                      <Input.Password
                        className={styles.passwordInput}
                        type="password"
                        placeholder={messages.placeholders.newPassword}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="confirm"
                      label={
                        <Fragment>
                          {messages.labels.confirmPassword}
                          <span className="required">*</span>
                        </Fragment>
                      }
                      dependencies={["password"]}
                      {...messages.confirmPasswordRule}
                    >
                      <Input.Password
                        className={styles.passwordInput}
                        type="password"
                        placeholder={messages.placeholders.confirmPassword}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={24}>
                    <Form.Item noStyle>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className={styles["login-form-button"]}
                        block
                        data-testid="submitButton"
                        id="save-btn"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
