import { Typography, Collapse } from "antd";
// import Link from "next/link";
import styles from ".././campHistory.module.scss";

const { Title } = Typography;
import moment from "moment";
import Link from "next/link";
const CampHistory = ({ campStatement }) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  console.log("camp  data => ", campStatement);
  return (
    <>
      {!!campStatement?.parent_camp_name && (
        <Title level={5}>
          Parent Camp :{" "}
          <span className={styles.updateSurveyPrj}>
            {campStatement?.parent_camp_name}
          </span>
        </Title>
      )}
      <Title level={5}>
        Keywords :{" "}
        <span className={styles.updateSurveyPrj}>
          {campStatement?.key_words}
        </span>
      </Title>
      <Title level={5}>
        Edit summary :{" "}
        <span className={styles.updateSurveyPrj}>{campStatement?.note}</span>
      </Title>
      <Title level={5}>
        Camp About URL :{" "}
        <span className={styles.updateSurveyPrj}>
          {campStatement?.camp_about_url && (
            <Link href={campStatement?.camp_about_url}>
              <a target="_blank">{campStatement?.camp_about_url}</a>
            </Link>
          )}
          {/* {campStatement?.camp_about_url} */}
        </span>
      </Title>

      <Title level={5}>
        Submitter Nick Name :{" "}
        <span>
          <Link
            href={`/user/supports/${
              campStatement?.submitter_nick_id || ""
            }?topicnum=${campStatement?.topic_num || ""}&campnum=${
              campStatement?.camp_num || ""
            }&namespace=1`}
            passHref
          >
            <a>{campStatement?.submitter_nick_name}</a>
          </Link>
        </span>
      </Title>
      <Title level={5}>
        Submitted on : <span>{covertToTime(campStatement?.submit_time)}</span>
      </Title>

      <Title level={5}>
        Go live Time : <span>{covertToTime(campStatement?.go_live_time)}</span>
      </Title>
      {campStatement?.object_reason && (
        <Title level={5}>
          Object Reason : <span>{campStatement?.object_reason}</span>
        </Title>
      )}
      {campStatement?.objector_nick_name && (
        <Title level={5}>
          Objector Nick Name :
          <span>
            <Link
              href={`/user/supports/${
                campStatement?.objector_nick_id || ""
              }?topicnum=${campStatement?.topic_num || ""}&campnum=${
                campStatement?.camp_num || ""
              }&namespace=1`}
              passHref
            >
              <a>{campStatement?.objector_nick_name}</a>
            </Link>
          </span>
          {/* <span>{campStatement?.objector_nick_name}</span> */}
        </Title>
      )}
    </>
  );
};

export default CampHistory;
