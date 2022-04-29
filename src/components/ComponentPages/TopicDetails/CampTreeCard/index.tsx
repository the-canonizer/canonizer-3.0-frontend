import { Card, Checkbox, Collapse } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";

import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";
import { subscribeToCampApi } from "src/network/api/campDetailApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Panel } = Collapse;

const CampTreeCard = ({ scrollToCampStatement, getSelectedNode }) => {
  const router = useRouter();
  const isLogin = useAuthentication();
  const { currentCampRecord } = useSelector((state: RootState) => ({
    currentCampRecord: state?.topicDetails?.currentCampRecord,
  }));

  function onChange(e) {
    const reqBody = {
      topic_num: currentCampRecord.topic_num,
      camp_num: currentCampRecord.camp_num,
      checked: e.target.checked,
      subscription_id: currentCampRecord.campSubscriptionId,
    };

    subscribeToCampApi(reqBody);
  }
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
              <Checkbox
                checked={
                  currentCampRecord && currentCampRecord.campSubscriptionId
                    ? true
                    : false
                }
                onChange={onChange}
              >
                Subscribe
              </Checkbox>
            </div>
            <Link
              href={
                isLogin ? "/login" : router.asPath.replace("topic", "addnews")
              }
            >
              <a
                className={styles.addNew}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
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
      </Panel>
    </Collapse>
  );
};
export default CampTreeCard;
