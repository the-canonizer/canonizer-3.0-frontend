import React, { useState } from "react";
import { Button, Row, Col, Tabs, Typography, Tag, List } from "antd";
import styles from "./recentActivities.module.scss";
import { RightOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};
const options = ["left", "right"];

const data = [
  <>
    <Link href="#">
      <>
        <Text className={styles.text}>More Intelligence Better </Text>
        <Text className={styles.secondary} type="secondary">
          <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
        </Text>
      </>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Mind-Brain Identity </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Consciousness fundamental </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Technological Improvement </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Qualitative Present </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Holistic Panexperientiali </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Embrace New Technology </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Abortion Rights </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Biological naturalism </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Integrated Information </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Qualia are Material Qualities </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>More Intelligence Better </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Orch OR </Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>More Intelligence Better</Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
  <>
    <Link href="#">
      <Text className={styles.text}>Orch OR</Text>
      <Text className={styles.secondary} type="secondary">
        <i className="icon-calendar"></i> Jun 23, 2012, 2:25:02 AM
      </Text>
    </Link>
  </>,
];

export default function RecentActivities() {
  const [position, setPosition] = React.useState(["left", "right"]);

  const slot = React.useMemo(() => {
    if (position.length === 0) return null;

        return position.reduce(
            (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
            {},
        );
    }, [position]);
    return (
        <>
            <div className={styles.listCard}>
                <Tabs className={`${styles.listCardTabs} recentActivities_listCardTabs`} defaultActiveKey="1" tabBarExtraContent={slot}>
                    <TabPane tab="Topics/Camps" key="1">
                        <List className={styles.listWrap}
                            footer={
                                <div className={styles.footer}>
                                    <Link href="#" className={styles.viewAll}>
                                        <Text>View All Topics</Text>
                                        <i className="icon-angle-right"></i>
                                    </Link>
                                </div>
                            }
                            bordered={false}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item className={styles.listItem}>
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
}
