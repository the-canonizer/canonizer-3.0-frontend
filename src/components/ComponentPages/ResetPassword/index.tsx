import { useRouter } from "next/router";
import Image from "next/image";
import { Row, Col, Button, Form, Input, Typography, message } from "antd";

import styles from "../Registration/UI/Registration.module.scss";

import messages from "../../../messages";
import { forgotPasswordUpdate } from "../../../network/api/userApi";

const { Title } = Typography;

const ResetPassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const email_id = localStorage.getItem("email_id");

    let body = {
      username: email_id?.trim(),
      new_password: values.password,
      confirm_password: values.confirm,
    };

    let res = await forgotPasswordUpdate(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      localStorage.removeItem("email_id");
    }

    router.push("/login");
  };

  const campRoute = () => {
    router.push("/create/topic");
  };

  return (
    <div className={styles.wrapper}>
      <aside className="leftSideBar miniSideBar">
        <div className={styles.wrap}>
          <Button size="large" className={styles.createBtn} onClick={campRoute}>
            <i className="icon-topic"></i>Create New Topic
          </Button>
        </div>
        <aside className={styles.rightSidebar}>
          <Image
            src="/images/right-sidebar-adv.png"
            width={200}
            height={532}
            alt=""
          />
        </aside>
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
            <Title level={2} className={styles.titles}>
              Create new password
            </Title>
            <div className={styles.section_one}>
              <div className={styles.imageWrapper}>
                <Row gutter={20} align="top" className={styles.inputRows}>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="password"
                      label={messages.labels.newPassword}
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
                      label={messages.labels.confirmPassword}
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
