import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button, Drawer } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import { RootState } from "src/store";
import TopicsFilter from "../../../common/topicsFilter";
import TopicsFilterWithDrawer from "../../../common/topicsFilter/filterWithTree";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../../TopicDetails/NewsFeedsCard";
import useAuthentication from "src/hooks/isUserAuthenticated";

export default function HomeSideBar({ onCreateCamp = () => {} }: any) {
  const { isUserAuthenticated } = useAuthentication();

  const [isAuth, setIsAuth] = useState(isUserAuthenticated);

  const router = useRouter();

  const { newsFeed } = useSelector((state: RootState) => ({
    newsFeed: state?.topicDetails?.newsFeed,
  }));

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => setIsAuth(isUserAuthenticated), [isUserAuthenticated]);

  return (
    <Fragment>
      {" "}
      {!router?.asPath?.includes("topic") ? (
        <TopicsFilter onCreateCamp={onCreateCamp} />
      ) : (
        <Fragment>
          <Button
            type="primary"
            onClick={showDrawer}
            className="btnFilter drawerBtn"
          >
            Canonizer Sorted Camp Tree
          </Button>
          <Drawer
            title="Canonizer Sorted Camp Tree"
            placement="left"
            onClose={onClose}
            visible={visible}
            className="treeDrawer"
            closeIcon={<CloseCircleOutlined />}
          >
            <TopicsFilterWithDrawer onCreateCamp={onCreateCamp} />
          </Drawer>
        </Fragment>
      )}
      {typeof window !== "undefined" &&
        window.innerWidth > 767 &&
        router?.asPath.includes("topic") &&
        isAuth && (
          <Fragment>
            {<CampRecentActivities />}
            {!!newsFeed?.length && <NewsFeedsCard newsFeed={newsFeed} />}
          </Fragment>
        )}
    </Fragment>
  );
}
