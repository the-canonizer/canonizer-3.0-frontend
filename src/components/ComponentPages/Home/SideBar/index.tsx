import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import { RootState } from "src/store";
import TopicsFilter from "../../../common/topicsFilter";
import TopicsFilterWithDrawer from "../../../common/topicsFilter/filterWithTree";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../../TopicDetails/NewsFeedsCard";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { setShowDrawer } from "src/store/slices/filtersSlice";

export default function HomeSideBar({
  onCreateCamp = () => {},
  getTreeLoadingIndicator,
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  backGroundColorClass,
}: any) {
  const { drawerShow } = useSelector((state: RootState) => ({
    drawerShow: state?.filters?.showDrawer,
  }));
  const { isUserAuthenticated } = useAuthentication();

  const [isAuth, setIsAuth] = useState(isUserAuthenticated);
  const [drawerIsVisible, setDrawerIsVisible] = useState(drawerShow);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => setDrawerIsVisible(drawerShow), [drawerShow]);

  const { newsFeed } = useSelector((state: RootState) => ({
    newsFeed: state?.topicDetails?.newsFeed,
  }));

  const showDrawer = () => {
    dispatch(setShowDrawer(true));
  };

  const onClose = () => {
    dispatch(setShowDrawer(false));
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
            visible={drawerIsVisible}
            className={`treeDrawer ${backGroundColorClass}`}
            closeIcon={<CloseCircleOutlined />}
            // width={720}
            height={"auto"}
            size="large"
            bodyStyle={{ paddingBottom: 80 }}
          >
            <TopicsFilterWithDrawer
              onCreateCamp={onCreateCamp}
              getTreeLoadingIndicator={getTreeLoadingIndicator}
              scrollToCampStatement={scrollToCampStatement}
              setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
              setSupportTreeForCamp={setSupportTreeForCamp}
              backGroundColorClass={backGroundColorClass}
            />
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
