import { Typography, Pagination, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import styles from "./Notifications.module.scss";

import Lists from "./List";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import { Fragment } from "react";

const { Title } = Typography;

const NotificationsListUI = ({
  list,
  isLoading,
  page,
  onViewMoreClick,
  total,
  per_page,
  onBackClick,
  onAllReadClick,
}) => {
  return (
    <CommonCards
      title={
        <Title level={3} className="flex justify-start items-center">
          <Button
            onClick={onBackClick}
            type="link"
            className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
          >
            <LeftOutlined />
          </Button>
          Notifications
        </Title>
      }
      className="bg-white mb-6 border-0 [&_.ant-card-head]:border-0"
      id="card-title"
      extra={
        <Fragment>
          <Button
            onClick={onAllReadClick}
            type="link"
            className="mr-2 text-canBlue hover:text-canHoverBlue font-medium text-lg"
          >
            Mark all as read
          </Button>
        </Fragment>
      }
    >
      <div className="grid">
        <div className=""></div>
        <div className="">
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
        </div>
      </div>
    </CommonCards>
  );
};

export default NotificationsListUI;
