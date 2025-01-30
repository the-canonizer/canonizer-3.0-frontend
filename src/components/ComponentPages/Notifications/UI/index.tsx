import { Typography, Button, Row, Col, Popover } from "antd";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";

import Lists from "./List";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import NotificationSwitch from "components/common/headers/notification/switch";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const { Title } = Typography;

const NotificationsListUI = ({
  list,
  isLoading,
  onBackClick,
  onAllReadClick,
  router,
  onFilterClick,
  onAllDelete,
  loadMoreNotifications,
  total,
  readCount,
  unreadCount,
  isFetchingData,
  isLastReached,
}) => {
  const getBtnClass = (btn) => {
    let baseClass =
      "mb-5 rounded-lg py-2 min-h-[35px] h-full !text-canBlack text-base border-[#CCD4E780] hocus:bg-[#5482C833] hocus:border-[#5482C833] max-h-[40px]";
    const { filter } = router?.query || {};

    if ((filter === undefined && btn === "") || filter === btn) {
      baseClass += " !bg-[#5482C833] !border-[#5482C833]";
    }

    return baseClass;
  };

  return (
    <CommonCards
      title={
        <Title
          level={3}
          className="flex justify-start items-center"
          id="notifications-title"
        >
          <Button
            onClick={onBackClick}
            type="link"
            className="p-0 text-xl flex justify-center items-center mr-2 text-canBlack hover:text-canBlue"
            id="back-button"
          >
            <LeftOutlined />
          </Button>
          Notifications
        </Title>
      }
      className="bg-white mb-6 border-0 [&_.ant-card-head]:border-0 mb-8 [&_.ant-card-extra]:p-0 [&_.ant-card-head]:p-0 [&_.ant-card-body]:p-0"
      id="card-title"
      extra={
        <div className="flex justify-between items-center" id="extra-content">
          <Popover
            content={
              unreadCount === 0 ? "currently no unread notifications" : ""
            }
            id="mark-all-read-popover"
          >
            <Button
              onClick={onAllReadClick}
              type="link"
              className="text-canBlue hover:text-canHoverBlue font-medium text-md py-0"
              disabled={unreadCount === 0}
              id="mark-all-read-button"
            >
              Mark all as read
            </Button>
          </Popover>
        </div>
      }
    >
      <Row gutter={20} id="notifications-row">
        <Col lg={4} md={6} xs={24} id="filter-column">
          <div
            className="px-4 flex flex-col w-full h-full"
            id="filter-buttons-container"
          >
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "0")}
              className={getBtnClass("")}
              block
              id="filter-all-button"
            >
              All ({total})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "1")}
              className={getBtnClass("1")}
              block
              id="filter-read-button"
            >
              Read ({readCount})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "2")}
              className={getBtnClass("2")}
              block
              id="filter-unread-button"
            >
              Unread ({unreadCount})
            </SecondaryButton>
            <div
              className="mt-auto pb-14 [&_.ant-typography>small]:text-base [&_.ant-typography>small]:font-normal [&_.ant-typography>small]:text-canBlack [&_.ant-typography>small]:capitalize"
              key="div-of-switch"
              id="notification-switch-container"
            >
              <NotificationSwitch />
            </div>
          </div>
        </Col>
        <Col lg={20} md={18} xs={24} id="notifications-list-column">
          <div
            className="border rounded-lg py-4 px-6 w-full h-96 overflow-x-hidden overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-canGrey3 scrollbar-track-canGrey2 scrollbar-thin"
            id="notifications-list-container"
          >
            <Lists
              list={list}
              isFooter={!isLastReached && list?.length > 0}
              LoadMoreTopics={
                <PrimaryButton onClick={loadMoreNotifications}>
                  Load more
                </PrimaryButton>
              }
              id="notifications-list"
            />

            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={15}
                stylingClass="py-3"
                listStyle="py-2"
                isButton={false}
                id="custom-skelton"
              />
            ) : null}

            {isFetchingData && (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={5}
                stylingClass="py-3"
                listStyle="py-2"
                isButton={false}
                id="custom-skelton"
              />
            )}
          </div>
          <Popover
            content={list?.length === 0 ? "currently no notification" : ""}
            id="delete-all-popover"
          >
            <Button
              onClick={onAllDelete}
              type="link"
              className="text-canRed hover:text-canOrange font-medium text-md mt-3 float-right flex items-center justify-center"
              disabled={list?.length === 0}
              id="delete-all-button"
              icon={
                <DeleteOutlined className="!leading-[normal] flex justify-center items-center text-sm [&_svg]:w-auto [&_svg]:h-[16px]" />
              }
            >
              <span className="leading-[normal] text-sm">
                Delete All Notifications
              </span>
            </Button>
          </Popover>
        </Col>
      </Row>
    </CommonCards>
  );
};

export default NotificationsListUI;
