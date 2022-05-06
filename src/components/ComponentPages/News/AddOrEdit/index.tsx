import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Spin,
  Typography,
  Input,
  Select,
} from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import styles from "../addEditNews.module.scss";
import {
  addNewsFeedApi,
  getEditCampNewsFeedApi,
  updateNewsFeedApi,
} from "../../../../network/api/campNewsApi";
import { getNickNameList } from "../../../../network/api/userApi";

const antIcon = <LoadingOutlined spin />;
const { Text } = Typography;

export default function AddOrEdit({ edit }) {
  const [loading, setLoading] = useState(false);
  const [urlErrorMsg, setUrlErrorMsg] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [nickNameData, setNickNameData] = useState([]);
  const [dataToUpdate, setDataToUpdate] = useState({
    id: null,
    submitter_nick_id: null,
  });
  const router = useRouter();
  const [form] = Form.useForm();

  const goBack = () => {
    setLoading(true);
    router.back();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    let res;
    edit
      ? (res = await updateNewsFeedApi({
          newsfeed_id: dataToUpdate?.id,
          display_text: values.display_text,
          link: values.link,
          available_for_child: values.available_for_child,
          submitter_nick_id: dataToUpdate?.submitter_nick_id,
        }))
      : (res = await addNewsFeedApi({
          topic_num: +router.query?.camp[0]?.split("-")[0],
          camp_num: +router.query?.camp[1]?.split("-")[0],
          available_for_child: values?.available_for_child,
          link: values?.link,
          display_text: values?.display_text,
          submitter_nick_id: values?.nick_name,
        }));

    if (res?.status_code == 200) {
      router.back();
      return;
    } else if (res?.status_code == 400) {
      setUrlError(true);
      setUrlErrorMsg(res?.error?.link[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function nickNameListApiCall() {
      if (edit) {
        const reqBody = { newsfeed_id: +router.query?.camp[2]?.split("-")[0] };
        const res = await getEditCampNewsFeedApi(reqBody);
        const news = (res && res[0]) || {};
        setDataToUpdate(news);
        form.setFieldsValue({
          display_text: news?.display_text,
          link: news?.link,
          available_for_child: news?.available_for_child,
        });
      } else {
        const result = await getNickNameList();
        setNickNameData(result?.data);
      }
    }
    nickNameListApiCall();
  }, []);

  return (
    <Card title={edit ? "Edit News" : "Add News"} className={styles.card}>
      <Form
        form={form}
        layout={"vertical"}
        initialValues={{
          available_for_child: 0,
        }}
        onFinish={onFinish}
      >
        <Row gutter={28}>
          <Col xl={14} md={24} xs={24}>
            <Form.Item
              className={styles.formItem}
              name="display_text"
              label={
                <>
                  Display Text <small>(Limit 256 chars)</small>
                </>
              }
              rules={[
                {
                  required: true,
                  message: "Please input text",
                },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                maxLength={256}
                rows={6}
              />
            </Form.Item>
          </Col>

          <Col xl={10} md={24} xs={24}>
            <Form.Item
              className={`${styles.formItem} mb-3`}
              label={
                <>
                  Link <small>(Limit 2000 chars)</small>
                </>
              }
              name="link"
              validateTrigger="onFinish"
              rules={[
                {
                  required: true,
                  message: "Please input url",
                },
              ]}
            >
              <Input size="large" maxLength={2000} />
            </Form.Item>
            {urlError && <Text type="danger">{urlErrorMsg}</Text>}

            <Form.Item
              className={styles.formItemCheckbox}
              name="available_for_child"
              valuePropName="checked"
            >
              <Checkbox>Available for children</Checkbox>
            </Form.Item>

            {!edit && (
              <Form.Item
                label={<>Nick Name</>}
                name="nick_name"
                validateTrigger="onFinish"
                rules={[
                  {
                    required: true,
                    message: "Please select Nick name",
                  },
                ]}
              >
                <Select>
                  {nickNameData &&
                    nickNameData?.map((names) => (
                      <Select.Option value={names.id} key={names?.id}>
                        {names?.nick_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Form.Item>
          <Button
            size="large"
            className={`btn-orange mr-3 ${styles.btnSubmit}`}
            htmlType="submit"
            disabled={loading}
          >
            {edit ? "Submit" : " Create News"}
            {loading && <Spin indicator={antIcon} />}
          </Button>
          <Button
            htmlType="button"
            className="cancel-btn"
            type="ghost"
            size="large"
            onClick={goBack}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
