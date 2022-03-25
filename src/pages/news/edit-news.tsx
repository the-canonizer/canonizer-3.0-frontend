import { Row, Col, Card, Checkbox, Form, Input, Badge, Button } from "antd";

import Layout from "../../hoc/layout";
import SideBar from "../../components/ComponentPages/Home/SideBar";

const { TextArea } = Input;

function Edit() {
  return (
    <>
      <Layout routeName={"edit-news"}>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Card title="Edit News" className="edit-card" bordered={false}>
            <Card className="inner-form">
              <div className="count-badge">
                <Badge className="count-row-edit ">1</Badge>
              </div>
              <Row gutter={28}>
                <Col xl={14} md={24} xs={24}>
                  <Form layout="vertical" className="textarea-form">
                    <Form.Item label="Display Text ( Limit 256 chars )">
                      <TextArea
                        placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                        autoSize={{ minRows: 6, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Form>
                </Col>

                <Col xl={10} md={24} xs={24}>
                  <Form layout="vertical" className="form-link">
                    <Form.Item label="Link ( Limit 2000 chars )">
                      <Input placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
            <Card className="inner-form">
              <div className="count-badge">
                <Badge className="count-row-edit ">2</Badge>
              </div>
              <Row gutter={24}>
                <Col xl={14} md={24} xs={24}>
                  <Form layout="vertical" className="textarea-form">
                    <Form.Item label="Display Text ( Limit 256 chars )">
                      <TextArea
                        placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                        autoSize={{ minRows: 6, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Form>
                </Col>

                <Col xl={10} md={24} xs={24}>
                  <Form layout="vertical" className="form-link">
                    <Form.Item label="Link ( Limit 2000 chars )">
                      <Input placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
            <Card className="inner-form">
              <div className="count-badge">
                <Badge className="count-row-edit ">3</Badge>
              </div>
              <Row gutter={24}>
                <Col xl={14} md={24} xs={24}>
                  <Form layout="vertical" className="textarea-form">
                    <Form.Item label="Display Text ( Limit 256 chars )">
                      <TextArea
                        placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                        autoSize={{ minRows: 6, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Form>
                </Col>

                <Col xl={10} md={24} xs={24}>
                  <Form layout="vertical" className="form-link">
                    <Form.Item label="Link ( Limit 2000 chars )">
                      <Input placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>

            <div className="edit-news-buttons">
              <Button className="submit-btn">Submit</Button>
              <Button className="cancel-btn">Cancel</Button>
            </div>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default Edit;
