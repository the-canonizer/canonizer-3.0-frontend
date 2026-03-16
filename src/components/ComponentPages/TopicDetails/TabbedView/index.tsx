import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tabs } from "antd";
import styles from "./tabbedView.module.scss";
import RespondTab from "./RespondTab";
import AIAnalysisTab from "./AIAnalysisTab";
import PositionsTab from "./PositionsTab";
import CampTreeCard from "../CampTreeCard";

const { TabPane } = Tabs;

interface TabbedViewProps {
  campStatement: any;
  campRecord: any;
  tree: any;
  topicName: string;
  getTreeLoadingIndicator: boolean;
  scrollToCampStatement: () => void;
  backGroundColorClass: string;
}

const TabbedView = ({
  campStatement,
  campRecord,
  tree,
  topicName,
  getTreeLoadingIndicator,
  scrollToCampStatement,
  backGroundColorClass,
}: TabbedViewProps) => {
  const router = useRouter();
  const statementText = campStatement?.[0]?.parsed_value || campStatement?.[0]?.value || "";

  const [, setTotalCampScoreForSupportTree] = useState(null);
  const [, setSupportTreeForCamp] = useState(null);
  const [activeKey, setActiveKey] = useState("respond");
  const [pulseRespond, setPulseRespond] = useState(false);

  // Auto-open Respond tab with pulse when ?respond=true
  useEffect(() => {
    if (router?.query?.respond === "true") {
      setActiveKey("respond");
      setPulseRespond(true);
      const timer = setTimeout(() => setPulseRespond(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [router?.query?.respond]);

  const treeTabLabel = (
    <span className={styles.treeTabLabel}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="8" x2="12" y2="14" />
        <line x1="12" y1="14" x2="6" y2="20" />
        <line x1="12" y1="14" x2="18" y2="20" />
      </svg>
      Tree
    </span>
  );

  return (
    <div className={styles.tabbedViewWrapper}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        destroyInactiveTabPane={false}
      >
        <TabPane tab="Respond" key="respond">
          <div className={pulseRespond ? styles.pulseWrap : undefined}>
            <RespondTab
              campStatement={campStatement}
              campRecord={campRecord}
            />
          </div>
        </TabPane>
        <TabPane tab="AI Analysis" key="ai-analysis">
          <AIAnalysisTab
            topicName={topicName}
            statement={statementText}
            tree={tree}
          />
        </TabPane>
        <TabPane tab="Positions" key="positions">
          <PositionsTab tree={tree} />
        </TabPane>
        <TabPane tab={treeTabLabel} key="tree">
          <CampTreeCard
            getTreeLoadingIndicator={getTreeLoadingIndicator}
            scrollToCampStatement={scrollToCampStatement}
            setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
            setSupportTreeForCamp={setSupportTreeForCamp}
            backGroundColorClass={backGroundColorClass}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabbedView;
