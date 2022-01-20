import { Form, Input, Button, Tabs, Row, Col } from "antd";
import styles from "./ChangePassword.module.scss";
import messages from "../../../../messages";

export default function ChangePasswordUI({onFinish,onFinishFailed}) {
 
 
  return (
    <>
      <section className={styles.signup_wrapper}>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className={styles.section_one}>
            <Row gutter={30}>
              <Col md={8}>
                <Form.Item
                  name="currentPassword"
                  label={messages.labels.currentPassword}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter current password!',
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder={messages.placeholders.currentPassword}
                  />
                </Form.Item>
              </Col>
              <Col md={8}> <Form.Item
                name="password"
                label={messages.labels.newPassword}
                rules={[
                  {
                    required: true,
                    message: 'Please enter new password!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  type="password"
                  placeholder={messages.placeholders.newPassword}
                />
              </Form.Item></Col>
              <Col md={8}>  <Form.Item
                name="confirm"
                label={messages.labels.confirmPassword}
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input
                  type="password"
                  placeholder={messages.placeholders.confirmPassword}
                />
              </Form.Item></Col>
            </Row>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
}
