import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Tag, Select, BackTop, Pagination } from "antd";
import Link from "next/link";
import { FlagOutlined, UserOutlined } from "@ant-design/icons";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import { changeSlashToArrow } from "src/utils/generalUtility";
import CommonCards from "components/shared/Card";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import AlignIcon from "components/ComponentPages/CreateNewTopic/UI/alignIcon";

const FilterSelectInput = ({ prefix, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`text-sm text-canBlack font-medium [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 w-full lg:w-64`}
    >
      <div
        className={`outerDiv flex border rounded ${
          isFocused
            ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
            : ""
        }`}
      >
        {prefix}
        <Select
          className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack w-full`}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          {...props}
        >
          {props.children}
        </Select>
      </div>
    </div>
  );
};

export const UserProfileCard = ({
  userSupportedCampsList,
  nameSpaceList,
  dropdownNameSpaceList,
  setDropdownNameSpaceList,
  noData,
  nickNames,
  defaultNickname,
  selectedNikname,
  setSelectedNikname,
  isLoggedIn,
  userProfileCardSkeleton,
}) => {
  const [startingPosition, setStartingPosition] = useState(0);
  const [endingPosition, setEndingPosition] = useState(5);

  const renderFilter = () => {
    const filteredVal = nameSpaceList.filter(
      (obj) => obj.id == dropdownNameSpaceList
    );
    let returnValue = filteredVal[0];
    if (returnValue)
      returnValue = {
        ...returnValue,
        label: changeSlashToArrow(returnValue.label),
      };
    return returnValue;
  };

  const router = useRouter();

  useEffect(() => {
    pageChange(1, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSupportedCampsList?.[0]?.topic]);

  const pageChange = (pageNumber, pageSize) => {
    setStartingPosition((pageNumber - 1) * pageSize);
    setEndingPosition((pageNumber - 1) * pageSize + pageSize);
  };

  const onNickNameChange = (value) => {
    let pathQueries = router?.query.supports;
    pathQueries = [value];
    router.query.supports = pathQueries;
    router.push(router);
    setSelectedNikname(value);
  };

  if (userProfileCardSkeleton) {
    return (
      <CustomSkelton
        skeltonFor="profileCard"
        bodyCount={3}
        stylingClass=""
        isButton={false}
      />
    );
  }

  return (
    <CommonCards className="mt-10 bg-white">
      <header className="flex gap-7 mb-6 flex-wrap">
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-canLight text-sm font-normal mb-2">
            {messages.labels.nickname}
          </label>
          <FilterSelectInput
            prefix={<UserOutlined className="px-3 text-canBlack" />}
            data-testid="onNicknameChange"
            size="large"
            defaultValue={defaultNickname}
            value={selectedNikname}
            onChange={onNickNameChange}
            showSearch
            optionFilterProp="children"
            id="user-nick-name-dropdown"
            disabled={
              userSupportedCampsList[0]?.private_status == 1 && !isLoggedIn
            }
          >
            {nickNames?.map((nick) => {
              return (
                <Select.Option
                  id={`name-space-${nick.id}`}
                  key={nick.id}
                  value={nick.value}
                >
                  {nick.label}
                </Select.Option>
              );
            })}
          </FilterSelectInput>
        </div>
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-canLight text-sm font-normal mb-2">
            Canon
          </label>
          <FilterSelectInput
            data-testid="setDropdownNameSpaceList"
            size="large"
            value={renderFilter()}
            onChange={(selectedNameSpaceList) => {
              setDropdownNameSpaceList(selectedNameSpaceList);
              router.query.canon = selectedNameSpaceList;
              router?.replace(router, null, { shallow: true });
            }}
            showSearch
            optionFilterProp="children"
            prefix={<FlagOutlined className="px-3 text-canBlack" />}
          >
            {nameSpaceList?.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {changeSlashToArrow(item.label)}
                </Select.Option>
              );
            })}
          </FilterSelectInput>
        </div>
      </header>
      <hr />
      <SectionHeading
        title={messages.labels.listOfSupportedCamps}
        icon={null}
        className="mt-6 !mb-7"
      />

      {userSupportedCampsList?.map((supportedCampList, i) => {
        const filteredTopics = supportedCampList.topic?.filter(
          (obj) => dropdownNameSpaceList == obj.namespace_id
        );

        return (
          <div key={i} className="w-full">
            {filteredTopics && filteredTopics.length > 0
              ? filteredTopics
                  .slice(startingPosition, endingPosition)
                  .map((data, idx) => (
                    <Card
                      key={data.title_link || idx} // Use a unique identifier if available
                      className="rounded-lg [&:not(:last-child)]:mb-7 shadow-md hover:shadow-lg"
                      title={
                        <div className="flex flex-col items-start justify-center gap-2">
                          <span className="flex items-center justify-start gap-4">
                            <AlignIcon fill="#242B37" />
                            <Link href={data.title_link}>
                              <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-medium">
                                {data.title}
                              </a>
                            </Link>
                          </span>
                          {data.delegate_nick_name_id && (
                            <div className="ml-8 text-sm text-canLight">
                              (Support Delegated To{" "}
                              <Link
                                href={{
                                  pathname: `/user/supports/${data.delegate_nick_name_id}`,
                                  query: { canon: data?.namespace_id },
                                }}
                              >
                                <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-medium">
                                  {data.delegate_nick_name})
                                </a>
                              </Link>
                            </div>
                          )}
                        </div>
                      }
                    >
                      {data.camps?.length > 0 ? (
                        data.camps.map((campData, campIdx) => (
                          <Tag
                            className="rounded-md text-sm font-medium border-0 text-canBlue py-1 px-4 bg-canLightGrey"
                            key={campIdx}
                          >
                            {data.delegate_nick_name_id && (
                              <span className="text-canBlue">
                                {campData.support_order} :
                              </span>
                            )}
                            <Link href={campData.camp_link}>
                              <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-normal">
                                {campData.camp_name}
                              </a>
                            </Link>
                          </Tag>
                        ))
                      ) : (
                        <Tag
                          className="rounded-md text-sm font-medium border-0 text-canBlue py-1 px-4 bg-canLightGrey"
                          key={data.topic_num}
                        >
                          <Link href={data.title_link}>
                            <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-normal">
                              Agreement
                            </a>
                          </Link>
                        </Tag>
                      )}
                    </Card>
                  ))
              : noData && <div>No Data Available!</div>}
          </div>
        );
      })}

      <hr className="my-7" />
      {userSupportedCampsList ? (
        <div>
          <Pagination
            hideOnSinglePage={true}
            total={userSupportedCampsList?.[0]?.topic?.length}
            pageSize={5}
            onChange={pageChange}
            className={`browse-pagination w-full flex items-center justify-center [&_.ant-pagination-total-text]:hidden [&_.ant-pagination-total-text]:lg:block [&_.ant-pagination-total-text]:mr-auto [&_.ant-pagination-options]:hidden [&_.ant-pagination-options]:lg:block [&_.ant-pagination-options]:!ml-auto`}
            size="small"
            defaultCurrent={1}
            defaultPageSize={12}
            showTotal={(total) => `Total ${total} items`}
            pageSizeOptions={[12, 18, 24]}
            // showSizeChanger
            // onShowSizeChange={handlePageChange}
          />
        </div>
      ) : null}

      <BackTop />
    </CommonCards>
  );
};
