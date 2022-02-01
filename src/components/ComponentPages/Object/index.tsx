import SideBar from "../home/sideBar";
import styles from './object.module.scss';
import { Card, Form, Input, Button, Select, Row, Col   } from 'antd';
const { Option } = Select;

const Object = () => {
    const CardTitle = <>Object</>
    return (
        <>
            <aside className="leftSideBar miniSideBar">
                <SideBar />
            </aside>
            <div className="pageContentWrap">
            <Card title={CardTitle} className='form-card'>
                <Form
                name="basic"
                layout={'vertical'}
                autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
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
                        
                    </Row>
                 
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Summary"
                                name="Summary"
                                rules={[{ required: true}]}
                            >
                                <Input.TextArea rows={5} placeholder="= Theories of Mind and Consciousness =
                                    The goal of this topic is to build and track consensus around theories of consciousness.  Everyone is invited to contribute, as we want to track the default popular consensus.  There is also the [https://canonizer.com/topic/53-Mind-Experts/11 “Mind Expert”] Canonizer people can select, so people can compare the popular consensus with the “Expert Consensus”.
                                    "/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Edit summary (Briefly describe your changes)"
                                name="Editsummary"
                            >
                                <Input.TextArea rows={5} placeholder="Write summary..."/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item noStyle>
                        <Button type="primary" htmlType="submit" size={"large"} className="btn-orang"> Submit Update </Button>
                    </Form.Item>
                </Form>
            </Card>
            </div>
        </>
    );
  };
  
  export default Object;