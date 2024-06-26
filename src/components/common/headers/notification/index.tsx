import { Fragment } from "react";
import { Dropdown, Badge, Card, Typography } from "antd";
import Link from "next/link";
import { BellOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import Lists from "src/components/ComponentPages/Notifications/UI/List";
import { RootState } from "src/store";

import NotificationSwitch from "./switch";

const Notifications = () => {
  const { count, list } = useSelector((state: RootState) => {
    return {
      count: state.notifications.headerNotification.count,
      list: state.notifications.headerNotification.list,
    };
  });

  const notificationDropdown = (
    <Card
      className={`z-50 p-4 rounded-lg relative max-w-screen-sm min-w-80 w-96 [&_.ant-card-head]:p-0 [&_.ant-card-head-title]:w-full [&_.ant-card-head-title]:py-0 [&_.ant-card-body]:p-0`}
      title={
        <div className="grid grid-cols-2 justify-betweens items-center w-full">
          <Typography.Paragraph
            className="text-base capitalize font-medium text-canBlack mb-0 block"
            id="notification-title"
          >
            notifications
          </Typography.Paragraph>
          <NotificationSwitch />
        </div>
      }
      actions={[
        <Link href="/notifications" passHref key="view_all">
          <a
            id="view-all-btn"
            className="!text-canBlack font-medium hover:!text-canBlue"
          >
            View All
          </a>
        </Link>,
      ]}
    >
      <Lists list={list} />
    </Card>
  );

  return (
    <Fragment>
      <Dropdown
        menu={{}}
        overlay={notificationDropdown}
        trigger={["click"]}
        placement="bottomRight"
        className="z-50"
      >
        <Badge
          count={count}
          color="orange"
          size="small"
          className="text-xl text-canBlue font-medium cursor-pointer"
          data-testid="clickable"
        >
          <BellOutlined className="" />
        </Badge>
      </Dropdown>
    </Fragment>
  );
};

export default Notifications;
