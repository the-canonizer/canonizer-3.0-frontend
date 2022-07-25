import { Fragment } from "react";
import { Card, Typography, Button, Spin, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import styles from "./Notifications.module.scss";

import SideBar from "../../CampForum/UI/sidebar";
import Lists from "./List";

const { Title, Text } = Typography;

const NotificationsListUI = ({
  list,
  isLoading,
  page,
  onViewMoreClick,
  total,
  per_page,
  onNotifyClick,
}) => {
  const LoadMoreTopics = (
    <div className="text-center">
      {page < total / per_page && (
        <Button className={styles.viewAll} onClick={onViewMoreClick}>
          <Text>View More</Text>
          {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
        </Button>
      )}
    </div>
  );

  return (
    <Fragment>
      <SideBar />
      <div className="pageContentWrap">
        <Card
          title={
            <Title level={3} className={styles.cardTitle}>
              Notifications
            </Title>
          }
          className={styles.notify_card}
          id="card-title"
        >
          <Lists
            list={list}
            isFooter={true}
            LoadMoreTopics={
              <Pagination
                current={page}
                total={total}
                pageSize={per_page}
                responsive={true}
                showSizeChanger={false}
                onChange={onViewMoreClick}
                hideOnSinglePage={true}
                className={styles.listPagination}
              />
            }
            onNotifyClick={onNotifyClick}
          />
        </Card>
      </div>
    </Fragment>
  );
};

export default NotificationsListUI;
