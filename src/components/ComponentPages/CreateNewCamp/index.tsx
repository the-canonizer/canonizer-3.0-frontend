import { Card, Form, Input, Button, Select, Row, Col, Typography   } from 'antd';
import SideBar from "../home/sideBar";
import styles from './createNewCamp.module.scss';

const { Option } = Select;
const { Text } = Typography;

const CreateNewCamp = () => {
    const CardTitle = <>Create New Camp</>
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
                        <Col  xs={24} sm={12}>
                            <Form.Item
                                label="Parent Camp"
                                name="ParentCamp"
                                rules={[{ required: true}]}
                            >
                                <Select
                                    placeholder="Agreement"
                                    allowClear
                                    size={"large"}
                                >
                                    <Option value="Agreement">Agreement</Option>
                                    <Option value="ParentCamp">Parent Camp</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Camp Name"
                                name="CampName"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Camp Name"  size={"large"}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Keywords"
                                name="Keywords"
                                rules={[{ required: true}]}
                            >
                                <Input placeholder="Keyword, Keyword"  size={"large"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<div>Edit summary <span>(Briefly describe your changes)</span></div>}
                                name="Summary"
                            >
                                <Input.TextArea rows={6} placeholder="Write summary..."/>
                                <Text>The following are rarely used and are for advanced users only.</Text>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Camp About URL"
                                name="CampAboutURL"
                            >
                                <Input placeholder="https://"  size={"large"}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Camp About Nick Name"
                                name="CampAbout"
                            >
                                <Select
                                    placeholder="Select Camp About Nick Name"
                                    allowClear
                                    size={"large"}
                                >
                                    <Option value="Agreement">Select Camp About Nick Name</Option>
                                    <Option value="ParentCamp">Parent Camp</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Col> 
                    </Row>
                    <Form.Item noStyle>
                        <Button type="primary" htmlType="submit" size={"large"} className=" btn-orang"> Create Camp </Button>
                    </Form.Item>
                </Form>
            </Card>
            </div>
        </>
    );
  };
  
  export default CreateNewCamp;