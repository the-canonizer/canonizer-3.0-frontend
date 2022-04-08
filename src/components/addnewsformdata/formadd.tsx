import { Form, Input, Button, Checkbox } from "antd";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { addNewsRequestApi } from "../../network/api/addupdateNewsApi";
import { Row, Col, Card, Badge } from "antd";
import styles from "./addEditNews.module.scss";
import { Spin } from "antd";

export default function FormData() {
  const [loading, setLoading] = useState(false);
  const [urlErrorMsg, setUrlErrorMsg] = useState("");
  const [urlError, setUrlError] = useState(false);

  const router = useRouter();
  const [form] = Form.useForm();
  const goBack = () => {
    setLoading(true);
    router.back();
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    const { topic_num, camp_num } = router.query;
    const a = await addNewsRequestApi({
      topic_num: topic_num,
      camp_num: camp_num,
      available_for_child: values.available_for_child,
      link: values.link,
      display_text: values.display_text,
    });

    if (a.status_code == 200) {
      router.back();
      return;
    }
    if (a.status_code != 200) {
      setUrlError(true);

      setUrlErrorMsg(a.error.link[0]);
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} size="large">
      <Card title="Add News" className={styles.card}>
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
                <Input
                  size="large"
                  placeholder="http:canonizer.com/videos/conciousness/"
                  maxLength={2000}
                />
              </Form.Item>
              {urlError && (
                <h6
                  style={{
                    color: "#ff4d4f",
                    fontSize: "14px",
                  }}
                >
                  {urlErrorMsg}
                </h6>
              )}

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
            <Button size="large" className="btn-orange mr-3" htmlType="submit">
              Create News
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
    </Spin>
  );
}
