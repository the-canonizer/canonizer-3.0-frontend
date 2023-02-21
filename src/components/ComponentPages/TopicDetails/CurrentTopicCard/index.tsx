import CustomButton from "../../../common/button";
import Link from "next/link";
import { useRouter } from "next/router";

import K from "../../../../constants";

import { Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import CustomSkelton from "../../../common/customSkelton";

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
