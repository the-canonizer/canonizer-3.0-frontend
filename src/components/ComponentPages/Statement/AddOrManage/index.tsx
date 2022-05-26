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
import "antd/dist/antd.css";
import styles from "../addEditNews.module.scss";
import { getAllUsedNickNames } from "../../../../network/api/campDetailApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";

export default function AddOrManage({ add }) {
  const isLogin = useAuthentication();
  const router = useRouter();
  const [nickNameData, setNickNameData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("values =>", values);
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      const reqBody = {
        topic_num: 30,
      };
      const result = await getAllUsedNickNames(reqBody);
      form.setFieldsValue({
        nick_name: result?.data[0]?.id,
      });
      setNickNameData(result?.data);
      setScreenLoading(false);
    }
    if (isLogin) {
      nickNameListApiCall();
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <Spin spinning={screenLoading} size="large">
      <Card
        title={add ? "Add Camp Statement" : "Topic Update"}
        className={styles.card}
      >
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
                label={<>Nick Name</>}
                name="nick_name"
                rules={[
                  {
                    required: true,
                    message: "Please select Nick name",
                  },
                ]}
              >
                <Select value={nickNameData[0]?.id} size="large">
                  {nickNameData &&
                    nickNameData?.map((names) => (
                      <Select.Option value={names.id} key={names?.id}>
                        {names?.nick_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              {add ? (
                <>
                  <Form.Item
                    className={`${styles.formItem} mb-3`}
                    label={
                      <>
                        Topic Name <small>(Limit 30 chars)</small>
                      </>
                    }
                    name="topic_name"
                    rules={[
                      {
                        required: true,
                        message: "Topic name is required.",
                      },
                    ]}
                  >
                    <Input size="large" maxLength={30} />
                  </Form.Item>

                  <Form.Item
                    className={styles.formItem}
                    label={
                      <>
                        Namespace{" "}
                        <small>
                          (General is recommended, unless you know otherwise)
                        </small>
                      </>
                    }
                    name="name_space"
                    rules={[
                      {
                        required: true,
                        message: "Please select Namespace",
                      },
                    ]}
                  >
                    <Select defaultValue="/General/" size="large">
                      <Select.Option value="general">/General/</Select.Option>
                      <Select.Option value="sandbox">/Sandbox/</Select.Option>
                      <Select.Option value="family">/Family/</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    className={styles.formItem}
                    name="statement"
                    label={<>Statement </>}
                    rules={[
                      {
                        required: true,
                        message: "Statement is required",
                      },
                    ]}
                  >
                    <Input.TextArea size="large" rows={7} />
                  </Form.Item>

                  <Form.Item
                    className={styles.formItem}
                    name="edit_summary"
                    label={
                      <>
                        Edit Summary{" "}
                        <small>(Briefly describe your changes)</small>
                      </>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Edit summary is required",
                      },
                    ]}
                  >
                    <Input.TextArea size="large" rows={5} />
                  </Form.Item>
                </>
              )}

              <Form.Item>
                <Button
                  size="large"
                  className={`btn-orange mr-3 ${styles.btnSubmit}`}
                  htmlType="submit"
                >
                  {add ? "Submit Statement" : "Submit Update"}
                </Button>
                {add && (
                  <Button
                    htmlType="button"
                    className="cancel-btn"
                    type="ghost"
                    size="large"
                  >
                    Preview
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Spin>
  );
}
