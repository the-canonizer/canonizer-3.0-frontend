import { Button, Descriptions, Collapse } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Panel } = Collapse;

const CurrentCampCard = () => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  return (
    <Collapse
      accordion={true}
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel header={<h3>Current Camp Record</h3>} key="1">
        <Descriptions column={1}>
          <Descriptions.Item label="Camp Name">
            {" "}
            {campRecord?.length ? campRecord?.camp_name : null}
          </Descriptions.Item>
          <Descriptions.Item label="Keywords">
            {campRecord?.length ? campRecord?.key_words : null}
          </Descriptions.Item>
          <Descriptions.Item label="Camp About URL">
            {campRecord?.length ? campRecord?.camp_about_url : null}
          </Descriptions.Item>
          <Descriptions.Item label="Camp About Nick Name">
            {campRecord?.length ? campRecord?.nick_name : null}
          </Descriptions.Item>
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <Button className="btn-green">Manage/Edit This Topic</Button>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CurrentCampCard;
