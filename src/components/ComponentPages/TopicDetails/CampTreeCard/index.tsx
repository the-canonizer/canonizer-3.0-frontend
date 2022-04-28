import { Card, Checkbox, Typography, Popover } from "antd";
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
const CampTreeCard = ({ scrollToCampStatement, getSelectedNode }) => {
  const router = useRouter();
  const isLogin = useAuthentication();
  const { currentCampRecord } = useSelector((state: RootState) => ({
    currentCampRecord: state?.topicDetails?.currentCampRecord,
  }));

  function onChange(e) {
    const reqBody = {
      topic_num: currentCampRecord[0].topic_num,
      camp_num: currentCampRecord[0].camp_num,
      checked: e.target.checked,
      subscription_id: currentCampRecord[0].campSubscriptionId,
    };

    subscribeToCampApi(reqBody);
  }
  return (
    <Card
      className={"ctCard canCard mb-3 " + styles.ctCard}
      title={<h3>Canonizer Sorted Camp Tree</h3>}
      extra={
        <>
          <Checkbox
            checked={
              currentCampRecord && currentCampRecord[0]?.campSubscriptionId
                ? true
                : false
            }
            onChange={onChange}
          >
            Subscribe
          </Checkbox>
          <Link
            href={
              isLogin ? "/login" : router.asPath.replace("topic", "addnews")
            }
          >
            <a className={styles.addNew}>
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
    </Card>
  );
};
export default CampTreeCard;
