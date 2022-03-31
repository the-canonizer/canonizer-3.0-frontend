import { Row, Col, Card, Checkbox, Form, Input, Badge, Button } from "antd";

import Layout from "../../hoc/layout";
import SideBar from "../../components/ComponentPages/Home/SideBar";
import styles from "./editNews.module.scss";

const { TextArea } = Input;

function EditNews() {
  return (
    <>
      <Layout routeName={"edit-news"}>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Card title="Edit News" className={styles.newsCard}>
            <Form layout="vertical">
              <Card className={styles.newsFormFieldsCard} bordered={false}>
                <Badge className={styles.newsFormFieldsCardCounter}>1</Badge>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                      <Form.Item label="Display Text ( Limit 256 chars )" className={styles.textArea}>
                        <TextArea
                          placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                          autoSize={{ minRows: 6, maxRows: 5 }}
                        />
                      </Form.Item>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                      <Form.Item label="Link ( Limit 2000 chars )" className={styles.formLink}>
                        <Input placeholder="http:canonizer.com/videos/conciousness/" />
                      </Form.Item>
                      <Form.Item>
                        <Checkbox>Available For Child camps</Checkbox>
                      </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* <Card className="inner-form">
                <div className="count-badge">
                  <Badge className="count-row-edit ">2</Badge>
                </div>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                    <div className="textarea-form">
                      <Form.Item label="Display Text ( Limit 256 chars )">
                        <TextArea
                          placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                          autoSize={{ minRows: 6, maxRows: 5 }}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                    <div className="form-link">
                      <Form.Item label="Link ( Limit 2000 chars )">
                        <Input placeholder="http:canonizer.com/videos/conciousness/" />
                      </Form.Item>
                      <Form.Item>
                        <Checkbox>Available For Child camps</Checkbox>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Card className="inner-form">
                <div className="count-badge">
                  <Badge className="count-row-edit ">3</Badge>
                </div>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                    <div className="textarea-form">
                      <Form.Item label="Display Text ( Limit 256 chars )">
                        <TextArea
                          placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"'
                          autoSize={{ minRows: 6, maxRows: 5 }}
                        />
                      </Form.Item>
                    </div>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                    <div className="form-link">
                      <Form.Item label="Link ( Limit 2000 chars )">
                        <Input placeholder="http:canonizer.com/videos/conciousness/" />
                      </Form.Item>
                      <Form.Item>
                        <Checkbox>Available For Child camps</Checkbox>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Card> */}
              <div className={styles.editNewsButtons}>
                <Button className="btn-orange">Submit</Button>
                <Button >Cancel</Button>
              </div>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default EditNews;
