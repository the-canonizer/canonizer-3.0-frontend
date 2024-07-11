import { Typography } from "antd";
import styles from ".././campHistory.module.scss";

const { Title } = Typography;
import moment from "moment";
import Link from "next/link";
const CampHistory = ({ campStatement, topicNamespaceId }: any) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  const validUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

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
        Edit Summary :{" "}
        <span className={styles.updateSurveyPrj}>{campStatement?.note}</span>
      </Title>
      <Title level={5}>
        Camp About URL :{" "}
        <span className={styles.updateSurveyPrj}>
          {campStatement?.camp_about_url &&
            validUrl(campStatement?.camp_about_url) && (
              <Link href={campStatement?.camp_about_url}>
                <a target="_blank">{campStatement?.camp_about_url}</a>
              </Link>
            )}
        </span>
      </Title>

      <Title level={5}>
        Camp About Nickname :{" "}
        <span>
          <Link
            href={`/user/supports/${
              campStatement?.camp_about_nick_id || ""
            }?canon=${topicNamespaceId || ""}`}
            passHref
          >
            <a>{campStatement?.camp_about_nick_name}</a>
          </Link>
        </span>
      </Title>

      <Title level={5}>
        Submitter Nickname :{" "}
        <span>
          <Link
            href={{
              pathname: `/user/supports/${
                campStatement?.submitter_nick_id || ""
              }`,
              query: {
                canon: topicNamespaceId || "",
              },
            }}
            passHref
          >
            <a>{campStatement?.submitter_nick_name}</a>
          </Link>
        </span>
      </Title>
      <Title level={5}>
        Disable Additional Sub Camps :{" "}
        <span>{campStatement?.is_disabled == 1 ? "Yes" : "No"}</span>
      </Title>
      <Title level={5}>
        Single Level Camps Only :{" "}
        <span>{campStatement?.is_one_level == 1 ? "Yes" : "No"}</span>
      </Title>
      <Title level={5}>
        Camp Archived :{" "}
        <span>{campStatement?.is_archive == 1 ? "Yes" : "No"}</span>
      </Title>
      <Title level={5}>
        Submitted On : <span>{covertToTime(campStatement?.submit_time)}</span>
      </Title>

      <Title level={5}>
        Go Live Time : <span>{covertToTime(campStatement?.go_live_time)}</span>
      </Title>
      {campStatement?.object_reason && (
        <Title level={5}>
          Object Reason : <span>{campStatement?.object_reason}</span>
        </Title>
      )}
      {campStatement?.objector_nick_name && (
        <Title level={5}>
          Objector Nickname :{" "}
          <span>
            <Link
              href={`/user/supports/${
                campStatement?.objector_nick_id || ""
              }?canon=${topicNamespaceId || ""}`}
              passHref
            >
              <a>{campStatement?.objector_nick_name}</a>
            </Link>
          </span>
        </Title>
      )}
      <Title level={5}>
        Camp Leader :{" "}
        <span>
          {campStatement && campStatement?.camp_leader_nick_name ? (
            <>
              <Link
                href={{
                  pathname: `/user/supports/${
                    campStatement?.camp_leader_nick_id || ""
                  }`,
                  query: {
                    canon: topicNamespaceId || "",
                  },
                }}
                passHref
              >
                <a>{campStatement?.camp_leader_nick_name}</a>
              </Link>
            </>
          ) : (
            <>No</>
          )}
        </span>
      </Title>
    </>
  );
};

export default CampHistory;
