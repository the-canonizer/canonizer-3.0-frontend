import CustomButton from "@/components/common/button";
import { Card, Button, Typography, List, Collapse } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Paragraph } = Typography;

const { Panel } = Collapse;

const SupportTreeCard = ({ handleLoadMoreSupporters }) => {
  const { campSupportingTree } = useSelector((state: RootState) => ({
    campSupportingTree: state?.topicDetails?.campSupportingTree,
  }));
  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        header={<h3>Support Tree for &quot;Agreement&quot; Camp</h3>}
        key="1"
        extra={<i className="icon-info tooltip-icon-style"></i>}
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
        {campSupportingTree?.length && (
          <CustomButton
            type="primary"
            ghost
            className="load-more-btn"
            onClick={() => {
              handleLoadMoreSupporters();
            }}
          >
            Load More
          </CustomButton>
        )}
        <div className="topicDetailsCollapseFooter">
          <CustomButton className="btn-orange">
            Directly Join or Manage Support
          </CustomButton>
        </div>
      </Panel>
    </Collapse>
  );
};
export default SupportTreeCard;
