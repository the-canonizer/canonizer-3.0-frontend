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
      <p className="mb-[15px]">
        Camp Name:
        <span className={styles.updateSurveyPrj}>
          {campStatement?.camp_name}
        </span>
      </p>
      <p className="font-semibold mb-2.5">UPDATES</p>
      <p>
        Edit summary:<span>{campStatement?.note}</span>
      </p>
      <p>
        Camp about URL:
        <span>
          {campStatement?.camp_about_url &&
            validUrl(campStatement?.camp_about_url) && (
              <Link href={campStatement?.camp_about_url}>
                <a target="_blank">{campStatement?.camp_about_url}</a>
              </Link>
            )}
        </span>
      </p>
      <p>
        Camp about Nickname:
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
      </p>
      <p>
        Submitter nickname:
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
      </p>
      <p>
        Disable additional sub-camps:{" "}
        <span>{campStatement?.is_disabled == 1 ? "Yes" : "No"}</span>
      </p>
      <p>
        Single level Camps only:
        <span>{campStatement?.is_one_level == 1 ? "Yes" : "No"}</span>
      </p>
      <p>
        Camp archived:
        <span>{campStatement?.is_archive == 1 ? "Yes" : "No"}</span>
      </p>
      <p>
        Submitted on:<span>{covertToTime(campStatement?.submit_time)}</span>
      </p>
      <p>
        Going live on :<span>{covertToTime(campStatement?.go_live_time)}</span>
      </p>
      {!!campStatement?.parent_camp_name && (
        <p>
          Parent Camp :<span>{campStatement?.parent_camp_name}</span>
        </p>
      )}
      <p>
        Keywords :<span>{campStatement?.key_words}</span>
      </p>
      {campStatement?.object_reason && (
        <p>
          Object Reason : <span>{campStatement?.object_reason}</span>
        </p>
      )}
      {campStatement?.objector_nick_name && (
        <p>
          Objector Nickname :
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
        </p>
      )}
    </>
  );
};

export default CampHistory;
