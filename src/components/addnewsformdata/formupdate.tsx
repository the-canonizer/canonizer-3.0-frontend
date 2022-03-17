import { Form, Input, Button, Checkbox, Divider } from "antd";
import Router, { useRouter } from "next/router";
import React from "react";
import { updateNewsFeedApi } from "../../network/api/addupdateNewsApi";
export default function FormDataupdate({ update }) {
  console.log("data => ", update);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log("Success:", values.data);

    const dataobj = await {
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

    Router.push("/allnews");
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
                      name={[index, "display_text"]}
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
                        },
                      ]}
                    >
                      <Input maxLength={200} />
                    </Form.Item>

                    <Form.Item
                      name={[index, "available_for_child"]}
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
