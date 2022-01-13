import React from 'react';
import { Typography, List, Select, Tag, Button } from 'antd';
import styles from "./topicsList.module.scss";
import { RightOutlined } from '@ant-design/icons';


const Option = Select;
const { Title, Link, Text } = Typography;

const data = [
    <><Link href="#">Theories of Consciousness <Tag>61.49</Tag></Link></>,
    <><Link href="#">God <Tag>47.13</Tag></Link></>,
    <><Link href="#">Hard Problem <Tag>32.69</Tag></Link></>,
    <><Link href="#">Religious Preference <Tag>47.13</Tag></Link></>,
    <><Link href="#">Technological Improvement <Tag>27.69</Tag></Link></>,
    <><Link href="#">Human Gen. Eng. is Wrong <Tag>23</Tag></Link></>,
    <><Link href="#">Friendly AI Importance <Tag>22</Tag></Link></>,
    <><Link href="#">Embrace New Technology <Tag>47.13</Tag></Link></>,
    <><Link href="#">Abortion Rights <Tag>19.75</Tag></Link></>,
    <><Link href="#">Human Accomplishment <Tag>19</Tag></Link></>,
    <><Link href="#">Public Sex Education <Tag>16</Tag></Link></>,
    <><Link href="#">Is WikiLeaks Good? <Tag>16</Tag></Link></>,
    <><Link href="#">More Intelligence Better <Tag>15.74</Tag></Link></>,
    <><Link href="#">Value Long Life <Tag>13</Tag></Link></>,
    <><Link href="#">Exclusive LDS Weddings <Tag>47.13</Tag></Link></>,
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