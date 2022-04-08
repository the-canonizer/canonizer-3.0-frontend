import { Card, Checkbox, Typography } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";

import styles from "../topicDetails.module.scss";

const CampTreeCard = ({
  scrollToCampStatement,
  getSelectedNode,
  reqBody,
  isLogin,
}) => {
  return (
    <Card
      className={"ctCard canCard mb-3 " + styles.ctCard}
      title={<h3>Canonizer Sorted Camp Tree</h3>}
      extra={
        <>
          <Checkbox>Subscribe</Checkbox>
          <Link
            href={{
              pathname: isLogin ? "/login" : "/news/add",
              query: reqBody,
            }}
          >
            <a className={styles.addNew}>
              <i className={"icon-fi-document " + styles.iconMr} /> Add News
            </a>
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
