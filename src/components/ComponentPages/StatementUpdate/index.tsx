import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Row, Col, Modal   } from 'antd';
import SideBar from "../home/sideBar";
import styles from './statementUpdate.module.scss';

const { Option } = Select;

const StatementUpdate = () => {
    const CardTitle = <>Statement Update</>;
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
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
                        <div className="form-buttons">
                            <Button type="primary" htmlType="submit" size={"large"} className="btn-orang"> Submit Update </Button>
                            <Button size={"large"} className=" btn-orang ghost" onClick={showModal}> Preview </Button>
                        </div>
                    </Form.Item>


                    <Modal  width={558} title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className='statement-preview'>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>
                </Form>
            </Card>
            </div>
        </>
    );
  };
  
  export default StatementUpdate;