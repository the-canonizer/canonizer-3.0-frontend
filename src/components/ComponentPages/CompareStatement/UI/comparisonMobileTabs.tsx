import { Tabs } from "antd";
import React from "react";
const ComparisonMobileTabs = () => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        centered
        className="comparision-mobile-tabs live-tab "
      >
        <Tabs.TabPane
          className="comparision-tab-content"
          tab={
            <>
              <p>16 Feb. 2024</p>
              <span>04:36 PM </span>
            </>
          }
          key="1"
        >
          Content of Tab Pane 1
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <>
              <p>16 Feb. 2024</p>
              <span>04:36 PM </span>
            </>
          }
          key="2"
        >
          Content of Tab Pane 2
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default ComparisonMobileTabs;
