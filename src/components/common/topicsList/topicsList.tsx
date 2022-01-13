import React from 'react';
import { Typography, List, Select, Tag, Button } from 'antd';
import styles from "./topicsList.module.scss";
import { RightOutlined } from '@ant-design/icons';


const Option = Select;
const { Title, Link, Text } = Typography;

const data = [
    <><Link href="#"><Text>Theories of Consciousness </Text><Tag className={styles.tag}>61.49</Tag></Link></>,
    <><Link href="#"><Text>God </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text>Hard Problem </Text><Tag className={styles.tag}>32.69</Tag></Link></>,
    <><Link href="#"><Text>Religious Preference </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text>Technological Improvement </Text><Tag className={styles.tag}>27.69</Tag></Link></>,
    <><Link href="#"><Text>Human Gen. Eng. is Wrong </Text><Tag className={styles.tag}>23</Tag></Link></>,
    <><Link href="#"><Text>Friendly AI Importance </Text><Tag className={styles.tag}>22</Tag></Link></>,
    <><Link href="#"><Text>Embrace New Technology </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text>Abortion Rights </Text><Tag className={styles.tag}>19.75</Tag></Link></>,
    <><Link href="#"><Text>Human Accomplishment </Text><Tag className={styles.tag}>19</Tag></Link></>,
    <><Link href="#"><Text>Public Sex Education </Text><Tag className={styles.tag}>16</Tag></Link></>,
    <><Link href="#"><Text>Is WikiLeaks Good? </Text><Tag className={styles.tag}>16</Tag></Link></>,
    <><Link href="#"><Text>More Intelligence Better </Text><Tag className={styles.tag}>15.74</Tag></Link></>,
    <><Link href="#"><Text>Value Long Life </Text><Tag className={styles.tag}>13</Tag></Link></>,
    <><Link href="#"><Text>Exclusive LDS Weddings </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
];

const TopicsList = () => {
    return (
        <>
            <div className={styles.wrap}>
                <List
                    className={styles.list}
                    header={<div className={styles.head}>
                        <Title level={3}>
                            Canonized list for
                            <i className='icon-info'></i>
                        </Title>
                        <Select size='large' className={styles.dropdown} defaultValue="/General/">
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>Disabled</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </div>}
                    footer={
                        <div className={styles.footer}>
                            <Link><Text className={styles.link}>View All Topics</Text> <RightOutlined className={styles.anticonright} /></Link>
                        </div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            {item}
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

export default TopicsList;