import { Typography, Button, Row, Col, Popover } from "antd";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";

import Lists from "./List";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import NotificationSwitch from "components/common/headers/notification/switch";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Title } = Typography;

const getCount = (data) => {
  let readCount = 0;
  let unreadCount = 0;

  data.forEach((notification) => {
    if (notification.is_seen === 1) {
      readCount++;
    } else {
      unreadCount++;
    }
  });

  return { readCount, unreadCount };
};

const NotificationsListUI = ({
  list,
  rendredNotsList,
  isLoading,
  onBackClick,
  onAllReadClick,
  router,
  onFilterClick,
  onAllDelete,
}) => {
  const getBtnClass = (btn) => {
    let baseClass =
      "mb-5 rounded-lg py-2 min-h-[35px] h-full !text-canBlack text-base border-[#CCD4E780] hocus:bg-[#5482C833] hocus:border-[#5482C833] max-h-[40px]";
    const { filter } = router?.query || {};

    if ((filter === undefined && btn === "") || filter === btn) {
      baseClass += " bg-[#5482C833] border-[#5482C833]";
    }

    return baseClass;
  };

  const { readCount, unreadCount } = getCount(list);

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
      className="bg-white mb-6 border-0 [&_.ant-card-head]:border-0 mb-8 [&_.ant-card-extra]:p-0"
      id="card-title"
      extra={
        <div className="flex justify-between items-center">
          <Popover
            content={
              unreadCount === 0 ? "currently no unread notifications" : ""
            }
          >
            <Button
              onClick={onAllReadClick}
              type="link"
              className="text-canBlue hover:text-canHoverBlue font-medium text-md py-0"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </Popover>
        </div>
      }
    >
      <Row gutter={20}>
        <Col lg={4} md={6} xs={24}>
          <div className="px-4 flex flex-col w-full h-full">
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "0")}
              className={getBtnClass("")}
              block
            >
              All ({list?.length})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "1")}
              className={getBtnClass("1")}
              block
            >
              Read ({readCount})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "2")}
              className={getBtnClass("2")}
              block
            >
              Unread ({unreadCount})
            </SecondaryButton>
            <div
              className="mt-auto pb-14 [&_.ant-typography>small]:text-base [&_.ant-typography>small]:font-normal [&_.ant-typography>small]:text-canBlack [&_.ant-typography>small]:capitalize"
              key="div-of-switch"
            >
              <NotificationSwitch key="notificatoin-page-switch" />
            </div>
          </div>
        </Col>
        <Col lg={20} md={18} xs={24}>
          <div className="border rounded-lg py-4 px-6 w-full h-96 overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-canGrey3 scrollbar-track-canGrey2 scrollbar-thin">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={15}
                stylingClass="py-3"
                listStyle="py-2"
                isButton={false}
              />
            ) : (
              <Lists
                list={rendredNotsList}
                isFooter={false}
                LoadMoreTopics={null}
              />
            )}
          </div>
          <Popover
            content={list?.length === 0 ? "currently no notification" : ""}
          >
            <Button
              onClick={onAllDelete}
              type="link"
              className="text-canRed hover:text-canOrange font-medium text-md mt-3 py-0 float-right flex items-start justify-center"
              disabled={list?.length === 0}
            >
              <DeleteOutlined className="text-sm" />
              Delete All Notifications
            </Button>
          </Popover>
        </Col>
      </Row>
    </CommonCards>
  );
};

export default NotificationsListUI;
