import { Card, Button, Descriptions } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const CurrentCampCard = () => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  return (
    <Card
      className="canCard mb-3"
      title={<h3>Current Camp Record</h3>}
      actions={[
        <>
          <Button className="btn-green">Manage/Edit This Topic</Button>
        </>,
      ]}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Camp Name">
          {" "}
          {campRecord?.length && campRecord[0]?.camp_name}
        </Descriptions.Item>
        <Descriptions.Item label="Keywords">
          {campRecord?.length && campRecord[0]?.key_words}
        </Descriptions.Item>
        <Descriptions.Item label="Camp About URL">
          {campRecord?.length && campRecord[0]?.camp_about_url}
        </Descriptions.Item>
        <Descriptions.Item label="Camp About Nick Name">
          {campRecord?.length && campRecord[0]?.nick_name}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default CurrentCampCard;
