import CustomButton from "../../../common/button";
import Link from "next/link";
import { useRouter } from "next/router";

import K from "../../../../constants";

import { Card, Typography, Button, Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";

const { Panel } = Collapse;

const CurrentTopicCard = () => {
  const router = useRouter();
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel header={<h3>Current Topic Record</h3>} key="1">
        <Descriptions column={1}>
          <Descriptions.Item label="Topic Name">
            {topicRecord && topicRecord?.topic_name}
          </Descriptions.Item>
          <Descriptions.Item label="Namespace">
            {topicRecord && topicRecord?.namespace_name}
          </Descriptions.Item>
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green">
            <Link
              href={`/topic/history/${replaceSpecialCharacters(
                router?.query?.camp[0],
                "-"
              )}`}
            >
              <a>{K?.exceptionalMessages?.manageTopicButton} </a>
            </Link>
          </CustomButton>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CurrentTopicCard;
