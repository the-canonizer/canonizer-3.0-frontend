import React from 'react';
import { Typography, List, Select, Tag, Button } from 'antd';
import styles from "./topicsList.module.scss";
import { RightOutlined } from '@ant-design/icons';


const Option = Select;
const { Title, Link, Text } = Typography;

const data = [
    <><Link href="#"><Text className={styles.text}>Theories of Consciousness </Text><Tag className={styles.tag}>61.49</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>God </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Hard Problem </Text><Tag className={styles.tag}>32.69</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Religious Preference </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Technological Improvement </Text><Tag className={styles.tag}>27.69</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Human Gen. Eng. is Wrong </Text><Tag className={styles.tag}>23</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Friendly AI Importance </Text><Tag className={styles.tag}>22</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Embrace New Technology </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Abortion Rights </Text><Tag className={styles.tag}>19.75</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Human Accomplishment </Text><Tag className={styles.tag}>19</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Public Sex Education </Text><Tag className={styles.tag}>16</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Is WikiLeaks Good? </Text><Tag className={styles.tag}>16</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>More Intelligence Better </Text><Tag className={styles.tag}>15.74</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Value Long Life </Text><Tag className={styles.tag}>13</Tag></Link></>,
    <><Link href="#"><Text className={styles.text}>Exclusive LDS Weddings </Text><Tag className={styles.tag}>47.13</Tag></Link></>,
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