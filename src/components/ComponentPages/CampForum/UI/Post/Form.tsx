import dynamic from "next/dynamic";
import { Fragment } from "react";
import { Form, Button, Select, Row, Col, Typography } from "antd";
import { useDispatch } from "react-redux";

import styles from "../Forum.module.scss";
import messages from "../../../../../messages";
import { showLoginModal } from "../../../../../store/slices/uiSlice";

import CustomSkelton from "../../../../common/customSkelton";

const Editorckl = dynamic(
  () => import("src/components/common/editorck/index"),
  {
    ssr: false,
  }
);

const { Option } = Select;
const { Text } = Typography;

const { labels, placeholders, nickNmRule, validations } = messages;

const formats = [
  "heading",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "|",
  "numberedList",
  "bulletedList",
  "alignment",
  "|",
  "fontSize",
  "fontColor",
  "fontBackgroundColor",
  "highlight",
  "fontFamily",
  "|",
  "indent",
  "outdent",
  "|",
  "link",
  "autolink",
  "blockQuote",
  "|",
  "findAndReplace",
  "|",
  "undo",
  "redo",
];

const PostForm = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  nickNameList,
  postCount,
  quillContent,
  onContentChange,
  isError = false,
  isLog,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const openModal = () => dispatch(showLoginModal());

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
            <Text
              style={{ marginBottom: "10px", display: "block" }}
              id="post-count-label"
            >
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass=""
                  listStyle="countLi"
                  isButton={false}
                />
              ) : (
                `Number of Post in this thread: ${postCount}`
              )}
            </Text>
            {!isLog && (
              <Text id="sign-in-msg" data-testid="logincheck">
                Please <a onClick={openModal}>Sign In</a> to comment on this
                Thread
              </Text>
            )}
            {isLog ? (
              <div className={styles.editorQuill}>
                <Editorckl
                  editorState={quillContent}
                  oneditorchange={onContentChange}
                  placeholder="Post Your Message Here..."
                  items={formats}
                  height={200}
                ></Editorckl>
                {isError && <Text type="danger">{validations.reply}</Text>}
              </div>
            ) : null}
          </Col>
          {isLog ? (
            <Col xs={24} sm={12}>
              {nickNameList.length > 0 ? (
                <Form.Item
                  label={
                    <Fragment>
                      {labels.cr_nick_name}
                      <span className="required">*</span>
                    </Fragment>
                  }
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
                    data-id="nick-name-label"
                    showSearch
                    optionFilterProp="children"
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
                  label={
                    <Fragment>
                      {labels.cr_nick_name}
                      <span className="required">*</span>
                    </Fragment>
                  }
                  name="nick_name"
                  {...nickNmRule}
                  extra={labels.cr_nick_name_sp}
                  className="nick_name_extra"
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                    data-id="nick-name-label"
                    showSearch
                    optionFilterProp="children"
                  ></Select>
                </Form.Item>
              ) : null}
            </Col>
          ) : null}
        </Row>

        {isLog ? (
          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              className={`${styles.submit_btn}`}
              id="submit-btn"
            >
              Submit
            </Button>

            <Button
              type="primary"
              htmlType="button"
              size={"large"}
              className={`${styles.cancel_btn}`}
              onClick={onCancel}
              id="back-btn"
            >
              Back
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    </Fragment>
  );
};

export default PostForm;
