import { Fragment } from "react";
import { Card, Form, Input, Button, Select, Row, Col, Typography } from "antd";

import styles from "../../CreateNewTopic/UI/createNewTopic.module.scss";
import messages from "../../../../messages";
import PreventSubCamps from "../../../common/preventSubCampCheckbox";

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
  keywordsRule,
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
  options,
  onCheckboxChange,
  onParentCampChange,
}) => {
  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head" id="card-title">
      Create New Camp
    </span>
  );

  return (
    <Fragment>
      <Card
        title={CardTitle}
        className="can-card-style"
        extra={
          <PreventSubCamps
            options={options}
            onCheckboxChange={onCheckboxChange}
          />
        }
      >
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
              {nickNameList?.length > 0 ? (
                <Form.Item
                  label={
                    <>
                      {labels.cr_nick_name}
                      <span className="required">*</span>
                    </>
                  }
                  name="nick_name"
                  {...nickNmRule}
                  initialValue={nickNameList[0]?.id}
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                    data-id="nick-name"
                  >
                    {nickNameList.map((nick) => (
                      <Option key={nick.id} value={nick.id}>
                        {nick.nick_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
              {nickNameList?.length <= 0 ? (
                <Form.Item
                  label={labels.cr_nick_name}
                  name="nick_name"
                  {...nickNmRule}
                >
                  <Select
                    placeholder={placeholders.nickName}
                    allowClear
                    size={"large"}
                    data-id="nick-name"
                  ></Select>
                </Form.Item>
              ) : null}
            </Col>
            <Col xs={24} sm={12}>
              {parentCamp?.length > 0 ? (
                <Form.Item
                  label={
                    <>
                      {labels.cr_parent_camp}
                      <span className="required">*</span>
                    </>
                  }
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                >
                  <Select
                    allowClear
                    size={"large"}
                    placeholder="Parent camp"
                    data-id="parent-camp"
                    onChange={onParentCampChange}
                  >
                    {parentCamp.map((camp) => (
                      <Option
                        value={camp.camp_num}
                        key={camp.id}
                        id={camp.id}
                        camp={camp}
                        // disabled={disableInput(camp)}
                      >
                        {camp.camp_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null}
              {parentCamp?.length <= 0 ? (
                <Form.Item
                  label={labels.cr_parent_camp}
                  name="parent_camp_num"
                  {...parentCampRule}
                  initialValue={topicData?.camp_num}
                >
                  <Select
                    allowClear
                    size={"large"}
                    placeholder="Parent camp"
                    data-id="parent-camp"
                  >
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
                    <span className="required">*</span>
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
              <Form.Item
                label={labels.cr_keywords}
                name="key_words"
                {...keywordsRule}
              >
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
              {campNickName?.length > 0 ? (
                <Form.Item
                  label={labels.cr_nick_name_about}
                  name="camp_about_nick_id"
                >
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                    data-id="camp-about-nick-id"
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
                    data-id="camp-about-nick-id"
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
              id="crate-camp-btn"
            >
              Create Camp
            </Button>

            <Button
              type="primary"
              htmlType="button"
              size={"large"}
              className={`${styles.cancel_btn}`}
              onClick={onCancel}
              id="cancel-btn"
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
