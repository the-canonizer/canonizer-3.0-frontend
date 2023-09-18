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
  viewThisVersion,
}: any) {
  const { drawerShow, filterObject, filterByScore } = useSelector(
    (state: RootState) => ({
      drawerShow: state?.filters?.showDrawer,
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const [drawerIsVisible, setDrawerIsVisible] = useState(drawerShow);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => setDrawerIsVisible(drawerShow), [drawerShow]);
  const getQueryParams = (status) => {
    let isbool = false;
    let params = "?";
    if (filterObject?.filterByScore != 0) {
      params = params + `score=${filterObject?.filterByScore}&`;
      isbool = true;
    }
    if (filterObject?.algorithm != "blind_popularity") {
      params = params + `algo=${filterObject?.algorithm}&`;
      isbool = true;
    }

    if (filterObject?.asof != "default") {
      params = params + `asof=${filterObject?.asof}&`;
      isbool = true;
    }
    if (filterObject?.asof == "bydate") {
      params = params + `asofdate=${filterObject?.asofdate}&`;
      isbool = true;
    }
    if (filterObject?.namespace_id != 1) {
      params = params + `canon=${filterObject?.namespace_id}&`;
      isbool = true;
    }

    if (viewThisVersion) {
      params = params + `viewversion=1&`;
      isbool = true;
    }
    params = params + `is_tree_open=${status}&`;
    params = params.slice(0, -1);
    return params;
  };

  const showDrawer = () => {
    router.push(
      `/topic/${router?.query?.camp[0]}/${
        router?.query?.camp[1]
      }${getQueryParams("1")}`,
      null,
      {
        shallow: true,
      }
    );

    dispatch(setShowDrawer(true));
  };

  const onClose = () => {
    router.push(
      `/topic/${router?.query?.camp[0]}/${
        router?.query?.camp[1]
      }${getQueryParams("0")}`,
      null,
      {
        shallow: true,
      }
    );

    dispatch(setShowDrawer(false));
  };

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
            className={`treeDrawer ${backGroundColorClass}`}
            closeIcon={<CloseCircleOutlined />}
            height={"auto"}
            size="large"
            bodyStyle={{ paddingBottom: 80 }}
            forceRender
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
