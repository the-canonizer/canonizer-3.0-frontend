import { Form, Input, Button, Checkbox, Divider, Card, Badge } from "antd";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import React from "react";
import { updateNewsFeedApi } from "../../network/api/addupdateNewsApi";
import styles from "./addEditNews.module.scss";

export default function FormDataupdate({ update, topic_num, camp_num }) {
  console.log("data => ", update, topic_num, camp_num);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log("Success:", values.data);

    const dataobj = await {
      topic_num: topic_num,
      camp_num: camp_num,
      id: values.data.map((id) => id.id),
      display_text: values.data.map((text) => text.display_text),
      link: values.data.map((link) => link.link),
      available_for_child: values.data.map(
        (available) => available.available_for_child
      ),
    };
    console.log("data obj of all adata  => ", dataobj);

    const a = await updateNewsFeedApi(dataobj);
    console.log("data obj of all a  => ", a);
    router.back();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card title="Edit News" className={styles.card}>
      <Form
        form={form}
        name="basic"
        initialValues={{
          data: update,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
                          <Form.Item
                            label={
                              <>
                                Link <small>(Limit 2000 chars)</small>
                              </>
                            }
                            className={`${styles.formItem} mb-3`}
                            name={[index, "link"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input url",
                              },
                              {
                                pattern:
                                  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                                message: "Please input valid url only",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="http:canonizer.com/videos/conciousness/"
                              maxLength={2000}
                            />
                          </Form.Item>

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
          <Button size="large" className="btn-orange mr-3" htmlType="submit">
            Submit
          </Button>
          <Button
            htmlType="button"
            onClick={() => router.back()}
            type="ghost"
            size="large"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
