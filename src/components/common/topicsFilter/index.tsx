import React from 'react';
import moment from 'moment';
import { Typography, Button, Divider, Collapse, Select, Radio, Space, Input, DatePicker, Popover } from 'antd';
import styles from "./createTopic.module.scss";
import { LeftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;
const { Option } = Select;


const infoContent = (
    <>
        <div className={styles.infoText}>
            <Title level={5}>Score Value FIlter</Title>
            <p>Duis aute irure dolor in reprehderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        </div>
    </>
);

const asContent = (
    <>
        <div className={styles.infoText}>
            <Title level={5}>Include review</Title>
            <Paragraph>Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla pariatur.</Paragraph>
            <Title level={5}>Default</Title>
            <Paragraph>Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla pariatur.</Paragraph>
            <Title level={5}>As of date</Title>
            <Paragraph>Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla pariatur.</Paragraph>
        </div>
    </>
);

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
}

function disabledDateTime() {
    return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    };
}

const CreateTopic = () => {

    return (
        <>
            <div className={styles.wrap}>
                <Button size='large' className={styles.createBtn}>
                    <i className='icon-topic'></i>Create New Topic
                </Button>
                <Divider className={styles.divider} />
                <Collapse className={styles.accordian} expandIconPosition='right' expandIcon={() => <div className={styles.IconAngle}><i className='icon-angle-up'></i></div>} bordered={false} defaultActiveKey={['1']}>
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
                        <div className={styles.filter}>
                            <Text>Filter</Text>
                            <LeftOutlined className={styles.LeftOutlined} />
                            <Input size="large" defaultValue="0.0014" />
                            <Popover className={styles.infoPop} style={{ width: '240px', borderRadius: '0', border: 'solid 1px #E6E9F1' }} placement="rightTop" content={infoContent}>
                                <i className="icon-info"></i>
                            </Popover>
                        </div>
                    </Panel>
                    <Panel header={<span className={styles.title}>As of <Popover className={styles.asContent} style={{ width: '230px', borderRadius: '0', border: 'solid 1px #E6E9F1' }} placement="rightTop" content={asContent}><i className="icon-info"></i></Popover></span>} key="2">
                        <Radio.Group>
                            <Space direction="vertical">
                                <Radio className={styles.radio} value={1}>Include review</Radio>
                                <Radio className={styles.radio} value={2}>Default</Radio>
                                <Radio className={styles.radio} value={3}>As of date</Radio>
                            </Space>
                        </Radio.Group>
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            suffixIcon={<i className='icon-calendar'></i>}
                            size={'large'}
                            className={styles.date}
                        />
                    </Panel>
                </Collapse>

            </div>
        </>
    );
}

export default CreateTopic;