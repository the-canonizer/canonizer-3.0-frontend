import { Card, Button, Descriptions } from "antd";

const CurrentCampCard = () => {
  return (
    <Card
      className="canCard"
      title={
        <div className="cardHeader">
          {" "}
          <h3>Current Camp Record</h3>
        </div>
      }
      actions={[
        <div className="card-actions-wrapper">
          <Button className="edit-btn-style">Manage/Edit This Topic</Button>
        </div>,
      ]}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Camp Name"> Agreement</Descriptions.Item>
        <Descriptions.Item label="Keywords">
          consciousness, mind, theories{" "}
        </Descriptions.Item>
        <Descriptions.Item label="Camp About URL"> </Descriptions.Item>
        <Descriptions.Item label="Camp About Nick Name">
          {" "}
          No nickname associated{" "}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default CurrentCampCard;
