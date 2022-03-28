import { Form, Input, Button, Checkbox } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useRouter } from "next/router";
import { addNewsRequestApi } from "../../network/api/addupdateNewsApi";
import { Row, Col, Card, Badge } from "antd";

export default function FormData() {
  const router = useRouter();
  const [form] = Form.useForm();
  console.log("selected data 2=> ");
  const goBack = () => {
    router.back();
  };
  const onFinish = (values: any) => {
    console.log("Success:", values);
    // const a = await addNewsRequestApi(values);
    // console.log("data obj of all in main addnews  => ", a);
    console.log("go back");
    router.back();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Card title="Add News" className="edit-card" bordered={false}>
      <Form
        form={form}
        layout={"vertical"}
        initialValues={{
          available_for_child: 0,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Card className="inner-form">
          {/* <div className="count-badge">
            <Badge className="count-row-edit ">1</Badge>
          </div> */}
          <Row gutter={24}>
            <Col xl={14} md={24} xs={24} className="textarea-form">
              <Form.Item
                name="display_text"
                label="Display Text ( Limit 256 chars )"
                rules={[
                  {
                    required: true,
                    message: "Please input text",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                  autoSize={{ minRows: 6, maxRows: 5 }}
                  maxLength={256}
                />
              </Form.Item>
            </Col>
            <Col xl={10} md={24} xs={24} className="form-link">
              <Form.Item
                label="Link ( Limit 2000 chars )"
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
        </Card>
        <Form.Item className="edit-news-buttons">
          <Button type="primary" className="submit-btn" htmlType="submit">
            Create News
          </Button>
          <Button htmlType="button" className="cancel-btn" onClick={goBack}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
