import { Checkbox, Collapse, Popover } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";

import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";

import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";
import { subscribeToCampApi } from "../../../../network/api/campDetailApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const addContent = (
  <>
    <div className={styles.addSupportText}>
      {/* <Title level={5}>Score Value </Title> */}
      <p>
        This section is a table of contents for this topic. It is in outline or
        tree form, with supporting sub camps indented from the parent camp. If
        you are in a sub camp, you are also counted in all parent camps
        including the agreement camp at the top. The numbers are canonized
        scores derived from the people in the camps based on your currently
        selected canonizer on the side bar. The camps are sorted according to
        these canonized scores. Each entry is a link to the camp page which can
        contain a statement of belief. The green line indicates the camp page
        you are currently on and the statement below is for that camp.
      </p>
    </div>
  </>
);

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
                isLogin ? router.asPath.replace("topic", "addnews") : "/login"
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

            <Popover content={addContent} placement="left">
              <i className="icon-info info-tooltip"></i>
            </Popover>
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
