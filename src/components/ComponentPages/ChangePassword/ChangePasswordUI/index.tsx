import { Form, Input, Button, Tabs, Row, Col } from "antd";
import styles from "./ChangePassword.module.scss";
import messages from "../../../../messages";
import { useState } from "react";

export default function ChangePasswordUI({
  form,
  onFinish,
  onFinishFailed,
  incorrectPasswordData,
  setIncorrectPasswordData,
}) {
  const [currentPassWord, setCurrentPassWord] = useState("");
  const validateFun = {
    validateStatus: "error" as any,
    help: incorrectPasswordData as any,
  };
  const onChangeFun = (value) => {
    setCurrentPassWord(value);
    setIncorrectPasswordData("");
  };
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
                  {...(currentPassWord !== ""
                    ? incorrectPasswordData
                      ? validateFun
                      : ""
                    : "")}
                >
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder={messages.placeholders.currentPassword}
                    onChange={(e) => onChangeFun(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
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
                    id="newPassword"
                    className={styles.Password_input}
                    type="password"
                    placeholder={messages.placeholders.newPassword}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
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
                    id="confirmPassword"
                    className={styles.Password_input}
                    type="password"
                    placeholder={messages.placeholders.confirmPassword}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Form.Item>
            <Button
              id="saveBtn"
              type="primary"
              htmlType="submit"
              data-testid="submitButton"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
}
