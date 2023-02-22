import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Button, Drawer } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";

import { RootState } from "src/store";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../../TopicDetails/NewsFeedsCard";
import useAuthentication from "src/hooks/isUserAuthenticated";
import useHasMounted from "src/hooks/useHasMounted";

export default function HomeSideBar({ onCreateCamp = () => {} }: any) {
  const { isUserAuthenticated } = useAuthentication();
  const hasMounted = useHasMounted();

  const [isAuth, setIsAuth] = useState(isUserAuthenticated);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    if (hasMounted) {
      if (typeof window !== "undefined" && window.innerWidth > 767) {
        setIsClient(true);
      } else {
        setIsClient(false);
      }
    }
  }, [hasMounted]);

  return (
    <Fragment>
      {" "}
      {isClient ? (
        <TopicsFilter onCreateCamp={onCreateCamp} />
      ) : (
        <Fragment>
          <Button type="primary" onClick={showDrawer} className="btnFilter">
            <AppstoreAddOutlined />
          </Button>
          <Drawer
            title="Filters"
            placement="right"
            onClose={onClose}
            open={visible}
          >
            <TopicsFilter onCreateCamp={onCreateCamp} />
          </Drawer>
        </Fragment>
      )}
      {isClient && router?.asPath?.includes("topic") && isAuth && (
        <Fragment>
          {<CampRecentActivities />}
          {!!newsFeed?.length && <NewsFeedsCard newsFeed={newsFeed} />}
        </Fragment>
      )}
    </Fragment>
  );
}
