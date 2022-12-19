import { Typography } from "antd";
import styles from ".././campHistory.module.scss";

const { Title } = Typography;
import moment from "moment";
import Link from "next/link";
import K from "src/constants";
const StatementHistory = ({ campStatement, topicNamespaceId }: any) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  return (
    <>
      <Title level={5}>
        Edit Summary :{" "}
        <span className={styles.updateSurveyPrj}>{campStatement?.note}</span>
      </Title>
      <Title level={5}>
        Submitted On : <span>{covertToTime(campStatement?.submit_time)}</span>
      </Title>
      <Title level={5}>
        Submitter Nick Name :{" "}
        <span>
          <Link
            href={`/user/supports/${
              campStatement?.submitter_nick_id || ""
            }?topicnum=${campStatement?.topic_num || ""}&campnum=${
              campStatement?.camp_num || ""
            }&namespace=${topicNamespaceId || ""}`}
            passHref
          >
            <a>{campStatement?.submitter_nick_name}</a>
          </Link>
        </span>
      </Title>
      {campStatement?.object_reason && (
        <Title level={5}>
          Object Reason : <span>{campStatement?.object_reason}</span>
        </Title>
      )}
      {campStatement?.objector_nick_name && (
        <Title level={5}>
          {K?.exceptionalMessages?.objectorNickNameHeading}
          <span>
            <Link
              href={`/user/supports/${
                campStatement?.objector_nick_id || ""
              }?topicnum=${campStatement?.topic_num || ""}&campnum=${
                campStatement?.camp_num || ""
              }&namespace=${topicNamespaceId || ""}`}
              passHref
            >
              <a>{campStatement?.objector_nick_name}</a>
            </Link>
          </span>
        </Title>
      )}
      <Title level={5}>
        Go Live Time : <span>{covertToTime(campStatement?.go_live_time)}</span>
      </Title>
    </>
  );
};

export default StatementHistory;
