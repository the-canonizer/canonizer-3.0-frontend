
import React, { useState } from 'react';
import { Button, Row, Col, Tabs, Typography, Tag, List } from "antd";
import styles from "./recentActivities.module.scss";
import { RightOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
    left: <Title level={3}>Recent Activities</Title>,
};
const options = ['left', 'right'];

const data = [
    <><Link href="#"><Text>More Intelligence Better </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Mind-Brain Identity </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Consciousness fundamental </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Technological Improvement </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Qualitative Present </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Holistic Panexperientiali </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Embrace New Technology </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Abortion Rights </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Biological naturalism </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Integrated Information </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Qualia are Material Qualities </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>More Intelligence Better </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Orch OR </Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>More Intelligence Better</Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
    <><Link href="#"><Text>Orch OR</Text><Text className={styles.secondary} type="secondary"><i className='icon-calendar'></i>Jun 23, 2012, 2:25:02 AM</Text></Link></>,
];

export default function RecentActivities() {
    const [position, setPosition] = React.useState(['left', 'right']);

    const slot = React.useMemo(() => {
        if (position.length === 0) return null;

        return position.reduce(
            (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
            {},
        );
    }, [position]);
    return (
        <>
            <div className={styles.wrap}>
                <Tabs className={styles.topicTabs} defaultActiveKey="1" tabBarExtraContent={slot}>
                    <TabPane tab="Topics/Camps" key="1">
                        <List
                            className={styles.list}
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
                    </TabPane>
                    <TabPane tab="Threads" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};