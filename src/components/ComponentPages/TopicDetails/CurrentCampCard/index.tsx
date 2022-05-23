import { currentCampRecordConstants } from "../../../common/componentConstants";
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
          {currentCampRecordConstants?.map((description) => (
            <Descriptions.Item label={description.label} key={description.key}>
              {campRecord && campRecord[description.key]}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <div className="topicDetailsCollapseFooter">
          <Button className="btn-green">Manage/Edit This Topic</Button>
        </div>
      </Panel>
    </Collapse>
  );
};
export default CurrentCampCard;
