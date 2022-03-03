import { Card, Button, Typography, List  } from "antd";

const {Paragraph} = Typography;

const SupportTreeCard = () => {
    return (
     
        <Card className="canCard" title={<div className="cardHeader"> <h3>Support Tree for "Agreement" Camp</h3></div>} 
        extra={<div className="cardActions"> <i className="icon-info tooltip-icon-style"></i></div>}
        actions={[
          <div className="card-actions-wrapper">
            <Button className="support-btn-style">Directly Join or Manage Support</Button>
          </div>
        ]}
        >
          <Paragraph>
              Total Support for This Camp (including sub-camps): <span className="number-style">65.4</span>
          </Paragraph>
          <List className={"can-card-list "}>
              <List.Item>
                <a href="#">1:Rohit_Talentelgia1 <span className="number-style">1</span></a> 
              </List.Item>
              <List.Item>
                <a href="#">1:jahoward11 <span className="number-style">1</span></a> 
              </List.Item>
              <List.Item>
                <a href="#">1:Ash <span className="number-style">1</span></a> 
              </List.Item>
          </List>
          <Button type="primary" ghost className="load-more-btn"> Load More </Button>
        </Card>


    );
}
export default SupportTreeCard;