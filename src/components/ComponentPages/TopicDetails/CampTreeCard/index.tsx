import { Collapse } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";

import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";

import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";

const { Panel } = Collapse;

const CampTreeCard = ({ scrollToCampStatement, getSelectedNode }) => {
  const router = useRouter();
  const isLogin = useAuthentication();

  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        header={<h3>Canonizer Sorted Camp Tree</h3>}
        key="1"
        extra={
          <>
            <div
              className="ant-checkbox-wrapper"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Link
                href={
                  isLogin ? router.asPath.replace("topic", "addnews") : "/login"
                }
              >
                <a
                  className={styles.addNew}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <i className={"icon-fi-document " + styles.iconMr} />
                  Add News
                </a>
              </Link>
            </div>
          </>
        }
      >
        <CampTree
          scrollToCampStatement={scrollToCampStatement}
          getSelectedNode={getSelectedNode}
        />
      </Panel>
    </Collapse>
  );
};
export default CampTreeCard;
