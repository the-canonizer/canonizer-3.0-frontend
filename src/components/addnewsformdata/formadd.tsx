import { Form, Input, Button, Checkbox } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useRouter } from "next/router";
import { addNewsRequestApi } from "../../network/api/addupdateNewsApi";
import { Row, Col } from "antd";

export default function FormData() {
  const [form] = Form.useForm();
  console.log("selected data 2=> ");
  const router = useRouter();
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const a = await addNewsRequestApi(values);
    console.log("data obj of all in main addnews  => ", a);
    router.back();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      form={form}
      layout={"vertical"}
      initialValues={{
        available_for_child: 0,
      }}
      style={{
        width: "100%",
        margin: "30px",
        marginRight: "50px",
        backgroundColor: "#f2f2f2",
        padding: "10px 20px",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <h1>Add News</h1>
      <Row>
        <Col xs={24} xl={12}>
          <Form.Item
            name="display_text"
            label="Display Text"
            rules={[
              {
                required: true,
                message: "Please input text",
              },
            ]}
          >
            <Input.TextArea
              showCount
              maxLength={50}
              rows={6}
              placeholder="New Video : consiness is not the problem"
            />
          </Form.Item>
        </Col>
        <Col xs={24} xl={12}>
          <Form.Item
            style={{ marginLeft: "10px" }}
            label="Link"
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
            <Input maxLength={200} />
          </Form.Item>

          <Form.Item
            style={{
              marginLeft: "10px",
              fontWeight: "bold",
              marginTop: "-10px",
            }}
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
      <Form.Item
      // wrapperCol={{
      //   offset: 8,
      //   span: 16,
      // }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
          htmlType="submit"
        >
          Create News
        </Button>
        <Button
          htmlType="button"
          style={{
            margin: "0 8px",
          }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
}
