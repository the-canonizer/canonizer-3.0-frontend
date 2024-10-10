import { Fragment } from "react";
import { Card, Typography, Pagination } from "antd";

import styles from "./Notifications.module.scss";

import SideBar from "../../CampForum/UI/sidebar";
import Lists from "./List";
import CustomSkelton from "../../../common/customSkelton";

const { Title } = Typography;

const NotificationsListUI = ({
  list,
  isLoading,
  page,
  onViewMoreClick,
  total,
  per_page,
}: any) => {
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
          {isLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={10}
              stylingClass=""
              listStyle=""
              isButton={false}
            />
          ) : (
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
          )}
        </Card>
      </div>
    </Fragment>
  );
};

export default NotificationsListUI;
