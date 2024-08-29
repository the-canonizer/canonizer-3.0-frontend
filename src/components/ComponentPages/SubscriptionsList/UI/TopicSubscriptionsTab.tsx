import { useState, useEffect } from "react";
import { Tag, Tooltip, Typography, Empty, Pagination, Popover } from "antd";
import Image from "next/image";
import Link from "next/link";

import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

function TopicSubscriptionsTab({
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
}) {
  const perPage = 10;

  const [subList, setSubList] = useState([]);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    pageChange(1, perPage);
    setCurrent(1);
  }, [subscriptionsList]);

  const pageChange = (pageNumber, pageSize) => {
    setCurrent(pageNumber);
    const startingPosition = (pageNumber - 1) * pageSize;
    const endingPosition = startingPosition + pageSize;
    setSubList(subscriptionsList.slice(startingPosition, endingPosition));
  };

  if (!subscriptionsList.length) {
    return (
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        className="flex flex-col items-center justify-center"
      />
    );
  }

  return (
    <div key="subscription_cart">
      <SectionHeading
        title="My Subscriptions"
        icon={null}
        className="!mb-0 bg-canGray border-b-2 p-3 rounded-lg"
      />
      <div className="px-3">
        {subList.map((item, idx) => (
          <div className={`[&:not(:last-child)]:border-b py-3`} key={item?.id}>
            <Typography.Paragraph
              className={`${!(item?.camps?.length > 0) && "!mb-0"}`}
            >
              <Link href={item.title_link}>
                <Typography.Text className="flex gap-2.5">
                  <a className="text-sm font-normal !text-canBlack flex items-center">
                    {item.title}
                  </a>
                  {item?.is_remove_subscription && (
                    <Popover content="Remove subscription" placement="top">
                      <SecondaryButton
                        className="cursor-pointer flex items-center border-0 p-1 h-auto bg-white hover-bg-transparent"
                        onClick={(e) => onRemoveSubscription(e, item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRemoveSubscription(e, item);
                          }
                        }}
                        aria-label="Remove subscription"
                      >
                        <Image
                          src="/images/minus-user-icon.svg"
                          alt="Remove subscription"
                          width={24}
                          height={24}
                        />
                      </SecondaryButton>
                    </Popover>
                  )}
                </Typography.Text>
              </Link>
            </Typography.Paragraph>
            {item?.camps?.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {item.camps.map((camp, i) => (
                  <Tag
                    key={`${camp.subscription_start}-${i}`}
                    className="flex justify-start items-center bg-canLightGrey rounded-full w-max px-5 border-none gap-2"
                    closable
                    onClose={(e) => onConfirm(e, item, camp)}
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
                    <Link href={camp.camp_link}>
                      <a className="text-xs font-normal text-canBlack">
                        {camp.camp_name}
                      </a>
                    </Link>
                  </Tag>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {subscriptionsList && subscriptionsList.length > 0 && (
        <Pagination
          hideOnSinglePage={true}
          current={current}
          total={subscriptionsList.length}
          pageSize={perPage}
          onChange={pageChange}
          showSizeChanger={false}
          className="mt-5"
        />
      )}
    </div>
  );
  // <div key="subscription_cart">
  //   <SectionHeading
  //     title="My Subscriptions"
  //     icon={null}
  //     className="!mb-8 bg-canGray border-b-2 p-3 rounded-lg"
  //   />
  //   <div className="px-3">
  //     {subList.map((item) =>
  //       item?.camps?.length ? (
  //         <div className="border-b pb-4 mb-3" key={item?.id}>
  //           <Typography.Paragraph>
  //             <Link href={item.title_link}>
  //               <Typography.Text className="flex gap-2.5">
  //                 <a className="text-sm font-medium !text-canBlack flex items-center">
  //                   {item.title}
  //                 </a>
  //                 <Popover content="Remove subscription" placement="top">
  //                   <SecondaryButton
  //                     className="cursor-pointer flex items-center border-0 p-1 h-auto bg-white hover-bg-transparent"
  //                     onClick={(e) => onRemoveSubscription(e, item)}
  //                     onKeyDown={(e) => {
  //                       if (e.key === "Enter" || e.key === " ") {
  //                         e.preventDefault();
  //                         onRemoveSubscription(e, item);
  //                       }
  //                     }}
  //                     aria-label="Remove subscription"
  //                   >
  //                     <Image
  //                       src="/images/minus-user-icon.svg"
  //                       alt="Remove subscription"
  //                       width={24}
  //                       height={24}
  //                     />
  //                   </SecondaryButton>
  //                 </Popover>
  //               </Typography.Text>
  //             </Link>
  //           </Typography.Paragraph>
  //           <div className="flex gap-3 flex-wrap">
  //             {item?.camps?.map((camp, i) => {
  //               return (
  //                 <Tag
  //                   key={camp.subscription_start + i}
  //                   className="flex justify-start items-center bg-canLightGrey rounded-full w-max px-5 border-none gap-2"
  //                   closable
  //                   onClose={(e) => onConfirm(e, item, camp)}
  //                   closeIcon={
  //                     <Tooltip title="Remove camp subscription">
  //                       <Image
  //                         className="cursor-pointer"
  //                         src="/images/minus-user-icon.svg"
  //                         alt=""
  //                         width={24}
  //                         height={24}
  //                       />
  //                     </Tooltip>
  //                   }
  //                 >
  //                   <Link href={camp.camp_link}>
  //                     <a className="text-xs font-medium text-canBlack">
  //                       {camp.camp_name}
  //                     </a>
  //                   </Link>
  //                 </Tag>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       ) : (
  //         <Typography.Paragraph key={item?.id} className="border-b pb-4 mb-3">
  //           <Link href={item.title_link}>
  //             <Typography.Text className="flex gap-2.5">
  //               <a className="text-sm font-medium !text-canBlack flex items-center">
  //                 {item.title}
  //               </a>
  //               {item?.is_remove_subscription && (
  //                 <Popover content="Remove subscription" placement="top">
  //                   <SecondaryButton
  //                     className="cursor-pointer flex items-center border-0 p-1 h-auto bg-white hover-bg-transparent"
  //                     onClick={(e) => onRemoveSubscription(e, item)}
  //                     onKeyDown={(e) => {
  //                       if (e.key === "Enter" || e.key === " ") {
  //                         e.preventDefault();
  //                         onRemoveSubscription(e, item);
  //                       }
  //                     }}
  //                     aria-label="Remove subscription"
  //                   >
  //                     <Image
  //                       src="/images/minus-user-icon.svg"
  //                       alt="Remove subscription"
  //                       width={24}
  //                       height={24}
  //                     />
  //                   </SecondaryButton>
  //                 </Popover>
  //               )}
  //             </Typography.Text>
  //           </Link>
  //         </Typography.Paragraph>
  //       )
  //     )}
  //   </div>

  //   {subscriptionsList && subscriptionsList.length > 0 && (
  //     <Pagination
  //       hideOnSinglePage={true}
  //       current={current}
  //       total={subscriptionsList.length}
  //       pageSize={5}
  //       onChange={pageChange}
  //       showSizeChanger={false}
  //       className="mt-5"
  //     />
  //   )}
  // </div>
}

export default TopicSubscriptionsTab;
