import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Tag, Select, BackTop, Pagination } from "antd";
import Link from "next/link";

import styles from "../UserProfileUI/UserProfile.module.scss";

import messages from "../../../../messages";

import CustomSkelton from "../../../common/customSkelton";
import { changeSlashToArrow } from "src/utils/generalUtility";
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
}: any) => {
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

  // userSupportedCampsList[0]?.private_status == 0

  const router = useRouter();

  const reqBody = { campNum: +router?.query?.supports?.[0] };
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

  return (
    <div className="user--cards-outer">
      {userProfileCardSkeleton ? (
        <CustomSkelton
          skeltonFor="profileCard"
          bodyCount={3}
          stylingClass=""
          isButton={false}
        />
      ) : (
        <div
          className={
            userSupportedCampsList?.[0]?.private_status == 0
              ? styles.card_spacing
              : ""
          }
        >
          {userSupportedCampsList?.map((supportedCampList, i) => {
            return (
              <Card
                key={i}
                type="inner"
                className={styles.userCaRdBox}
                title={
                  <div className={`Headings--wrap ${styles.titleBox}`}>
                    <div className={styles.main_card_title}>
                      {messages.labels.nickname}{" "}
                      <span className={styles.Bluecolor}>
                        {" "}
                        <b>{supportedCampList.nick_name}</b>
                      </span>
                    </div>
                    <div className={styles.nickname_box}>
                      <span
                        className={`${styles.main_card_title} ${styles.labels}`}
                      >
                        Select {messages.labels.nickname}
                      </span>
                    </div>
                    <Select
                      data-testid="onNicknameChange"
                      size="large"
                      className={`${styles.dropdown} ${styles.nickname_dropdown}`}
                      defaultValue={defaultNickname}
                      value={selectedNikname}
                      onChange={onNickNameChange}
                      showSearch
                      optionFilterProp="children"
                      id="user-nick-name-dropdown"
                      disabled={
                        userSupportedCampsList[0]?.private_status == 1 &&
                        !isLoggedIn
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
                    </Select>
                  </div>
                }
              >
                <div className="Headings--wrap">
                  <div className="Headings--inn">
                    <span className={styles.main_card_Heading}>
                      {messages.labels.listOfSupportedCamps}
                    </span>

                    <Select
                      data-testid="setDropdownNameSpaceList"
                      size="large"
                      className={styles.dropdown}
                      value={renderFilter()}
                      onChange={(selectedNameSpaceList) => {
                        setDropdownNameSpaceList(selectedNameSpaceList);
                        router.query.canon = selectedNameSpaceList;
                        router?.replace(router, null, { shallow: true });
                      }}
                      showSearch
                      optionFilterProp="children"
                    >
                      {nameSpaceList?.map((item) => {
                        return (
                          <Select.Option key={item.id} value={item.id}>
                            {changeSlashToArrow(item.label)}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                <div>
                  {supportedCampList.topic?.filter((obj) => {
                    if (dropdownNameSpaceList == obj.namespace_id) {
                      return obj;
                    }
                  }).length > 0
                    ? supportedCampList.topic
                        .filter((obj) => {
                          if (dropdownNameSpaceList == obj.namespace_id) {
                            return obj;
                          }
                        })
                        .slice(startingPosition, endingPosition)
                        .map((data, i) => {
                          return (
                            <span key={i}>
                              <div className="inner--cards">
                                <div className={styles.cardBox_tags}>
                                  <Card
                                    title={
                                      <div
                                        className={styles.card_heading_title}
                                      >
                                        <Link href={data.title_link}>
                                          <a className={styles.Bluecolor}>
                                            {data.title}{" "}
                                          </a>
                                        </Link>
                                        {!data.delegate_nick_name_id ? (
                                          " "
                                        ) : (
                                          <div
                                            className={styles.delegatedSupport}
                                          >
                                            {" "}
                                            (Support Delegated To{" "}
                                            <Link
                                              href={{
                                                pathname: `/user/supports/${data.delegate_nick_name_id}`,
                                                query: {
                                                  canon: data?.namespace_id,
                                                },
                                              }}
                                            >
                                              <a className={styles.Bluecolor}>
                                                {data.delegate_nick_name})
                                              </a>
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                    }
                                  >
                                    {data.camps?.length > 0 ? (
                                      data.camps?.map((campData, id) => {
                                        return (
                                          <Tag
                                            className={styles.tag_btn}
                                            key={id}
                                          >
                                            <div>
                                              {""}
                                              <span className={styles.count}>
                                                {""}
                                              </span>
                                              {!data.delegate_nick_name_id ? (
                                                ""
                                              ) : (
                                                <span
                                                  className={styles.Bluecolor}
                                                >
                                                  {campData.support_order}{" "}
                                                  {": "}
                                                </span>
                                              )}
                                              <Link href={campData.camp_link}>
                                                <a className={styles.Bluecolor}>
                                                  {campData.camp_name}
                                                </a>
                                              </Link>
                                            </div>
                                          </Tag>
                                        );
                                      })
                                    ) : (
                                      <Tag
                                        className={styles.tag_btn}
                                        key={data.topic_num}
                                      >
                                        <div>
                                          {""}
                                          <span className={styles.count}>
                                            {""}
                                          </span>
                                          <Link href={data.title_link}>
                                            <a className={styles.Bluecolor}>
                                              {"Agreement"}
                                            </a>
                                          </Link>
                                        </div>
                                      </Tag>
                                    )}
                                  </Card>
                                </div>
                              </div>
                            </span>
                          );
                        })
                    : noData && <div>No Data Available !</div>}
                </div>
                {userSupportedCampsList ? (
                  <Pagination
                    hideOnSinglePage={true}
                    total={userSupportedCampsList?.[0]?.topic?.length}
                    pageSize={5}
                    onChange={pageChange}
                    showSizeChanger={false}
                  />
                ) : (
                  ""
                )}
              </Card>
            );
          })}
        </div>
      )}
      <BackTop />
    </div>
  );
};
