import { Row, Col, Card, Checkbox, Form, Input, Badge, Button } from "antd";

import Layout from "../../hoc/layout";
import SideBar from "../../components/ComponentPages/Home/SideBar";
import styles from "./addEditNews.module.scss";

const { TextArea } = Input;

function EditNews() {
  return (
    <>
      <Layout routeName={"edit-news"}>
        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>
        <div className="pageContentWrap">
          <Card title="Edit News" className={styles.card}>
            <Form layout="vertical">
              <Card className={styles.newsFormFieldsCard} bordered={false}>
                <Badge className={styles.newsFormFieldsCardCounter}>1</Badge>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                      <Form.Item label={<>Display Text <small>(Limit 256 chars)</small></>} className={styles.formItem}>
                        <TextArea placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"' rows={6} />
                      </Form.Item>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                    <Form.Item label={<>Link <small>(Limit 2000 chars)</small></>} className={`${styles.formItem} mb-3`}>
                      <Input size="large" placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item className={styles.formItemCheckbox}>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card className={styles.newsFormFieldsCard} bordered={false}>
                <Badge className={styles.newsFormFieldsCardCounter}>2</Badge>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                      <Form.Item label={<>Display Text <small>(Limit 256 chars)</small></>} className={styles.formItem}>
                        <TextArea placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"' rows={6} />
                      </Form.Item>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                    <Form.Item label={<>Link <small>(Limit 2000 chars)</small></>} className={`${styles.formItem} mb-3`}>
                      <Input size="large" placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item className={styles.formItemCheckbox}>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card className={styles.newsFormFieldsCard} bordered={false}>
                <Badge className={styles.newsFormFieldsCardCounter}>3</Badge>
                <Row gutter={28}>
                  <Col xl={14} md={24} xs={24}>
                      <Form.Item label={<>Display Text <small>(Limit 256 chars)</small></>} className={styles.formItem}>
                        <TextArea placeholder='New Video:"Consciousness:Not a Hard Problem Just a Color Problem"' rows={6} />
                      </Form.Item>
                  </Col>

                  <Col xl={10} md={24} xs={24}>
                    <Form.Item label={<>Link <small>(Limit 2000 chars)</small></>} className={`${styles.formItem} mb-3`}>
                      <Input size="large" placeholder="http:canonizer.com/videos/conciousness/" />
                    </Form.Item>
                    <Form.Item className={styles.formItemCheckbox}>
                      <Checkbox>Available For Child camps</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <div>
                <Button size="large" className="btn-orange mr-3">Submit</Button>
                <Button type="ghost" size="large" >Cancel</Button>
              </div>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

export default EditNews;
