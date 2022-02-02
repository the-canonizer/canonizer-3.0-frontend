import { Card, Form, Input, Button, Select, Row, Col   } from 'antd';
import SideBar from "../home/sideBar";
import styles from './createNewTopic.module.scss';

const { Option } = Select;

const CreateNewTopic = () => {
    const CardTitle = <>Create New Topic</>
    return (
        <>
            <aside className="leftSideBar miniSideBar">
                <SideBar />
            </aside>
            <div className="pageContentWrap">
            <Card title={CardTitle} className='can-card-style'>
                <Form
                name="basic"
                layout={'vertical'}
                autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Nick Name"
                                name="NickName"
                                rules={[{ required: true}]}
                            >
                                <Select
                                    placeholder="Numan"
                                    allowClear
                                    size={"large"}
                                    >
                                    <Option value="Numan">Numan</Option>
                                    <Option value="NickName">Nick Name</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Namespace"
                                name="Namespace"
                                rules={[{ required: true}]}
                            >
                                <Select
                                    placeholder="Code District"
                                    allowClear
                                    size={"large"}
                                    >
                                    <Option value="CodeDistrict">Code District</Option>
                                    <Option value="Namespace">Namespace</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Topic Name"
                                name="TopicName"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Test"  size={"large"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Summary"
                                name="Summary"
                                rules={[{ required: true}]}
                            >
                                <Input.TextArea rows={5} placeholder="Write summary..."/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item noStyle>
                        <Button type="primary" htmlType="submit" size={"large"} className=" btn-orang"> Create Topic </Button>
                    </Form.Item>
                </Form>
            </Card>
            </div>
        </>
    );
  };
  
  export default CreateNewTopic;