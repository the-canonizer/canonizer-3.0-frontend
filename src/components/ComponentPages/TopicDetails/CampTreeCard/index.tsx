import { Card, Checkbox, Typography } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";

import styles from "../topicDetails.module.scss";

const { Link } = Typography;

const CampTreeCard = ({ scrollToCampStatement, getSelectedNode }) => {
  return (
    <Card
      className={"ctCard canCard mb-3 " + styles.ctCard}
      title={<h3>Canonizer Sorted Camp Tree</h3>}
      extra={
        <>
          <Checkbox>Subscribe</Checkbox>
          <Link href="#">
            <i className="icon-fi-document"></i> Add News
          </Link>
        </>
      }
    >
      <CampTree
        scrollToCampStatement={scrollToCampStatement}
        getSelectedNode={getSelectedNode}
      />
    </Card>
  );
};
export default CampTreeCard;
