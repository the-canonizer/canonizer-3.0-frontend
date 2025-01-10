import moment from "moment";
import Link from "next/link";
import { commaSeparated } from "src/utils/generalUtility";

const TopicHistory = ({ campStatement, topicNamespaceId }: any) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  return (
    <div id="topic-history-container">
      <p className="mb-[10px] break-all">
        Topic Name:<span>{campStatement?.topic_name}</span>
      </p>
      <p className="font-semibold mb-2.5">UPDATES</p>
      <p>
        Canon:{" "}
        <span>
          {campStatement?.namespace &&
            campStatement?.namespace
              ?.replace(/^\/|\/$/g, "")
              ?.replace(/\//g, " > ")}
        </span>
      </p>
      <p className="break-all">
        Edit summary:<span>{campStatement?.note}</span>
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
          Object Reason :<span> {campStatement?.object_reason}</span>
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
              <a> {campStatement?.objector_nick_name}</a>
            </Link>
          </span>
        </p>
      )}
      <p>
        {campStatement &&
        (campStatement?.status == "live" ||
          campStatement?.status == "old" ||
          campStatement?.status == "objected")
          ? "Go Live Time"
          : "Going live on"}{" "}
        :<span>{covertToTime(campStatement?.go_live_time)}</span>
      </p>
      <p>
        Topic Tag{"(s)"}:
        <span>
          {campStatement?.tags?.map((tag, index) => {
            let lastIndex = index + 1 === campStatement?.topic_tags?.length;
            return commaSeparated(tag?.title, lastIndex);
          })}
        </span>
      </p>
      <p>
        Hide Rank:
        <span>{campStatement?.is_rank_hidden === 1 ? "Yes" : "No"}</span>
      </p>
    </div>
  );
};

export default TopicHistory;
