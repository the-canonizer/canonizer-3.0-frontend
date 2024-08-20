import {
  Card,
  Tag,
  Button,
  Tooltip,
  Typography,
  Empty,
  Pagination,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

import styles from "./SubscriptionsList.module.scss";
import { useState, useEffect } from "react";

const { Title } = Typography;

function TopicSubscriptionsTab({
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
}: any) {
  const [subList, setSubList] = useState([]);
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    pageChange(1, 5);
    setCurrent(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionsList]);
  const pageChange = (pageNumber, pageSize) => {
    setCurrent(pageNumber);
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setSubList(subscriptionsList.slice(startingPosition, endingPosition));
  };
  return subscriptionsList.length ? (
    <div key="subscription_cart">
      <h3 className="text-xl text-canBlack font-semibold bg-canGray p-6 mb-8 border-b border-black border-opacity-10">
        My Subscriptions
      </h3>

      {subList.length > 0 &&
        subList.map((data) => {
          return (
            <Card
              key={data?.topic_num}
              className="subs-card [&_.ant-card-head]:!bg-transparent [&_.ant-card-head]:!border-none [&_.ant-card-body]:!px-6 [&_.ant-card-body]:!my-4 [&_.ant-tag-close-icon]:flex [&_.ant-tag-close-icon]:items-center [&_.ant-card-head-title]:!border-b [&_.ant-card-head-title]:!border-black [&_.ant-card-head-title]:!border-opacity-5  [&_.ant-card-head-title]:!py-5 !mb-0 pb-0"
             
              type="inner"
              size="default"
              title={
                <Title level={5} className="!border-none">
                  <span>
                    <Link href={data.title_link}>
                    <div className="flex gap-2.5">
                      <a className="text-base font-semibold !text-canBlack">
                        {data.title}
                      </a>
                      <span
                        className="cursor-pointer"
                        onClick={(e) => onRemoveSubscription(e, data)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault(); // Prevent default action for space key
                            onRemoveSubscription(e, data); // Trigger the click handler
                          }
                        }}
                        tabIndex={0}  // Make the element focusable
                        role="button" // Indicate that this span acts like a button
                        aria-label="Remove subscription" // Add an accessible label for screen readers
                      >
                        <Image
                          src="/images/minus-user-icon.svg"
                          alt="Remove subscription"
                          width={24}
                          height={24}
                        />
                      </span>
                    </div>
                    </Link>
                  </span>
                </Title>
              }
              // extra={
              //   data.is_remove_subscription ? (
              //     <Tooltip title="Remove subscription">
              //       <Button
              //         className={styles.cardTitle}
              //         onClick={(e) => onRemoveSubscription(e, data)}
              //         type="link"
              //         danger
              //         icon={<CloseCircleOutlined />}
              //         data-testid="camp-remove"
              //       >
              //         Remove subscription
              //       </Button>
              //     </Tooltip>
              //   ) : null
              // }
              style={{ width: "100%", marginBottom: 16 }}
            >
              {/* <p className="text-base text-canBlack font-semibold mt-4 mb-2.5">
                Political Sciences
              </p> */}
              <div className="flex flex-wrap flex-col gap-2.5 border-b pb-5 ">
              {data.camps?.map((camp, i) => {
                return (
                  <>
                  <Tag
                    key={camp.subscription_start + i}
                    className="  flex justify-start items-center bg-canLightGrey rounded-full w-max px-5 border-none "
                    closable
                    onClose={(e) => onConfirm(e, data, camp)}
                    closeIcon={
                      <Tooltip title="Remove camp subscription">
                       <Image
                       className="cursor-pointer"
                            src="/images/minus-user-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                      </Tooltip>
                    }
                  >
                    <div className="my-2.5">
                      {/* <span className={styles.count}>{i + 1}. </span> */}
                      <Link href={camp.camp_link}>
                        <div className="flex gap-2.5 items-center  rounded-full">
                          <a className=" text-sm font-semibold text-canBlack">
                            {camp.camp_name}
                          </a>
                        
                          {/* <Image
                            src="/images/minus-user-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          /> */}
                        </div>
                      </Link>
                   
                    </div>
               
                  </Tag>
                  {/* <hr className="my-2.5 border-black border-opacity-5"/> */}
                  </>
                  
                );
              })}
              </div>
             
            </Card>
          );
        })}
      {subscriptionsList &&
        subscriptionsList.length > 0 &&
        subList.length > 0 && (
          <Pagination
            hideOnSinglePage={true}
            current={current}
            total={subscriptionsList.length}
            pageSize={5}
            onChange={pageChange}
            showSizeChanger={false}
          />
        )}
    </div>
  ) : (
    <Card
      className={styles.cardBox_tags}
      type="inner"
      size="default"
      style={{ width: "100%" }}
    >
      <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
    </Card>
  );
}

export default TopicSubscriptionsTab;
