import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Row, Col, Modal, Typography   } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import SideBar from "../home/sideBar";
import styles from './statementUpdate.module.scss';

const { Option } = Select;
const { Title, Paragraph } = Typography;

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


                    <Modal  width={558} visible={isModalVisible} footer={null} onOk={handleOk} onCancel={handleCancel} className={styles.statementPreview} closeIcon={<CloseCircleOutlined />} bodyStyle={{
                        padding: '37px 30px 27px'
                    }}>
                        <Title level={3} className={styles.headingStyle}>Statement Preview</Title>
                        <Title level={3} className={`${styles.headingStyle} ${styles.bgDark}`}>Theories of Mind and Consciousness</Title>

                        <Paragraph className={styles.paragraphStyle}>
                            The goal of this topic is to build and track consensus around theories of consciousness. Everyone is invited to contribute, as we want to track the default popular consensus. There is also the “Mind Expert” Canonizer people can select, so people can compare the popular consensus with the “Expert Consensus”.
                        </Paragraph>

                        <Paragraph className={styles.paragraphStyle}>
                            We focus on bridging the Explanatory Gap to explore the qualitative nature of consciousness. We are asking the questions: “What are the physical properties of conscious experience?” Physical properties can be measured. “Can consciousness then be physically measured, tested, and observed?”
                        </Paragraph>
                        <Paragraph className={styles.paragraphStyle}>
                            Contributors should work to describe experiments that are consistent with particular theories, and falsify competing theories.
                        </Paragraph>
                        <Paragraph className={styles.paragraphStyle}>
                            This topic is part of the Consciousness Consensus Project.
                        </Paragraph>
                        <Paragraph className={styles.paragraphStyle}>
                            <div><strong>Edit summary : </strong> Typo fixes </div>
                            <div><strong>Submitter Nick Name : </strong> Nomi </div>
                        </Paragraph>
                        <div className={styles.modalFooter}>
                            <Button size={'large'} type="primary" className="btn-orang" onClick={handleOk}> Submit Update </Button>
                            <Button size={'large'} className={styles.modalCancelBtn} onClick={handleCancel}> Cancel </Button>
                        </div>
                    </Modal>
                </Form>
            </Card>  
            </div>
        </>
    );
  };
  
  export default StatementUpdate;