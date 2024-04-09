import Link from "next/link";
import { useRouter } from "next/router";
import { Descriptions, Collapse, Popover } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import Image from "next/image";

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

const CurrentTopicCard = ({ loadingIndicator, backGroundColorClass }: any) => {
  const router = useRouter();
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
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
      className="topicDetailsCollapse printHIde"
    >
      <Panel
        className={`header-bg-color-change ${backGroundColorClass}`}
        header={
          <>
            <h3 className="cmp-title">
              {K?.exceptionalMessages?.topicRecordHeading}
            </h3>

            <div className="cmp-change-icon">
              {topicRecord?.in_review_changes > 0 &&
              campRecord?.is_archive == 0 ? (
                // <img className="change-icon" src="/images/change-icon.svg" />
                <div
                  onClick={(e) => {
                    e.stopPropagation();

                    router.push(
                      `/topic/history/${replaceSpecialCharacters(
                        router?.query?.camp[0],
                        "-"
                      )}`
                    );
                  }}
                >
                  <Popover
                    content={
                      "Some changes are currently under review in this topic."
                    }
                    placement="topLeft"
                    className={styles.infoIcon}
                  >
                    <Image
                      // className="change-icon"
                      width={20}
                      height={20}
                      src="/images/change-icon.svg"
                      alt=""
                    />
                  </Popover>
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        }
        key="1"
      >
        <Descriptions column={1} className={styles.descriptions}>
          <Descriptions.Item label="Topic Name">
            {topicRecord && topicRecord?.topic_name}
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
                }?canon=${topicRecord?.namespace_id || ""}`}
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
