import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Button, Drawer } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../../TopicDetails/NewsFeedsCard";
import styles from "../../../../hoc/layout/layout.module.scss";

export default function HomeSideBar({ onCreateCamp = () => {} }) {
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

  return (
    <>
      {" "}
      {typeof window !== "undefined" && window.innerWidth > 767 ? (
        <TopicsFilter onCreateCamp={onCreateCamp} />
      ) : (
        <>
          <Button type="primary" onClick={showDrawer} className="btnFilter">
            <AppstoreAddOutlined />
          </Button>
          <Drawer
            title="Filters"
            placement="right"
            onClose={onClose}
            visible={visible}
          >
            <TopicsFilter onCreateCamp={onCreateCamp} />
          </Drawer>
        </>
      )}
      {typeof window !== "undefined" &&
        window.innerWidth > 767 &&
        router.asPath.includes("topic") && (
          <>
            {<CampRecentActivities />}
            {!!newsFeed?.length && <NewsFeedsCard newsFeed={newsFeed} />}
          </>
        )}
    </>
  );
}
