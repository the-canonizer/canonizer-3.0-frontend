import { Typography, Pagination, Button, Row, Col } from "antd";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";

import Lists from "./List";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import NotificationSwitch from "components/common/headers/notification/switch";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

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
  router,
  onFilterClick,
}) => {
  const getBtnClass = (btn) => {
    let baseClass =
      "mb-5 rounded-lg !text-canBlack text-base border-[#CCD4E780] hocus:bg-[#5482C833] hocus:border-[#5482C833]";
    const { filter } = router?.query || {};

    if ((filter === undefined && btn === "") || filter === btn) {
      baseClass += " bg-[#5482C833] border-[#5482C833]";
    }

    return baseClass;
  };

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
            >
              All (11)
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "1")}
              className={getBtnClass("1")}
              block
            >
              Read (11)
            </SecondaryButton>
            <SecondaryButton
              onClick={(e) => onFilterClick(e, "2")}
              className={getBtnClass("2")}
              block
            >
              Unread (11)
            </SecondaryButton>
          </div>
        </Col>
        <Col lg={18} md={22} xs={24}>
          <div className="border rounded-lg py-4 px-6 w-full h-96 overflow-x-hidden overflow-y-auto">
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
                    className=""
                  />
                }
              />
            )}
          </div>
          <Button
            onClick={onAllReadClick}
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
