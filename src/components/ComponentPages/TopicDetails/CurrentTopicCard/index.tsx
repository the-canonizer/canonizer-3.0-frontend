import { Card, Typography, Button, Descriptions } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Paragraph, Title } = Typography;

const CurrentTopicCard = () => {
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  return (
    <Card className="canCard mb-3"
      title={
        <h3>Current Topic Record</h3>
      }
      actions={[
        <>
          <Button className="btn-green">Manage/Edit This Topic</Button>
        </>,
      ]}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Topic Name">
          {topicRecord?.length && topicRecord[0]?.topic_name}
        </Descriptions.Item>
        <Descriptions.Item label="Namespace">
          /{topicRecord?.length && topicRecord[0]?.namespace_name}/
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default CurrentTopicCard;
