import React from 'react';
import { Typography, List, Select, Tag, Button } from 'antd';
import styles from "./canonizedList.module.scss";
import { RightOutlined } from '@ant-design/icons';



const Option = Select;

const data = [
    <>Theories of Consciousness <Tag>61.49</Tag></>,
    <>God <Tag>47.13</Tag></>,
    <>Hard Problem <Tag>32.69</Tag></>,
    <>Religious Preference <Tag>47.13</Tag></>,
    <>Technological Improvement <Tag>27.69</Tag></>,
    <>Human Gen. Eng. is Wrong <Tag>23</Tag></>,
    <>Friendly AI Importance <Tag>22</Tag></>,
    <>Embrace New Technology <Tag>47.13</Tag></>,
    <>Abortion Rights <Tag>19.75</Tag></>,
    <>Human Accomplishment <Tag>19</Tag></>,
    <>Public Sex Education <Tag>16</Tag></>,
    <>Is WikiLeaks Good? <Tag>16</Tag></>,
    <>More Intelligence Better <Tag>15.74</Tag></>,
    <>Value Long Life <Tag>13</Tag></>,
    <>Exclusive LDS Weddings <Tag>47.13</Tag></>,
];


const { Title, Link } = Typography;

const CanonizedList = () => {
    return (
        <>
            <div className={styles.wrap}>
                <List
                    className={styles.list}
                    header={<div className={styles.listhead}>
                        <Title level={3}>
                            Canonized list for
                            <i className='icon-info'></i>
                        </Title>
                        <Select size='large' className={styles.selectField} defaultValue="/General/">
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>Disabled</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </div>}
                    footer={
                        <div className={styles.footer}>
                            <Link>View All Topics</Link>
                            <RightOutlined className={styles.anticonright} />
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

export default CanonizedList;