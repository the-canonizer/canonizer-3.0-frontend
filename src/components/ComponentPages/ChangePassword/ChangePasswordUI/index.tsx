import { Form, Input, Button, Tabs, Row, Col } from "antd";
import styles from "./ChangePassword.module.scss";
import messages from "../../../../messages";

export default function ChangePasswordUI({ form, onFinish, onFinishFailed }) {
  return (
    <>
      <section className={styles.change_password}>
        <Form
          form={form}
          name="changePassword"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="p-0"
        >
          <div className={styles.section_one}>
            <Row gutter={30}>
              <Col md={8}>
                <Form.Item
                  name="current_password"
                  label={messages.labels.currentPassword}
                  {...messages.currentPasswordRule}
                >
                  <Input
                    type="password"
                    placeholder={messages.placeholders.currentPassword}
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item
                  name="new_password"
                  label={messages.labels.newPassword}
                  {...messages.newPasswordRule}
                  hasFeedback
                >
                  <Input
                    type="password"
                    placeholder={messages.placeholders.newPassword}
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                {" "}
                <Form.Item
                  name="confirm_password"
                  label={messages.labels.confirmPassword}
                  dependencies={["new_password"]}
                  hasFeedback
                  {...messages.confirmNewPasswordRule}
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
            <Button type="primary" htmlType="submit"  data-testid="submitButton">
              Save
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
}
