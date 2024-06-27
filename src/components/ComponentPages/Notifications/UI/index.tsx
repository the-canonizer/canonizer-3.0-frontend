import { Typography, Button, Row, Col } from "antd";
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
    if (notification.is_read === 1) {
      readCount++;
    } else {
      unreadCount++;
    }
  });

  return { readCount, unreadCount };
};

const NotificationsListUI = ({
  list,
  isLoading,
  onBackClick,
  onAllReadClick,
  router,
  onFilterClick,
  onAllDelete,
}) => {
  const getBtnClass = (btn) => {
    let baseClass =
      "mb-5 rounded-lg py-2 min-h-[35px] h-full !text-canBlack text-base border-[#CCD4E780] hocus:bg-[#5482C833] hocus:border-[#5482C833]";
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
      className="bg-white mb-6 border-0 [&_.ant-card-head]:border-0"
      id="card-title"
      extra={
        <div className="flex justify-between items-center">
          <Button
            onClick={onAllReadClick}
            type="link"
            className="text-canBlue hover:text-canHoverBlue font-medium text-md mr-10 py-0"
          >
            Mark all as read
          </Button>
          <NotificationSwitch key="notificatoin-page-switch" />
        </div>
      }
    >
      <Row gutter={20}>
        <Col lg={4} md={6} xs={8}>
          <div className="px-4">
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "0")}
              className={getBtnClass("")}
              block
              disabled={list?.length === 0}
            >
              All ({list?.length})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "1")}
              className={getBtnClass("1")}
              block
              disabled={readCount === 0}
            >
              Read ({readCount})
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "2")}
              className={getBtnClass("2")}
              block
              disabled={unreadCount === 0}
            >
              Unread ({unreadCount})
            </SecondaryButton>
          </div>
        </Col>
        <Col lg={18} md={22} xs={24}>
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
              <Lists list={list} isFooter={false} LoadMoreTopics={null} />
            )}
          </div>
          <Button
            onClick={onAllDelete}
            type="link"
            className="text-canRed hover:text-canOrange font-medium text-md mt-4 py-0 float-right flex items-center justify-center"
          >
            <DeleteOutlined />
            Delete All Notifications
          </Button>
        </Col>
      </Row>
    </CommonCards>
  );
};

export default NotificationsListUI;
