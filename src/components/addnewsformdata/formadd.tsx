import { Form, Input, Button, Checkbox } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useRouter } from "next/router";
import { addNewsRequestApi } from "../../network/api/addupdateNewsApi";
import { Row, Col, Card, Badge } from "antd";
import styles from "./addEditNews.module.scss";

export default function FormData() {
  const router = useRouter();
  const [form] = Form.useForm();
  const goBack = () => {
    router.back();
  };
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const { topic_num, camp_num } = router.query;
    console.log("----------------data topic , camp", topic_num, camp_num);
    const a = await addNewsRequestApi({
      topic_num: topic_num,
      camp_num: camp_num,
      available_for_child: values.available_for_child,
      link: values.link,
      display_text: values.display_text,
    });
    console.log(
      "--------------------------data obj of all in main addnews  => ",
      a
    );
    console.log("go back");
    router.back();
  };
  //   {
  //     "topic_num":12,
  //     "camp_num":1,
  //     "available_for_child":1,
  //     "link":"facebook.com",
  //     "display_text":"any text"
  // }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Card title="Add News" className={styles.Card} bordered={false}>
      <Form
        form={form}
        layout={"vertical"}
        initialValues={{
          available_for_child: 0,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={28}>
          <Col xl={14} md={24} xs={24} className="textarea-form">
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
              />
            </Form.Item>
          </Col>
          <Col xl={10} md={24} xs={24} className="form-link">
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
              />
            </Form.Item>

            <Form.Item
              className={styles.formItemCheckbox}
              name="available_for_child"
              valuePropName="checked"
              // wrapperCol={{
              //   offset: 8,
              //   span: 16,
              // }}
            >
              <Checkbox>Available for children</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            className="btn-orange mr-3"
            htmlType="submit"
          >
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
  );
}
