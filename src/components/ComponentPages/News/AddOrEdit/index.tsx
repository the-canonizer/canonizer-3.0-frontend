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
import { getAllUsedNickNames } from "../../../../network/api/campDetailApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import K from "src/constants";

const antIcon = <LoadingOutlined spin />;
const { Text } = Typography;

export default function AddOrEdit({ edit }) {
  const isLogin = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [errors, setErrors] = useState({
    urlError: false,
    urlErrorMsg: "",
    displayTextError: false,
    displayTextErrorMsg: "",
  });
  const [nickNameData, setNickNameData] = useState([]);
  const [dataToUpdate, setDataToUpdate] = useState({
    id: null,
    submitter_nick_id: null,
  });
  const router = useRouter();
  const [form] = Form.useForm();

  const goBack = () => {
    if (edit) {
      router.push(`/topic/${router?.query?.camp[0]}/${router?.query?.camp[1]}`);
    } else {
      router.push(router.asPath.replace("addnews", "topic"));
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    let res;
    edit
      ? (res = await updateNewsFeedApi({
          newsfeed_id: dataToUpdate?.id,
          display_text: values.display_text,
          link: values.link.trim(),
          available_for_child: values.available_for_child,
          submitter_nick_id: dataToUpdate?.submitter_nick_id,
        }))
      : (res = await addNewsFeedApi({
          topic_num: +router.query?.camp[0]?.split("-")[0],
          camp_num: +router.query?.camp[1]?.split("-")[0],
          available_for_child: values?.available_for_child,
          link: values?.link.trim(),
          display_text: values?.display_text,
          submitter_nick_id: values?.nick_name,
        }));
    if (res?.status_code == 200) {
      if (edit) {
        router.push(
          `/topic/${router?.query?.camp[0]}/${router?.query?.camp[1]}`
        );
        return;
      } else {
        router.push(router.asPath.replace("addnews", "topic"));
        return;
      }
    } else if (res?.status_code == 400) {
      if (Object.keys(res?.error).includes("link")) {
        setErrors((err) => {
          return {
            ...err,
            urlError: true,
            urlErrorMsg: res?.error?.link[0],
          };
        });
      } else {
        setErrors((err) => {
          return {
            ...err,
            urlError: false,
            urlErrorMsg: "",
          };
        });
      }
      if (Object.keys(res?.error).includes("display_text")) {
        setErrors((err) => {
          return {
            ...err,
            displayTextError: true,
            displayTextErrorMsg: res?.error?.display_text[0],
          };
        });
      } else {
        setErrors((err) => {
          return {
            ...err,
            displayTextError: false,
            displayTextErrorMsg: "",
          };
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      if (edit) {
        const reqBody = {
          newsfeed_id: +router.query?.camp[2]?.split("-")[2],
        };
        const res = await getEditCampNewsFeedApi(reqBody);
        const news = (res && res[0]) || {};
        setDataToUpdate(news);
        form.setFieldsValue({
          display_text: news?.display_text,
          link: news?.link,
          available_for_child: news?.available_for_child,
        });
        const reqBodyNickName = {
          topic_num: +router.query?.camp[0]?.split("-")[0],
        };
        const result = await getAllUsedNickNames(reqBodyNickName);
        form.setFieldsValue({
          nick_name: result?.data.find((id) => id.id == news.submitter_nick_id)
            ?.id,
        });
        setNickNameData(result?.data);
        setScreenLoading(false);
      } else {
        const reqBody = {
          topic_num: +router.query?.camp[0]?.split("-")[0],
        };
        const result = await getAllUsedNickNames(reqBody);
        form.setFieldsValue({
          nick_name: result?.data[0]?.id,
        });
        setNickNameData(result?.data);
        setScreenLoading(false);
      }
    }
    if (isLogin) {
      nickNameListApiCall();
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <Spin spinning={screenLoading} size="large">
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
                    Display Text <span className="required">*</span>{" "}
                    <small>(Limit 256 chars)</small>
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: "Display text is required",
                  },
                  {
                    pattern: /[^ \s]/,
                    message: "Display text is required",
                  },
                ]}
              >
                <Input.TextArea
                  size="large"
                  placeholder={K?.exceptionalMessages?.addNewsTextPlaceHolder}
                  maxLength={256}
                  rows={7}
                />
              </Form.Item>

              {errors.displayTextError && (
                <Text type="danger">{errors.displayTextErrorMsg}</Text>
              )}
            </Col>

            <Col xl={10} md={24} xs={24}>
              <Form.Item
                className={`${styles.formItem} mb-3`}
                label={
                  <>
                    Link <span className="required">*</span>{" "}
                    <small>(Limit 2000 chars)</small>
                  </>
                }
                name="link"
                rules={[
                  {
                    required: true,
                    message: "Link is required.",
                  },
                  {
                    pattern: /[^ \s]/,
                    message: "Enter a valid link",
                  },
                ]}
              >
                <Input size="large" maxLength={2000} />
              </Form.Item>

              {errors.urlError && (
                <Text type="danger">{errors.urlErrorMsg}</Text>
              )}

              <Form.Item
                className={styles.formItemCheckbox}
                name="available_for_child"
                valuePropName="checked"
              >
                <Checkbox>Available for child camps</Checkbox>
              </Form.Item>

              <Form.Item
                className={styles.formItem}
                label={
                  <>
                    Nick Name
                    <span className="required">*</span>
                  </>
                }
                name="nick_name"
                rules={[
                  {
                    required: true,
                    message: "Please select Nick name",
                  },
                ]}
              >
                <Select
                  value={nickNameData[0]?.id}
                  size="large"
                  disabled={edit}
                >
                  {nickNameData &&
                    nickNameData?.map((names) => (
                      <Select.Option value={names.id} key={names?.id}>
                        {names?.nick_name}
                      </Select.Option>
                    ))}
                </Select>
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
    </Spin>
  );
}
