import { Card, Typography, Button, Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Panel } = Collapse;

const CurrentTopicCard = () => {
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  return (
    <Collapse defaultActiveKey={['1']} expandIconPosition="right" className="topicDetailsCollapse">
      <Panel header={<h3>Current Topic Record</h3>} key="1">
        <Descriptions column={1}>
          <Descriptions.Item label="Topic Name">
            {topicRecord?.length && topicRecord[0]?.topic_name}
          </Descriptions.Item>
          <Descriptions.Item label="Namespace">
            /{topicRecord?.length && topicRecord[0]?.namespace_name}/
          </Descriptions.Item>
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <Button className="btn-green">Manage/Edit This Topic</Button>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CurrentTopicCard;
