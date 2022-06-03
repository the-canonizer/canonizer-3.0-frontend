import { Fragment } from "react";
import { Card, Form, Input, Button, Select, Row, Col, Typography } from "antd";

import styles from "../../CreateNewTopic/UI/createNewTopic.module.scss";
import messages from "../../../../messages";

const { Option } = Select;
const { Text } = Typography;

const {
  labels,
  placeholders,
  nickNmRule,
  summaryRule,
  campNameRule,
  campAboutUrlRule,
  parentCampRule,
} = messages;

const CreateCampFormUI = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  topicData,
  nickNameList,
  parentCamp,
  campNickName,
}) => {
  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head">
      Create Camp
    </span>
  );

  return (
    <Fragment>
      <Card title={CardTitle} className="can-card-style">
        <Form
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          name="create_new_camp"
          className={`${styles.createNewTopicForm}`}
          layout={"vertical"}
          scrollToFirstError
          validateTrigger={messages.formValidationTypes()}
          initialValues={{
            ...initialValue,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {nickNameList.length > 0 ? (
                <Form.Item
                  label={labels.cr_nick_name}
                  name="nick_name"
                  {...nickNmRule}
                  initialValue={nickNameList[0]?.id}
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
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                  ></Select>
                </Form.Item>
              ) : null}
            </Col>
            <Col xs={24} sm={12}>
              {parentCamp.length > 0 ? (
                <Form.Item
                  label={labels.cr_parent_camp}
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                >
                  <Select allowClear size={"large"} placeholder="Parent camp">
                    {parentCamp.map((camp) => (
                      <Option value={camp.camp_num} key={camp.id}>
                        {camp.camp_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
              {parentCamp.length <= 0 ? (
                <Form.Item
                  label={labels.cr_parent_camp}
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                >
                  <Select allowClear size={"large"} placeholder="Parent camp">
                    <Option value={topicData?.camp_num}>
                      {topicData?.camp_name}
                    </Option>
                  </Select>
                </Form.Item>
              ) : null}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Fragment>
                    {labels.cr_camp_name}
                    <span>(Limit 30 Chars)</span>
                  </Fragment>
                }
                name="camp_name"
                {...campNameRule}
              >
                <Input size={"large"} placeholder="Camp name" maxLength={30} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={labels.cr_keywords} name="key_words">
                <Input size={"large"} placeholder="Keywords" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={labels.cr_edit_summary}
                name="note"
                {...summaryRule}
              >
                <Input.TextArea
                  rows={6}
                  placeholder={placeholders.editSummary}
                />
              </Form.Item>
              <Form.Item noStyle>
                <Text className={styles.advanceuser}>
                  {labels.cr_keywords_sp}
                </Text>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <Fragment>
                    {labels.cr_camp_url}
                    <span>(Limit 1024 Chars)</span>
                  </Fragment>
                }
                name="camp_about_url"
                {...campAboutUrlRule}
              >
                <Input
                  placeholder={placeholders.campURL}
                  size={"large"}
                  maxLength={1024}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              {campNickName.length > 0 ? (
                <Form.Item
                  label={labels.cr_nick_name_about}
                  name="camp_about_nick_id"
                >
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                  >
                    <Option value="">{placeholders.campAboutNickName}</Option>
                    {campNickName.map((nc) => (
                      <Option value={nc.id} key={nc.id}>
                        {nc.nick_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  label={labels.cr_nick_name_about}
                  name="camp_about_nick_id"
                >
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                  >
                    <Option value="">{placeholders.campAboutNickName}</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>

          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              className={`${styles.submit_btn}`}
              data-testid="btn"
            >
              Create Camp
            </Button>

            <Button
              type="primary"
              htmlType="button"
              size={"large"}
              className={`${styles.cancel_btn}`}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Fragment>
  );
};

export default CreateCampFormUI;
