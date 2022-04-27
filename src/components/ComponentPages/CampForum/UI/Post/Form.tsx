import dynamic from "next/dynamic";
import { Fragment } from "react";
import { Form, Button, Select, Row, Col, Typography } from "antd";

import styles from "../Forum.module.scss";
import messages from "../../../../../messages";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const { Option } = Select;
const { Text } = Typography;

const { labels, placeholders, nickNmRule, validations } = messages;

const modules = {
  /*
   * Quill editor toolbars
   * See https://quilljs.com/docs/modules/toolbar/
   */
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const PostForm = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  nickNameList,
  postCount,
  quillContent = "",
  onContentChange,
  isError = false,
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
              <ReactQuill
                modules={modules}
                formats={formats}
                onChange={onContentChange}
                value={quillContent}
                theme="snow"
                placeholder="Post Your Message Here..."
              />
              {isError && <Text type="danger">{validations.reply}</Text>}
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
