
import React, { useState } from 'react';
import { Button, Row, Col, Tabs, Typography } from "antd";
import styles from "./recentActivities.module.scss";

const { TabPane } = Tabs;
const { Title } = Typography;

const OperationsSlot = {
    left: <Title level={3}>Recent Activities</Title>,
};
const options = ['left', 'right'];

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
                        Content of Tab Pane 1
                    </TabPane>
                    <TabPane tab="Threads" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </div>
        </>
    );
};