import { Card, Button, Typography, List } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Paragraph } = Typography;

const SupportTreeCard = ({ handleLoadMoreSupporters }) => {
  const { campSupportingTree } = useSelector((state: RootState) => ({
    campSupportingTree: state?.topicDetails?.campSupportingTree,
  }));
  return (
    <Card
      className="canCard"
      title={
        <div className="cardHeader">
          <h3>Support Tree for "Agreement" Camp</h3>
        </div>
      }
      extra={
        <div className="cardActions">
          <i className="icon-info tooltip-icon-style"></i>
        </div>
      }
      actions={[
        <div className="card-actions-wrapper" key="1">
          <Button className="support-btn-style">
            Directly Join or Manage Support
          </Button>
        </div>,
      ]}
    >
      <Paragraph>
        Total Support for This Camp (including sub-camps):
        <span className="number-style">65.4</span>
      </Paragraph>
      <List className={"can-card-list "}>
        {campSupportingTree?.length &&
          campSupportingTree.map((supporter, index) => {
            return (
              <List.Item key={index}>
                <Link href="#">
                  <a>
                    {supporter.name}
                    <span className="number-style">{supporter.score}</span>
                  </a>
                </Link>
              </List.Item>
            );
          })}
      </List>
      <Button
        type="primary"
        ghost
        className="load-more-btn"
        onClick={() => {
          handleLoadMoreSupporters();
        }}
      >
        Load More
      </Button>
    </Card>
  );
};
export default SupportTreeCard;
