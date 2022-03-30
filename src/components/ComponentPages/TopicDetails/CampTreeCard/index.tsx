import { Card, Checkbox, Typography } from "antd";
import styles from "../campTree.module.scss";
import CampTree from "../CampTree";
import Link from "next/link";

const CampTreeCard = ({ scrollToCampStatement, getSelectedNode, reqBody }) => {
  return (
    <Card
      className={"ctCard canCard " + styles.ctCard}
      title={
        <div className="cardHeader">
          <h3 className={"mb-0 " + styles.campTreeHeading}>
            Canonizer Sorted Camp Tree
          </h3>{" "}
        </div>
      }
      extra={
        <div className="cardActions">
          <Checkbox className={"chexkboxLabel " + styles.chexkboxLabel}>
            Subscribe
          </Checkbox>
          <Link
            href={{
              pathname: "/addnews",
              query: reqBody,
            }}
          >
            <a className={styles.addNew}>
              <i className={"icon-fi-document " + styles.iconMr} /> Add News
            </a>
          </Link>
        </div>
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
