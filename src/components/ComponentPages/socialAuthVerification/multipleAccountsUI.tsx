import { Button, Modal, Typography, Form, Radio, Space } from "antd";
import { Fragment } from "react";

import styles from "./Social.module.scss";

import messages from "../../../messages";

const { labels } = messages;

const MultiUserModalForm = ({ visible, onFinish, closeModal, users }) => {
  const [form] = Form.useForm();
  return (
    <Fragment>
      <Modal
        style={{ top: "20px" }}
        visible={visible}
        footer={
          <div className={styles.buttonDiv}>
            <Button
              htmlType="button"
              className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
              type="primary"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinish(values, form);
                  })
                  .catch(() => {});
              }}
            >
              Submit
            </Button>
            <Button
              htmlType="button"
              className={`ant-btn ant-btn-lg ${styles.cancel_btn}`}
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>
        }
        closable={false}
        title="Multiple User Warning"
        className={styles.modal}
      >
        <Form
          form={form}
          name="multiple_user"
          layout="vertical"
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          autoComplete="off"
          initialValues={{ selected_user: null }}
        >
          <Form.Item>
            <Typography.Text>
              It seems that there is already a user linked with this email in
              canonizer. If that user belongs to you than it is a violation of
              canonizer&rsquo;s agreement. So we suggest you to deactivate your
              another account and keep only single master account active. If you
              donot want to deactivate than click on cancel and try linking with
              other email for this social account.If you wish to deactivate than
              select the account below and click submit
            </Typography.Text>
          </Form.Item>
          <Form.Item
            name="selected_user"
            rules={[{ required: true, message: "Please select user!" }]}
          >
            <Radio.Group
              onChange={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinish.bind(this, values, form);
                  })
                  .catch(() => {});
              }}
            >
              <Space direction="vertical">
                {users.map((user) => (
                  <Radio value={user.user_id} key={user.id}>
                    {user.social_name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Typography.Text>
              Note: If you select the current user then you will be logged out
              of the canonizer
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default MultiUserModalForm;
