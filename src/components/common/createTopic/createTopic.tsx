import React from 'react';
import { Typography, Button, Divider, Collapse, Select, Radio, Space } from 'antd';
import styles from "./createTopic.module.scss";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;
const { Option } = Select;


function callback(key) {
    console.log(key);
}



const CreateTopic = () => {

    return (
        <>
            <div className={styles.wrap}>
                <Button size='large' className={styles.createBtn}>
                    <i className='icon-topic'></i>Create New Topic
                </Button>
                <Divider />
                <Collapse className={styles.accordian} expandIconPosition='right' expandIcon={() => <div className={styles.IconAngle}><i className='icon-angle-up'></i></div>} bordered={false} defaultActiveKey={['1']} onChange={callback}>
                    <Panel header={<span className={styles.title}>Canonizer</span>} key="1">
                        <Title level={5} className={styles.algoText}>Canonizer Algorithm:</Title>
                        <Select size='large' className={styles.algoSelect} defaultValue="One Person One Vote">
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                                Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                        <Paragraph className={styles.algoInfo}><i className='icon-fish-bones'></i> Algorithm Information</Paragraph>
                    </Panel>
                    <Panel header={<span className={styles.title}>As of</span>} key="2">
                        <Radio.Group>
                            <Space direction="vertical">
                                <Radio value={1}>Include review</Radio>
                                <Radio value={2}>Default</Radio>
                                <Radio value={3}>As of date</Radio>
                            </Space>
                        </Radio.Group>
                    </Panel>
                </Collapse>
            </div>
        </>
    );
}

export default CreateTopic;