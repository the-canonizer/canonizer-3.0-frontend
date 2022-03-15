import { Form, Input, Button, Checkbox, Divider } from "antd";
import React from "react";

export default function FormDataupdate({ update, setUpdate }) {
  console.log("data => ", update);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values.data);
    let ids = values.data.map((id) => id.id);
    let texts = values.data.map((text) => text.text);
    let links = values.data.map((link) => link.link);
    let availables = values.data.map((available) => available.available);
    console.log("ids => ", ids);
    console.log("texts => ", texts);
    console.log("links => ", links);
    console.log("availables => ", availables);
    setUpdate(values.data);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>update</h1>

      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          data: update,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.List name="data">
          {(fields) => {
            console.log("fields=> ", fields);

            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Form.Item
                      name={[index, "text"]}
                      label="Display Text"
                      validateTrigger="onFinish"
                      rules={[
                        {
                          required: true,
                          message: "Please input text",
                        },
                      ]}
                    >
                      <Input.TextArea showCount maxLength={50} />
                    </Form.Item>

                    <Form.Item
                      label="Link"
                      name={[index, "link"]}
                      validateTrigger="onFinish"
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
                      name={[index, "available"]}
                      valuePropName="checked"
                      wrapperCol={{
                        offset: 8,
                        span: 16,
                      }}
                    >
                      <Checkbox>Available for children</Checkbox>
                    </Form.Item>
                    <Divider />
                  </div>
                ))}
              </div>
            );
          }}
        </Form.List>

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
