import { Form, Input, Button, Checkbox } from "antd";
import React from "react";

export default function FormData() {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <h1>form</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ available: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="text"
          label="Display Text"
          rules={[
            {
              required: true,
              message: "Please input text",
            },
          ]}
        >
          <Input.TextArea showCount maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Link"
          name="link"
          rules={[
            {
              required: true,
              message: "Please input url only",
              type: "url",
            },
          ]}
        >
          <Input maxLength={200} />
        </Form.Item>

        <Form.Item
          name="available"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Available for children</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
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
    </div>
  );
}
