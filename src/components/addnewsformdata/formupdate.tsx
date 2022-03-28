import { Form, Input, Button, Checkbox, Divider, Card, Badge } from "antd";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import React from "react";
import { updateNewsFeedApi } from "../../network/api/addupdateNewsApi";
export default function FormDataupdate({ update }) {
  console.log("data => ", update);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log("Success:", values.data);

    const dataobj = await {
      topic_num: 45,
      camp_num: 1,
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
    <Card title="Edit News" className="edit-card" bordered={false}>
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
                    <Card className="inner-form" key={field.key}>
                      <div className="count-badge">
                        <Badge className="count-row-edit ">{field.key}</Badge>
                      </div>
                      <Row gutter={28}>
                        <Col xl={14} md={24} xs={24} className="textarea-form">
                          <Form.Item
                            key={field.key}
                            name={[index, "display_text"]}
                            label="Display Text ( Limit 256 chars )"
                            rules={[
                              {
                                required: true,
                                message: "Please input text",
                              },
                            ]}
                          >
                            <Input.TextArea
                              showCount
                              maxLength={256}
                              autoSize={{ minRows: 6, maxRows: 5 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xl={10} md={24} xs={24} className="form-link">
                          <Form.Item
                            label="Link ( Limit 2000 chars )"
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
                            <Input maxLength={2000} />
                          </Form.Item>

                          <Form.Item
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

        <Form.Item className="edit-news-buttons">
          <Button type="primary" className="submit-btn" htmlType="submit">
            Submit
          </Button>
          <Button
            htmlType="button"
            onClick={() => router.back()}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

// <Form
//       form={form}
//       layout={"vertical"}
//       name="basic"
//       initialValues={{
//         data: update,
//       }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//       style={{
//         width: "100%",
//         margin: "30px",
//         marginRight: "50px",
//         borderStyle: "solid",
//         borderWidth: "3px",
//         borderColor: "#f2f2f2",
//         padding: "10px 20px",
//       }}
//     >
//       <h1>Add News</h1>
//       <Divider />
//       <Form.List name="data">
//         {(fields) => {
//           return (
//             <>
//               {fields.map((field, index) => (
//                 <>
//                   <Row
//                     style={{
//                       backgroundColor: "#f2f2f2",
//                       marginBottom: "10px",
//                       padding: "10px 20px",
//                     }}
//                   >
//                     <Col xs={24} xl={1}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           alignContent: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <h1
//                           style={{
//                             backgroundColor: "orange",
//                             textAlign: "center",
//                             height: "45px",
//                             width: "40px",

//                             borderRadius: "10px",
//                             color: "white",
//                           }}
//                         >
//                           {field.key}
//                         </h1>
//                       </div>
//                     </Col>
//                     <Col xs={24} xl={12} style={{ paddingRight: "30px" }}>
//                       <Form.Item
//                         key={field.key}
//                         name={[index, "display_text"]}
//                         label="Display Text"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input text",
//                           },
//                         ]}
//                       >
//                         <Input.TextArea showCount maxLength={50} rows={6} />
//                       </Form.Item>
//                     </Col>
//                     <Col xs={24} xl={11}>
//                       <Form.Item
//                         label="Link"
//                         name={[index, "link"]}
//                         rules={[
//                           {
//                             required: true,
//                             message: "Please input url",
//                           },
//                           {
//                             pattern:
//                               /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
//                             message: "Please input valid url only",
//                           },
//                         ]}
//                       >
//                         <Input maxLength={200} />
//                       </Form.Item>

//                       <Form.Item
//                         style={{
//                           fontWeight: "bold",
//                           marginTop: "-10px",
//                         }}
//                         name={[index, "available_for_child"]}
//                         valuePropName="checked"
//                       >
//                         <Checkbox>Available for children</Checkbox>
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </>
//               ))}
//             </>
//           );
//         }}
//       </Form.List>

//       <Form.Item>
//         <Button
//           type="primary"
//           style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
//           htmlType="submit"
//         >
//           Submit
//         </Button>
//         <Button
//           htmlType="button"
//           onClick={() => router.back()}
//           style={{
//             margin: "0 8px",
//           }}
//         >
//           Cancel
//         </Button>
//       </Form.Item>
//     </Form>
