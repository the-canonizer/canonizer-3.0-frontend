import React, { useState } from "react";
import { Typography, Button, Tabs } from "antd";

import styles from "./campList.module.scss";

const { Title, Text } = Typography;

const { TabPane } = Tabs;

export default function CampList() {
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <Title level={5}>
            <Text>Topic :</Text> Theories of Consciousness
          </Title>
          <Title level={5}>
            <Text>Camp :</Text>{" "}
            <Text className={styles.blueText}>
              Agreement / Approachable Via Science / Representational Qualia
            </Text>
          </Title>
        </div>
        <div className={styles.btnGroup}>
          <Button size="large" className={styles.createBtn}>
            <i className="icon-topic"></i>Create New Topic
          </Button>
          <Button size="large" className={styles.createBtn}>
            <i className="icon-topic"></i>Create New Camp
          </Button>
        </div>
        <div className={styles.campStatement}>
          <div className={styles.tabHead}>
            <div className={styles.filterOt}>
              <Title level={4}>Camp Statement History</Title>
              <ul className={styles.filters}>
                <li className={styles.active}>
                  <a href="#">View All</a>
                </li>
                <li>
                  <a href="#">
                    <span
                      style={{ backgroundColor: "#EF5E5E" }}
                      className={styles.block}
                    ></span>
                    Objected
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span
                      style={{ backgroundColor: "#12C879" }}
                      className={styles.block}
                    ></span>
                    Live
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span
                      style={{ backgroundColor: "#FFDD00" }}
                      className={styles.block}
                    ></span>
                    Not Live
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span
                      style={{ backgroundColor: "#4484CE" }}
                      className={styles.block}
                    ></span>
                    Old
                  </a>
                </li>
              </ul>
            </div>
            <Button>Compare Statements</Button>
          </div>
        </div>
      </div>
    </>
  );
}
