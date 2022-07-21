import {
  Typography,
  Button,
  Collapse,
  Space,
  Checkbox,
  Divider,
  Tooltip,
  Tag,
} from "antd";
import styles from ".././campHistory.module.scss";

const { Panel } = Collapse;
const { Title } = Typography;
import moment from "moment";
import Link from "next/link";
const TopicHistory = ({ campStatement }) => {
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  return (
    <>
      <Title level={5}>
        Edit summary :{" "}
        <span className={styles.updateSurveyPrj}>{campStatement?.note}</span>
      </Title>
      <Title level={5}>
        Submitted on : <span>{covertToTime(campStatement?.submit_time)}</span>
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
      {campStatement?.object_reason && (
        <Title level={5}>
          Object reason : <span>{campStatement?.object_reason}</span>
        </Title>
      )}
      {campStatement?.objector_nick_name && (
        <Title level={5}>
          Object Nick Name : <span>{campStatement?.objector_nick_name}</span>
        </Title>
      )}
      <Title level={5}>
        Go live Time : <span>{covertToTime(campStatement?.go_live_time)}</span>
      </Title>
    </>
  );
};

export default TopicHistory;
