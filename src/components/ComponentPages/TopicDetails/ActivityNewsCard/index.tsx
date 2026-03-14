import React, { useEffect, useMemo, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Tabs } from "antd";

import { RootState } from "src/store";
import CommonCard from "src/components/shared/Card";
import CampRecentActivitiesHeader from "./pageHeader";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../NewsFeedsCard";

const { TabPane } = Tabs;

interface ActivityNewsCardProps {}

const ActivityNewsCard: React.FC<ActivityNewsCardProps> = () => {
  const router = useRouter();

  const defaultActiveKey = router.query?.tabName || "camps";

  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const [selectedTab, setSelectedTab] = useState<string>("camps");
  const [position] = useState(["left"]);

  const [userData, setUserData] = useState(loggedInUser);
  const [hasShowViewAll, setHasShowViewAll] = useState(false);

  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce((acc) => ({ ...acc }), {});
  }, [position]);

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  const onShowAllSet = (value) => {
    setHasShowViewAll(value);
  };

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
  };

  return (
    <Fragment>
      <CampRecentActivitiesHeader
        router={router}
        userData={userData}
        hasShowViewAll={hasShowViewAll}
        isActivityTab={selectedTab === "camps"}
      />
      <div className={"w-full"}>
        <CommonCard
          className={`border-0 h-100 !bg-white [&_.ant-card-body]:p-0 [&_.ant-tabs-tab-active]:!border [&_.ant-card-body]:lg:p-[24px] lg:!bg-canGray mt-3`}
        >
          <div className="bg-white border p-2 rounded-lg min-h-80">
            <Tabs
              className={`[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:w-full px-2 [&_.ant-tabs-tab-btn]:!text-canBlue [&_.ant-tabs-tab-btn]:!px-4 [&_.ant-tabs-ink-bar]:!h-[3px]`}
              defaultActiveKey={`${defaultActiveKey}`}
              tabBarExtraContent={slot}
              onChange={handleTabChange}
            >
              <TabPane tab="Camp Activities" key="camps">
                <CampRecentActivities onShowAllSet={onShowAllSet} />
              </TabPane>
              <TabPane tab="News Feed" key="news">
                <NewsFeedsCard />
              </TabPane>
            </Tabs>
          </div>
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default ActivityNewsCard;
