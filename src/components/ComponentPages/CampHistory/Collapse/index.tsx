import React, { ReactElement } from "react";
import {
  Typography,
  Button,
  Image,
  Collapse,
  Space,
  List,
  Checkbox,
  Divider,
} from "antd";
import styles from ".././campHistory.module.scss";

const { Panel } = Collapse;
const { Paragraph, Title, Text } = Typography;
export default function HistoryCollapse({ campStatement }) {
  return (
    <div>
      <Space
        direction="vertical"
        className={`${styles.campStatementCollapseObjectedHistory} ${styles.campStatementCollapseHistory}`}
      >
        <Collapse
          collapsible="header"
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          className="campHistoryCollapseCards campHistoryCollapseObjectedCard"
        >
          <Panel
            header={<i className="icon-uparrow"></i>}
            key="1"
            className={styles.campStatementCollapse}
            showArrow={false}
          >
            <>
              <Title level={5}>Statement :</Title>
              {campStatement?.value}
              <Divider />
            </>
          </Panel>
          <>
            <div className={styles.campCollapseSummaryWrap}>
              <div className={styles.campStatementCollapseSummary}>
                <Title level={5}>
                  Edit summary :{" "}
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.note}
                    submit_time
                  </span>
                </Title>
                <Title level={5}>
                  Submitted on : <span>{campStatement?.submit_time}</span>
                </Title>
                <Title level={5}>
                  Submitter Nick Name :{" "}
                  <span>
                    <a href="">ali_Ahmed</a>
                  </span>
                </Title>
                <Title level={5}>
                  Go live Time : <span>{campStatement?.go_live_time}</span>
                </Title>
                <Checkbox className={styles.campSelectCheckbox}>
                  Select to Compare
                </Checkbox>
              </div>
              <div className={styles.campStatementCollapseButtons}>
                <Button type="primary" className={styles.campUpdateButton}>
                  Submit Statement Update Based on This
                </Button>
                <Button type="primary" className={styles.campVersionButton}>
                  View This Version
                </Button>
              </div>
            </div>
          </>
        </Collapse>
      </Space>
    </div>
  );
}
