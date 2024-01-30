import dynamic from "next/dynamic";
import { Fragment } from "react";
import { Form, Button, Select, Row, Col, Typography, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";

import styles from "../Forum.module.scss";

import messages from "src/messages";
import { showLoginModal } from "src/store/slices/uiSlice";
import CustomSkelton from "src/components/common/customSkelton";
import { RootState } from "src/store";
const Editorckl = dynamic(
  () => import("src/components/common/editorck/index"),
  { ssr: false }
);

const { Option } = Select,
  { Text } = Typography,
  { labels, placeholders, nickNmRule, validations } = messages,
  formats = [
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
  isModalOpen = false,
  showModal,
}: any) => {
  const { currentPost } = useSelector((state: RootState) => ({
    currentPost: state.forum.currentPost,
  }));

  const dispatch = useDispatch();
  const openModal = () => dispatch(showLoginModal());

  return (
    <Fragment>
      <Row gutter={16}>
        <Col xs={24} md={12}>
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
        </Col>
        <Col xs={24} md={12} className={styles.btnText}>
          {!isLog ? (
            <Text id="sign-in-msg" data-testid="logincheck">
              Please <a onClick={openModal}>Sign In</a> to comment on this
              Thread
            </Text>
          ) : (
            <Button type="primary" onClick={showModal}>
              Create Post
            </Button>
          )}
        </Col>
      </Row>
      <Modal
        title={
          currentPost && Object.keys(currentPost)?.length
            ? "Edit Post"
            : "Create Post"
        }
        open={isModalOpen}
        onOk={showModal}
        onCancel={showModal}
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
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          initialValues={{ ...initialValue }}
        >
          <Row gutter={16}>
            <Col xs={24}>
              {isLog ? (
                <div className={styles.editorQuill} key="post_editor_div">
                  <Editorckl
                    key="post_editor"
                    editorState={quillContent || ""}
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
              <Col xs={24} sm={18}>
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
            <div className={styles.saveBtns}>
              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  size={"large"}
                  className={`${styles.submit_btn}`}
                  id="submit-btn"
                  data-testid="submit-btn"
                  disabled={isLoading}
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
                  data-testid="back-btn"
                >
                  Cancel
                </Button>
              </Form.Item>
            </div>
          ) : null}
        </Form>
      </Modal>
    </Fragment>
  );
};

export default PostForm;
