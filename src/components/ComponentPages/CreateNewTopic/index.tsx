import { Fragment, useState, useEffect } from "react";
import { Card, Form, Input, Button, Select, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, withRouter } from "next/router";

import messages from "../../../messages";
import SideBar from "../Home/SideBar";
import styles from "./createNewTopic.module.scss";

import { createTopic } from "../../../network/api/topicAPI";
import { getNickNameList } from "../../../network/api/userApi";
import { RootState } from "../../../store";
import { setCreatedTopic } from "../../../store/slices/topicSlice";

const { Option } = Select;

const {
  labels,
  placeholders,
  nickNmRule,
  topicNameRule,
  namespaceRule,
  summaryRule,
} = messages;

const CreateNewTopic = ({}) => {
  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});

  const nameSpaces = useSelector(
    (state: RootState) => state.homePage.nameSpaces
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const CardTitle = (
    <span className={styles.cardTitle} data-testid="head">
      Create New Topic
    </span>
  );

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
    }
  };

  useEffect(() => {
    fetchNickNameList();
  }, []);

  const onFinish = async (values: any) => {
    const body = {
      topic_name: values.topic_name,
      namespace: values.namespace,
      nick_name: values.nick_name,
      note: values.edit_summary,
    };

    const res = await createTopic(body);

    if (res && res.status_code === 200) {
      dispatch(setCreatedTopic({ message: res.message, ...res.data }));
      router.push(`/topic-history/${res.data.topic_num}`);
    }
  };

  const onCancel = () => {
    router.push("/");
  };

  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <Card title={CardTitle} className="can-card-style">
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
                    label={labels.cr_nick_name}
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
                    >
                      {nickNameList.map((nick, idx) => (
                        <Option key={nick.id} value={nick.id}>
                          {nick.nick_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null}

                <Form.Item
                  label={labels.cr_topic_name}
                  name="topic_name"
                  {...topicNameRule}
                >
                  <Input placeholder={placeholders.topicName} size={"large"} />
                </Form.Item>
                {nameSpaces ? (
                  <Form.Item
                    label={labels.cr_namespace}
                    className={styles.namespaceInput}
                    name="namespace"
                    {...namespaceRule}
                  >
                    <Select
                      placeholder={placeholders.namespace}
                      allowClear
                      size={"large"}
                      defaultValue={nameSpaces[0]?.id}
                    >
                      {nameSpaces.map((name, idx) => (
                        <Option key={name.id} value={name.id}>
                          {name.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null}
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={labels.cr_edit_summary}
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

            <Form.Item noStyle>
              <Button
                type="primary"
                htmlType="submit"
                size={"large"}
                className={`${styles.submit_btn}`}
              >
                Create Topic
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
    </Fragment>
  );
};

export default withRouter(CreateNewTopic);
