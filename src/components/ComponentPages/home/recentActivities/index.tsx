
import React, { useState } from 'react';
import { Button, Row, Col, Tabs, Typography, Tag, List } from "antd";
import styles from "./recentActivities.module.scss";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
    left: <Title level={3}>Recent Activities</Title>,
};
const options = ['left', 'right'];

const data = [
    <><Link href="#"><Text>More Intelligence Better </Text></Link></>,
    <><Link href="#"><Text>Mind-Brain Identity  </Text></Link></>,
    <><Link href="#"><Text>Consciousness fundamental </Text></Link></>,
    <><Link href="#"><Text>Technological Improvement </Text></Link></>,
    <><Link href="#"><Text>Qualitative Present </Text></Link></>,
    <><Link href="#"><Text>Holistic Panexperientiali </Text></Link></>,
    <><Link href="#"><Text>Embrace New Technology </Text></Link></>,
    <><Link href="#"><Text>Abortion Rights </Text></Link></>,
    <><Link href="#"><Text>Biological naturalism </Text></Link></>,
    <><Link href="#"><Text>Integrated Information </Text></Link></>,
    <><Link href="#"><Text>Qualia are Material Qualities </Text></Link></>,
    <><Link href="#"><Text>More Intelligence Better </Text></Link></>,
    <><Link href="#"><Text>Orch OR </Text></Link></>,
    <><Link href="#"><Text>More Intelligence Better</Text></Link></>,
    <><Link href="#"><Text>Orch OR</Text></Link></>,
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