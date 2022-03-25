import { Fragment, useState, useEffect } from "react";
import { Card, Form, Input, Button, Select, Row, Col, Typography } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import SideBar from "../Home/SideBar";
import styles from "../CreateNewTopic/createNewTopic.module.scss";
import messages from "../../../messages";

import { getNickNameList } from "../../../network/api/userApi";
import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
} from "../../../network/api/campDetailApi";
import { RootState } from "../../../store";
import {
  setCurrentTopic,
  resetCurrentTopic,
} from "../../../store/slices/topicSlice";

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

const CreateNewCamp = ({
  nickNames = [],
  parentCamps = [],
  campNickNames = [],
  initialValues = {},
}) => {
  const [nickNameList, setNickNameList] = useState(nickNames);
  const [initialValue, setInitialValues] = useState(initialValues);
  const [parentCamp, setParentCamps] = useState(parentCamps);
  const [campNickName, setCampNickName] = useState(campNickNames);

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const topicData = useSelector((state: RootState) => state.topic.currentTopic);

  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head">
      Create Camp
    </span>
  );

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };

  useEffect(() => {
    fetchNickNameList();
    fetchCampNickNameList();
  }, []);

  const fetchParentsCampList = async () => {
    const body = {
      topic_num: topicData?.topic_num || "",
    };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };

  useEffect(() => {
    fetchParentsCampList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    const body = {
      camp_about_nick_id: values.camp_about_nick_id || "",
      camp_about_url: values.camp_about_url || "",
      camp_name: values.camp_name,
      key_words: values.key_words || "",
      note: values.note || "",
      parent_camp_num: values.parent_camp_num,
      nick_name: values.nick_name,
      topic_num: topicData?.topic_num,
    };

    const res = await createCamp(body);
    if (res && res.status_code === 200) {
      dispatch(setCurrentTopic({ message: res.message, ...res.data }));
      dispatch(resetCurrentTopic());
      router.push(`/camp-history/${topicData?.topic_num}/${res.data.camp_num}`);
    }
  };

  const onCancel = () => {
    router.push("/");
  };

  return (
    <Fragment>
      <div className={`${styles.upperTitle}`}>
        <p>
          <strong>Topic:</strong> {topicData?.topic_name}
        </p>
        <p>
          <strong>Camp:</strong> {topicData?.camp_name || "Agreement"}
        </p>
      </div>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
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
              initialValues={{ ...initialValue }}
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
                      initialValue={topicData?.parent_camp_num || 1}
                    >
                      <Select
                        allowClear
                        size={"large"}
                        placeholder="Parent camp"
                      >
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
                    >
                      <Select
                        allowClear
                        size={"large"}
                        placeholder="Parent camp"
                      ></Select>
                    </Form.Item>
                  ) : null}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={labels.cr_camp_name}
                    name="camp_name"
                    {...campNameRule}
                  >
                    <Input size={"large"} placeholder="Camp name" />
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
                    label={labels.cr_camp_url}
                    name="camp_about_url"
                    {...campAboutUrlRule}
                  >
                    <Input placeholder={placeholders.campURL} size={"large"} />
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
                        <Option value="">
                          {placeholders.campAboutNickName}
                        </Option>
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
                        <Option value="">
                          {placeholders.campAboutNickName}
                        </Option>
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
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCamp;
