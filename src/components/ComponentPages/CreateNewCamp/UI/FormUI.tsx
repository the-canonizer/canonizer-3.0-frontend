import { Fragment, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Typography,
  Tooltip,
} from "antd";

import styles from "../../CreateNewTopic/UI/createNewTopic.module.scss";
import messages from "../../../../messages";
import PreventSubCamps from "../../../common/preventSubCampCheckbox";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";

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
  isLoading,
}: any) => {
  const router = useRouter();
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head" id="card-title">
      Create New Camp
    </span>
  );
  // const toolTipContent = "This camp is under review";
  const archiveToolTipContent = "This camp is archived";
  useEffect(() => {
    campRecord?.is_archive && router.pathname == "/camp/create/[...camp]"
      ? router?.back()
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Card
        title={CardTitle}
        className={`can-card-style ${styles.form_card}`}
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
                    showSearch
                    optionFilterProp="children"
                    id="nickname-dropdown"
                  >
                    {nickNameList.map((nick, idx) => (
                      <Option
                        key={nick.id}
                        value={nick.id}
                        id={`nick-name-${idx}`}
                      >
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
                    showSearch
                    optionFilterProp="children"
                    id="nickname-dropdown"
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
                    showSearch
                    size={"large"}
                    placeholder="Parent camp"
                    data-id="parent-camp"
                    onChange={onParentCampChange}
                    optionFilterProp="children"
                    id="parent-camp-dropdown"
                    filterOption={(input, option) =>
                      ((option?.children as any)?.props?.children ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {parentCamp.map((camp) => (
                      <Option
                        value={camp.camp_num}
                        key={camp.id}
                        id={`parent-camp-${camp.id}`}
                        camp={camp}
                        disabled={camp.is_archive ? true : false}
                      >
                        <Tooltip
                          title={camp.is_archive ? archiveToolTipContent : null}
                        >
                          {camp.camp_name}
                        </Tooltip>
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
                    showSearch
                    optionFilterProp="children"
                    id="parent-camp-dropdown"
                  >
                    <Option
                      value={topicData?.camp_num}
                      id={`parent-camp-${topicData?.camp_num}`}
                    >
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
                className={styles.edit_summary_input}
                label={
                  <Fragment>
                    {labels.cr_edit_summary}
                    <span>{labels.brief}</span>
                  </Fragment>
                }
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
                    showSearch
                    optionFilterProp="children"
                    id="camp-about-nick-dropdown"
                  >
                    <Option value="" id="camp-about-nick-custom">
                      {placeholders.campAboutNickName}
                    </Option>
                    {campNickName.map((nc) => (
                      <Option
                        value={nc.id}
                        key={nc.id}
                        id={`camp-about-nick-${nc.id}`}
                      >
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
                    showSearch
                    optionFilterProp="children"
                    id="camp-about-nick-dropdown"
                  >
                    <Option value="" id="camp-about-nick-custom">
                      {placeholders.campAboutNickName}
                    </Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>

          <div className={styles.btn_box}>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              className={`${styles.submit_btn}`}
              data-testid="btn"
              id="crate-camp-btn"
              disabled={isLoading}
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

export default CreateCampFormUI;
