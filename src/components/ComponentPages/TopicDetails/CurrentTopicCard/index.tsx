import Link from "next/link";
import { useRouter } from "next/router";
import { Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";

import CustomButton from "src/components/common/button";
import K from "src/constants";
import { RootState } from "src/store";
import {
  changeSlashToArrow,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import CustomSkelton from "src/components/common/customSkelton";

const { Panel } = Collapse;

const CurrentTopicCard = ({ loadingIndicator }) => {
  const router = useRouter();
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  return loadingIndicator ? (
    <CustomSkelton
      titleName={K?.exceptionalMessages?.topicRecordHeading}
      skeltonFor="card"
      bodyCount={2}
      stylingClass="test"
      isButton={false}
    />
  ) : (
    <Collapse
      defaultActiveKey={[]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        header={<h3>{K?.exceptionalMessages?.topicRecordHeading}</h3>}
        key="1"
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Topic Name">
            {topicRecord && topicRecord?.topic_name}
          </Descriptions.Item>
          <Descriptions.Item label="Canon">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </Descriptions.Item>
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-green" id="manage-topic-btn">
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
