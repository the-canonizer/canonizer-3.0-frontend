//import CustomButton from "@/components/common/button";
import CustomButton from "../../../common/button";
import { Card, Button, Typography, List, Popover } from "antd";
import styles from "../topicDetails.module.scss";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const { Paragraph } = Typography;
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
  return (
    <Card
      className="canCard"
      title={<h3>Support Tree for &quot;Agreement&quot; Camp</h3>}
      extra={
        <Popover content={supportContent} placement="left">
          <i className="icon-info"></i>
        </Popover>
      }
      actions={[
        <>
          <CustomButton className="btn-orange">
            Directly Join or Manage Support
          </CustomButton>
        </>,
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
    </Card>
  );
};
export default SupportTreeCard;
