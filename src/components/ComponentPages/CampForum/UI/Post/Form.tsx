import { Fragment } from "react";
import { Form, Button, Select, Row, Col, Typography } from "antd";

import styles from "../Forum.module.scss";
import messages from "../../../../../messages";
import QuillEditor from "../../../../common/editor";

const { Option } = Select;
const { Text } = Typography;

const { labels, placeholders, nickNmRule } = messages;

const PostForm = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  nickNameList,
  postCount,
}) => {
  return (
    <Fragment>
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        name="new_post"
        className={`${styles.postForm}`}
        layout={"vertical"}
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{ ...initialValue }}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Text style={{ marginBottom: "10px", display: "block" }}>
              Number of Post in this thread: {postCount}
            </Text>
            <div className={styles.editorQuill}>
              <QuillEditor />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            {nickNameList.length > 0 ? (
              <Form.Item
                label={labels.cr_nick_name}
                name="nick_name"
                {...nickNmRule}
                initialValue={nickNameList[0]?.id}
                extra={labels.cr_nick_name_sp}
                className="nick_name_extra"
              >
                <Select
                  placeholder={placeholders.nickName}
                  allowClear
                  size={"large"}
                >
                  {nickNameList.map((nick) => (
                    <Option key={nick.id} value={nick.id}>
                      {nick.nick_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null}
            {nickNameList.length <= 0 ? (
              <Form.Item
                label={labels.cr_nick_name}
                name="nick_name"
                {...nickNmRule}
                extra={labels.cr_nick_name_sp}
                className="nick_name_extra"
              >
                <Select
                  placeholder={placeholders.nickName}
                  allowClear
                  size={"large"}
                ></Select>
              </Form.Item>
            ) : null}
          </Col>
        </Row>

        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            size={"large"}
            className={`${styles.submit_btn}`}
          >
            Submit
          </Button>

          <Button
            type="primary"
            htmlType="button"
            size={"large"}
            className={`${styles.cancel_btn}`}
            onClick={onCancel}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default PostForm;
