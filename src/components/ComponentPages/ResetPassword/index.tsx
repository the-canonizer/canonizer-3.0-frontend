import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Row, Col, Button, Form, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import styles from "../Registration/UI/Registration.module.scss";

import messages from "../../../messages";
import { forgotPasswordUpdate } from "../../../network/api/userApi";
import { RootState } from "src/store";
import { setValue } from "src/store/slices/utilsSlice";

const { Title } = Typography;

const ResetPassword = () => {
  const emailId = useSelector((state: RootState) => state.utils.email_id);

  const [email, setEmail] = useState(emailId);

  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => setEmail(emailId), [emailId]);

  const onFinish = async (values: any) => {
    let body = {
      username: email?.trim(),
      new_password: values.password,
      confirm_password: values.confirm,
    };

    let res = await forgotPasswordUpdate(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      dispatch(setValue({ label: "email_id", value: "" }));
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
          <Button
            size="large"
            className={styles.createBtn}
            onClick={campRoute}
            id="create-topic-btn"
          >
            <i className="icon-topic"></i>Create New Topic
          </Button>
        </div>
        <aside className={styles.rightSidebar}>
          <Image
            src="/images/right-sidebar-adv.png"
            width={200}
            height={532}
            alt=""
            id="ad-img"
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
            <Title level={2} className={styles.titles} id="create-pass-title">
              Create new password
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
