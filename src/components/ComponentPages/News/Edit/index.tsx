import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Checkbox,
  Spin,
  Typography,
  Input,
  Row,
  Col,
  Card,
} from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { updateNewsDataApi } from "../../../../network/api/campNewsApi";
import { getCampEditNewsDataApi } from "../../../../network/api/campNewsApi";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import styles from "../addEditNews.module.scss";
import { is } from "immer/dist/internal";

const antIcon = <LoadingOutlined spin />;
const { Text } = Typography;

export default function Edit() {
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const [urlErrorMsg, setUrlErrorMsg] = useState("");
  const [urlError, setUrlError] = useState(false);
  const router = useRouter();
  const isLogin = useAuthentication();
  const [form] = Form.useForm();

  const goBack = () => {
    setLoading(true);
    router.back();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const res = await updateNewsDataApi({
      newsfeed_id: dataToUpdate?.id,
      display_text: values.display_text,
      link: values.link,
      available_for_child: values.available_for_child,
      submitter_nick_id: dataToUpdate?.submitter_nick_id,
    });
    if (res?.status_code == 200) {
      router.back();
      return;
    } else if (res?.status_code == 400) {
      setUrlError(true);
      setUrlErrorMsg(res?.error?.link && res?.error?.link[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getCampEditNewsDataCall() {
      const reqBody = { newsfeed_id: +router.query?.camp[2]?.split("-")[0] };
      const res = await getCampEditNewsDataApi(reqBody);
      const news = (res && res[0]) || {};
      setDataToUpdate(news);
      form.setFieldsValue({
        display_text: news?.display_text,
        link: news?.link,
        available_for_child: news?.available_for_child,
      });

      if (isLogin === false) {
        router.push("/login");
      } else if (news === {} && isLogin === true) {
        router.push(`/topic/${router.query.camp[0]}/${router.query.camp[0]}`);
      }
    }
    getCampEditNewsDataCall();
  }, []);

  if (isLogin === false) return null;
  return (
    <Card title="Edit News" className={styles.card}>
      <Form form={form} name="basic" layout={"vertical"} onFinish={onFinish}>
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
          </Col>
        </Row>

        <Form.Item>
          <Button
            size="large"
            className={`btn-orange mr-3 ${styles.btnSubmit}`}
            htmlType="submit"
            disabled={loading}
          >
            Submit
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
