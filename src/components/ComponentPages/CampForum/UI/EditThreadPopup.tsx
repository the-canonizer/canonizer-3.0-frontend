import { useState, useEffect } from "react";
import { Input, Button, Modal, Form, Row, Col } from "antd";

import styles from "./Forum.module.scss";

import useAuthentication from "src/hooks/isUserAuthenticated";

const ThreadPopup = ({
  isModalOpen = false,
  showModal,
  onFinish,
  onCancelThreadUpdateForm,
  form,
}) => {
  const [isLog, setIsLog] = useState(false);
  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    setIsLog(isUserAuthenticated);
  }, [isUserAuthenticated]);

  return (
    <Modal
      title="Edit title of the thread"
      open={isModalOpen}
      onCancel={() => showModal()}
      className={styles.postFormModal}
      footer={null}
    >
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        name="new_post"
        className={`${styles.postForm}`}
        layout={"vertical"}
      >
        <Row gutter={16}>
          {isLog ? (
            <Col xs={24} sm={24}>
              <Form.Item name="threadName" className={styles.editorQuill}>
                <Input />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        {isLog ? (
          <div className={styles.saveBtns}>
            <Form.Item noStyle>
              <Button
                type="primary"
                htmlType="submit"
                size={"large"}
                className={`${styles.submit_btn}`}
                id="submit-btn"
                data-testid="submit-btn"
              >
                Submit
              </Button>
              <Button
                type="primary"
                htmlType="button"
                size={"large"}
                className={`${styles.cancel_btn}`}
                onClick={onCancelThreadUpdateForm}
                id="back-btn"
                data-testid="back-btn"
              >
                Cancel
              </Button>
            </Form.Item>
          </div>
        ) : null}
      </Form>
    </Modal>
  );
};

export default ThreadPopup;
