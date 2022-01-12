import React from 'react';
import { Typography, Button, Divider, Collapse } from 'antd';
import styles from "./createTopic.module.scss";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;

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
                <Collapse className={styles.accordian} expandIconPosition='right' expandIcon={() => <div className={styles.IconAngle}><i className='icon-angle-small-down'></i></div>} bordered={false} defaultActiveKey={['1']} onChange={callback}>
                    <Panel header={<span className={styles.title}>Canonizer</span>} key="1">
                        <Title level={2}>Canonizer Algorithm:</Title>
                    </Panel>
                    <Panel header={<span className={styles.title}>As of</span>} key="2">

                    </Panel>
                </Collapse>
            </div>
        </>
    );
}

export default CreateTopic;