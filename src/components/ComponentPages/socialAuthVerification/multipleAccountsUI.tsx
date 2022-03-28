import { Button, Modal, Typography, Form, Radio } from "antd";
import { Fragment } from "react";

import styles from "./Social.module.scss";

import messages from "../../../messages";

const { labels } = messages;

const MultiUserModalForm = ({
  visible,
  onFinish,
  closeModal,
  users,
  modalForm,
}) => (
  <Fragment>
    <Modal
      style={{ top: "20px" }}
      visible={visible}
      footer={null}
      closable={false}
      title="Multiple User Warning"
      className={styles.modal}
    >
      <Form
        form={modalForm}
        name="multiple_user"
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        autoComplete="off"
        initialValues={{ selected_user: 0 }}
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
          label={labels.multiUser}
          rules={[{ required: true, message: "Please pick an item!" }]}
        >
          <Radio.Group>
            {users.map((user) => (
              <Radio.Button value={user.id} key={user.id}>
                {user.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Typography.Text>
            Note: If you select the current user then you will be logged out of
            the canonizer
          </Typography.Text>
        </Form.Item>
        <div className={styles.buttonDiv}>
          <Button
            htmlType="submit"
            className={`ant-btn ant-btn-orange ant-btn-lg ${styles.submitBtn}`}
            type="primary"
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
      </Form>
    </Modal>
  </Fragment>
);
export default MultiUserModalForm;
