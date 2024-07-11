import { Fragment } from "react";
import { Card, Form, Input, Button, Select, Row, Col } from "antd";

import styles from "./Forum.module.scss";
import messages from "../../../../messages";

const { Option } = Select;

const { labels, placeholders, nickNmRule, threadTitleRule } = messages;

const CreateThreadForm = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  nickNameList,
  isThreadUpdate,
  isLoading,
}: any) => {
  const CardTitle = (
    <span className={styles.cardTitle}>
      {!isThreadUpdate ? `Create a new thread` : `Edit title of the thread`}
    </span>
  );

  return (
    <Fragment>
      <Card
        title={CardTitle}
        className="can-card-style"
        style={{ width: "100%" }}
      >
        <Form
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          name="create_new_thread"
          className={`${styles.createNewTopicForm}`}
          layout={"vertical"}
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          initialValues={{ ...initialValue }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                label={
                  <Fragment>
                    {labels.threadTitle}
                    <span>(Limit 100 Chars)</span>
                    <span className="required">*</span>
                  </Fragment>
                }
                name="thread_title"
                {...threadTitleRule}
              >
                <Input size={"large"} placeholder="Title" maxLength={100} />
              </Form.Item>

              {!isThreadUpdate ? (
                <Fragment>
                  {" "}
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
                        data-id="nick-names"
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
                        data-id="nick-names"
                        showSearch
                        optionFilterProp="children"
                      ></Select>
                    </Form.Item>
                  ) : null}
                </Fragment>
              ) : null}
            </Col>
          </Row>

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
        </Form>
      </Card>
    </Fragment>
  );
};

export default CreateThreadForm;
