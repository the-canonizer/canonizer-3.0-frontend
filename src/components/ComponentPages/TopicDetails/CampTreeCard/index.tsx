import { Card, Checkbox } from "antd";
import CampTree from "../CampTree";
import Link from "next/link";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import styles from "../topicDetails.module.scss";
import { useRouter } from "next/router";
import { subscribeToCampApi } from "src/network/api/campDetailApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useEffect, useState } from "react";

const CampTreeCard = ({ scrollToCampStatement, getSelectedNode }) => {
  const router = useRouter();
  const isLogin = useAuthentication();
  const { currentCampRecord } = useSelector((state: RootState) => ({
    currentCampRecord: state?.topicDetails?.currentCampRecord,
  }));

  const [checkBoxStatus, setCheckBoxStatus] = useState(
    currentCampRecord && currentCampRecord.campSubscriptionId ? true : false
  );

  useEffect(() => {
    setCheckBoxStatus(
      currentCampRecord && currentCampRecord.campSubscriptionId ? true : false
    );
  }, [currentCampRecord]);

  function onChange(e) {
    const reqBody = {
      topic_num: currentCampRecord.topic_num,
      camp_num: currentCampRecord.camp_num,
      checked: e.target.checked,
      subscription_id: currentCampRecord.campSubscriptionId,
    };

    subscribeToCampApi(reqBody).then((res) => {
      if (res?.status_code == 200) {
        setCheckBoxStatus(!checkBoxStatus);
      }
    });
  }
  return (
    <Card
      className={"ctCard canCard mb-3 " + styles.ctCard}
      title={<h3>Canonizer Sorted Camp Tree</h3>}
      extra={
        <>
          <Checkbox checked={checkBoxStatus} onChange={onChange}>
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
