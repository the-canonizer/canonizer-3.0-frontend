import { Fragment } from "react";
import { Typography, Collapse, Popover } from "antd";
import { useSelector } from "react-redux";

import styles from "../topicDetails.module.scss";

import SocialShareUI from "../../../common/socialShare";
import { RootState } from "src/store";
import { isServer } from "../../../../utils/generalUtility";

const { Paragraph } = Typography;
const { Panel } = Collapse;

const supportContent = (
  <Fragment>
    <div className={styles.addSupportText}>
      <Paragraph>Share current topic/camp on social media.</Paragraph>
    </div>
  </Fragment>
);

const SocialShareCard = ({}) => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  return (
    <Fragment>
      <Collapse
        defaultActiveKey={["9"]}
        expandIconPosition="right"
        className="topicDetailsCollapse"
      >
        <Panel
          header={<h3>Social Share</h3>}
          key="9"
          extra={
            <Popover content={supportContent} placement="left">
              <i className="icon-info tooltip-icon-style"></i>
            </Popover>
          }
        >
          <SocialShareUI
            campName={campRecord?.camp_name}
            campUrl={!isServer() && window?.location?.href}
          />
        </Panel>
      </Collapse>
    </Fragment>
  );
};

export default SocialShareCard;
