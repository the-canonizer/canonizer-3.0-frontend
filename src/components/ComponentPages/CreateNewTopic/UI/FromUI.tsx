import { Fragment } from "react";
import { Card, Form, Input, Button, Select, Row, Col } from "antd";

import messages from "../../../../messages";
import styles from "./createNewTopic.module.scss";
import { changeSlashToArrow } from "src/utils/generalUtility";
import { useRouter } from "next/router";

const { Option } = Select;

const {
  labels,
  placeholders,
  nickNmRule,
  topicNameRule,
  namespaceRule,
  summaryRule,
} = messages;

const CreateTopicFromUI = ({
  onFinish,
  form,
  initialValue,
  nameSpaces,
  nickNameList,
  onCancel,
  existedTopic,
}: any) => {
  const router = useRouter();
  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head">
      Create Topic
    </span>
  );

  return (
    <Fragment>
      <Card title={CardTitle} className={`can-card-style ${styles.form_card}`}>
        <Form
          form={form}
          onFinish={onFinish}
          name="create_new_topic"
          className={`${styles.createNewTopicForm}`}
          layout={"vertical"}
          autoComplete="off"
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          initialValues={{
            ...initialValue,
            namespace: nameSpaces && nameSpaces[0]?.id,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {nickNameList.length ? (
                <Form.Item
                  label={
                    <>
                      {labels.cr_nick_name}
                      <span className="required">*</span>
                    </>
                  }
                  name="nick_name"
                  {...nickNmRule}
                  extra={labels.cr_nick_name_sp}
                  initialValue={nickNameList[0]?.id}
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                    defaultValue={nickNameList[0]?.id}
                    data-id="nick-name"
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

              <Form.Item
                label={
                  <Fragment>
                    {labels.cr_topic_name}
                    <span className="required">*</span>
                    <span>(Limit 30 Chars)</span>
                  </Fragment>
                }
                name="topic_name"
                {...topicNameRule}
              >
                <Input
                  placeholder={placeholders.topicName}
                  size={"large"}
                  maxLength={30}
                />
              </Form.Item>
              {existedTopic?.status && (
                <a
                  onClick={() => {
                    router.push(existedTopic?.data);
                  }}
                  className={styles.topicExistsMessage}
                >
                  Topic Already Exists
                </a>
              )}
              {nameSpaces ? (
                <Form.Item
                  label={
                    <Fragment>
                      {labels.cr_namespace}
                      <span className="required">*</span>
                      <span>
                        (General is recommended, unless you know otherwise)
                      </span>
                    </Fragment>
                  }
                  className={styles.namespaceInput}
                  name="namespace"
                  {...namespaceRule}
                >
                  <Select
                    placeholder={placeholders.namespace}
                    allowClear
                    size={"large"}
                    defaultValue={nameSpaces[0]?.id}
                    data-id="namespace"
                    showSearch
                    optionFilterProp="children"
                  >
                    {nameSpaces.map((name) => (
                      <Option key={name.id} value={name.id}>
                        {changeSlashToArrow(name.label)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                className={styles.edit_summary_input}
                label={
                  <Fragment>
                    {labels.cr_edit_summary}
                    <span>(Briefly describe your changes)</span>
                  </Fragment>
                }
                name="edit_summary"
                {...summaryRule}
              >
                <Input.TextArea
                  rows={5}
                  placeholder={placeholders.editSummary}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.btn_box}>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              className={`${styles.submit_btn}`}
              id="create-topic-btn"
              data-testid="create-topic-btn"
            >
              Create Topic
            </Button>

            <Button
              type="primary"
              htmlType="button"
              size={"large"}
              className={`${styles.cancel_btn}`}
              onClick={onCancel}
              id="cancel-btn"
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Fragment>
  );
};

export default CreateTopicFromUI;
