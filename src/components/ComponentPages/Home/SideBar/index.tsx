import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import { RootState } from "src/store";
import TopicsFilter from "../../../common/topicsFilter";
import TopicsFilterWithDrawer from "../../../common/topicsFilter/filterWithTree";
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

  const [drawerIsVisible, setDrawerIsVisible] = useState(drawerShow);
  const [isDrawerOpen, setIsDrawerOpen] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (drawerShow) {
      setIsDrawerOpen("isDrawerOpen");
    } else {
      setIsDrawerOpen("");
    }
    setDrawerIsVisible(drawerShow);
  }, [drawerShow]);

  const showDrawer = () => {
    router.query = {
      ...router.query,
      is_tree_open: drawerIsVisible ? "0" : "1",
    };

    router.replace(router, null, { shallow: true });

    dispatch(setShowDrawer(!drawerIsVisible));
  };

  const onClose = () => {
    showDrawer();
  };

  return (
    <Fragment>
      {!router?.asPath?.includes("topic") ? (
        <TopicsFilter key="topic_filter" />
      ) : (
        <Fragment>
          <Button
            key="tree-opener-btn"
            type="primary"
            onClick={showDrawer}
            className={`btnFilter drawerBtn ${isDrawerOpen}`}
          >
            Consensus Tree{" "}
            <p className="arrow">
              <span></span>
              <span></span>
              <span></span>
            </p>
          </Button>
          <Drawer
            title="Consensus Tree"
            placement="left"
            onClose={onClose}
            visible={drawerIsVisible}
            className={`treeDrawer closeIconHide ${backGroundColorClass}`}
            closeIcon={<CloseCircleOutlined />}
            height={"auto"}
            size="large"
            bodyStyle={{ paddingBottom: 80 }}
            forceRender
            data-testid="treeDrawer"
            mask={true}
            maskClosable={true}
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
    </Fragment>
  );
}
