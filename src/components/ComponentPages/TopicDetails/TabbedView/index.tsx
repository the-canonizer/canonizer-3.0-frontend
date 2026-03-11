import React from "react";
import { Tabs } from "antd";
import styles from "./tabbedView.module.scss";
import RespondTab from "./RespondTab";
import AIAnalysisTab from "./AIAnalysisTab";
import PositionsTab from "./PositionsTab";

const { TabPane } = Tabs;

interface TabbedViewProps {
  campStatement: any;
  campRecord: any;
  tree: any; // tree[0] — the tree data object keyed by camp_id
}

const TabbedView = ({ campStatement, campRecord, tree }: TabbedViewProps) => {
  return (
    <div className={styles.tabbedViewWrapper}>
      <Tabs defaultActiveKey="respond" destroyInactiveTabPane={false}>
        <TabPane tab="Respond" key="respond">
          <RespondTab
            campStatement={campStatement}
            campRecord={campRecord}
          />
        </TabPane>
        <TabPane tab="AI Analysis" key="ai-analysis">
          <AIAnalysisTab />
        </TabPane>
        <TabPane tab="Positions" key="positions">
          <PositionsTab tree={tree} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabbedView;
