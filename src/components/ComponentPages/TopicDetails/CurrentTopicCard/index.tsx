import { Card, Typography, Button, Descriptions  } from "antd";

const { Paragraph, Title } = Typography;


const CurrentTopicCard = () => {
    return (
     
        <Card className="canCard" title={<div className="cardHeader"> <h3>Current Topic Record</h3></div>} 
        actions={[
          <div className="card-actions-wrapper">
            <Button className="edit-btn-style">Manage/Edit This Topic</Button>
          </div>
        ]}
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Topic Name">Theories of Consciousness</Descriptions.Item>
            <Descriptions.Item label="Namespace">/General/</Descriptions.Item>
          </Descriptions>
        </Card>


    );
}
export default CurrentTopicCard;