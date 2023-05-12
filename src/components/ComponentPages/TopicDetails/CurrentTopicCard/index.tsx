import Link from "next/link";
import { useRouter } from "next/router";
import { Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

import styles from "../topicDetails.module.scss";

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
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

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
      className="header-bg-color-change default"
        header={<h3>{K?.exceptionalMessages?.topicRecordHeading}</h3>}
        key="1"
      >
        <Descriptions column={1} className={styles.descriptions}>
          <Descriptions.Item label="Topic Name">
            {topicRecord && topicRecord?.topic_name}
          </Descriptions.Item>
          <Descriptions.Item label="Edit Summary">
            {topicRecord && topicRecord?.note}
          </Descriptions.Item>
          <Descriptions.Item label="Canon">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </Descriptions.Item>
          <Descriptions.Item label="Submitted On">
            {topicRecord && covertToTime(topicRecord?.submit_time)}
          </Descriptions.Item>
          <Descriptions.Item label="Submitter Nickname">
            {topicRecord && (
              <Link
                href={`/user/supports/${
                  topicRecord?.submitter_nick_id || ""
                }?topicnum=${topicRecord?.topic_num || ""}&campnum=${
                  topicRecord?.camp_num || ""
                }&canon=${topicRecord?.namespace_id || ""}`}
                passHref
              >
                <a>{topicRecord?.submitter_nick_name}</a>
              </Link>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Go Live Time">
            {topicRecord && covertToTime(topicRecord?.go_live_time)}
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
