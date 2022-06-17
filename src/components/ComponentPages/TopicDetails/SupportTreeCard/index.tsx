import CustomButton from "../../../common/button";
import { Card, Button, Typography, List, Collapse, Popover } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";

const { Paragraph } = Typography;

const { Panel } = Collapse;

const supportContent = (
  <>
    <div className={styles.addSupportText}>
      <p>
        Supporters can delegate their support to others. Direct supporters
        receive email notifications of proposed camp changes, while delegated
        supporters don’t. People delegating their support to others are shown
        below and indented from their delegates in an outline form. If a
        delegate changes camp, everyone delegating their support to them will
        change camps with them.
      </p>
    </div>
  </>
);

const SupportTreeCard = ({ handleLoadMoreSupporters }) => {
  const { campSupportingTree } = useSelector((state: RootState) => ({
    campSupportingTree: state?.topicDetails?.campSupportingTree,
  }));
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
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
        extra={
          <Popover content={supportContent} placement="left">
            <i className="icon-info tooltip-icon-style"></i>
          </Popover>
        }
      >
        <Paragraph>
          Total Support for This Camp (including sub-camps):
          <span className="number-style">65.4</span>
        </Paragraph>
        <List className={"can-card-list "}>
          {campSupportingTree?.length &&
            campSupportingTree.map((supporter, index) => {
              return (
                <List.Item
                  key={index}
                  onClick={() => {
                    localStorage.setItem("publicUserId", supporter.id);
                    localStorage.setItem(
                      "topicRecord",
                      JSON.stringify(topicRecord)
                    );
                    localStorage.setItem("namespace_name_id", "1");
                  }}
                >
                  <Link href="/userProfile">
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
        <Link href="/manageSupport">
          <a>
            <div className="topicDetailsCollapseFooter">
              <CustomButton className="btn-orange">
                Directly Join or Manage Support
              </CustomButton>
            </div>
          </a>
        </Link>
      </Panel>
    </Collapse>
  );
};
export default SupportTreeCard;
