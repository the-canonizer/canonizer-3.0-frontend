import { Fragment } from "react";
import { Card, Typography, Spin, Pagination } from "antd";

import styles from "./Notifications.module.scss";

import SideBar from "../../CampForum/UI/sidebar";
import Lists from "./List";

const { Title } = Typography;

const NotificationsListUI = ({
  list,
  isLoading,
  page,
  onViewMoreClick,
  total,
  per_page,
}) => {
  return (
    <Fragment>
      <SideBar />
      <div className="pageContentWrap">
        <Spin spinning={isLoading} size="large">
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
            />
          </Card>
        </Spin>
      </div>
    </Fragment>
  );
};

export default NotificationsListUI;
