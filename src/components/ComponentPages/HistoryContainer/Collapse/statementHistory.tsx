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
      <p className="font-semibold mb-2.5">Updates</p>
      <p>
        Edit Summary:<span>{campStatement?.note}</span>
      </p>
      <p>
        Submitted on:<span>{covertToTime(campStatement?.submit_time)}</span>
      </p>
      <p>
        Submitted by:
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
      {campStatement?.object_reason && (
        <p>
          Object Reason : <span>{campStatement?.object_reason}</span>
        </p>
      )}
      {campStatement?.objector_nick_name && (
        <p>
          {K?.exceptionalMessages?.objectorNickNameHeading}
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
      <p>
        {campStatement &&
        (campStatement?.status == "live" || campStatement?.status == "old"||campStatement?.status=="objected")
          ? "Go Live Time"
          : "Going live on"}{" "}
        :<span>{covertToTime(campStatement?.go_live_time)}</span>
      </p>
    </>
  );
};

export default StatementHistory;
