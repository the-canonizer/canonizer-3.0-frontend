import moment from "moment";
import Link from "next/link";

const TopicHistory = ({ campStatement, topicNamespaceId }: any) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  return (
    <>
      <p className="mb-[10px]">
        Topic Name:<span>{campStatement?.topic_name}</span>
      </p>
      <p className="font-semibold mb-2.5">Updates</p>

      <p>
        Canon:<span>{campStatement?.canon}</span>
      </p>
      <p>
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
        Going live on :<span>{covertToTime(campStatement?.go_live_time)}</span>
      </p>
    </>
  );
};

export default TopicHistory;
