import { Form, Input, Button, Checkbox, Divider, Card, Badge } from "antd";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import React, { useState } from "react";
import { updateNewsDataApi } from "../../../../network/api/campNewsApi";
import styles from "../addEditNews.module.scss";
import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

const { Text } = Typography;
const antIcon = <LoadingOutlined spin />;

export default function Edit() {
  const dataToUpdate = useSelector(
    (state: RootState) => state?.campNews?.campNews?.newsToEdit
  );

  const [urlErrorMsg, setUrlErrorMsg] = useState("");
  const [urlError, setUrlError] = useState(
    new Array(dataToUpdate.length).fill(false)
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const goBack = () => {
    setLoading(true);
    router.back();
  };
  const onFinish = async (values: any) => {
    setLoading(true);

    const dataObj = {
      topic_num: +router.query?.camp[0]?.split("-")[0],
      camp_num: +router.query?.camp[1]?.split("-")[0],
      id: values.data.map((id) => id.id),
      display_text: values.data.map((text) => text.display_text),
      link: values.data.map((link) => link.link),
      available_for_child: values.data.map(
        (available) => available.available_for_child
      ),
    };
    const res = await updateNewsDataApi(dataObj);
    if (res?.status_code == 200) {
      router.back();
      return;
    } else if (res?.status_code === 200) {
      let noOfErr = Object.keys(res?.error).map((err) => {
        let err_on = err.replace("link.", "");
        return err_on;
      });
      let urlError_dup = [...urlError];
      noOfErr.forEach((val) => (urlError_dup[val] = !urlError_dup[val]));
      setUrlError(urlError_dup);
      setUrlErrorMsg(res?.message);
    }
    setLoading(false);
  };

  if (dataToUpdate.length == 0) {
    return null;
  }
  return (
    <Card title="Edit News" className={styles.card}>
      <Form
        form={form}
        name="basic"
        initialValues={{
          data: dataToUpdate,
        }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.List name="data">
          {(fields) => {
            return (
              <>
                {fields.map((field, index) => (
                  <>
                    <Card
                      className={styles.newsFormFieldsCard}
                      bordered={false}
                      key={field.key}
                    >
                      <Badge className={styles.newsFormFieldsCardCounter}>
                        {field.key}
                      </Badge>

                      <Row gutter={28}>
                        <Col xl={14} md={24} xs={24}>
                          <Form.Item
                            className={styles.formItem}
                            key={field.key}
                            name={[index, "display_text"]}
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
                              placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                              rows={6}
                              maxLength={256}
                            />
                          </Form.Item>
                        </Col>

                        <Col xl={10} md={24} xs={24}>
                          <div className="mb-3">
                            <Form.Item
                              label={
                                <>
                                  Link <small>(Limit 2000 chars)</small>
                                </>
                              }
                              className={`${styles.formItem} mb-0`}
                              name={[index, "link"]}
                            >
                              <Input
                                size="large"
                                maxLength={2000}
                                className={urlError[index] && `${styles.error}`}
                              />
                            </Form.Item>
                            {urlError[index] && (
                              <Text type="danger">{urlErrorMsg}</Text>
                            )}
                          </div>
                          <Form.Item
                            className={styles.formItemCheckbox}
                            name={[index, "available_for_child"]}
                            valuePropName="checked"
                          >
                            <Checkbox>Available for children</Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  </>
                ))}
              </>
            );
          }}
        </Form.List>

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
          <Button htmlType="button" onClick={goBack} type="ghost" size="large">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
