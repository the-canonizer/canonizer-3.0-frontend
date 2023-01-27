import React, { useEffect, useState } from "react";
import messages from "../../../../messages";
import styles from "../UserProfileUI/UserProfile.module.scss";
import Link from "next/link";
import { Card, Tag, Select, BackTop, Pagination } from "antd";
import { useRouter } from "next/router";
export const UserProfileCard = ({
  userSupportedCampsList,
  nameSpaceList,
  dropdownNameSpaceList,
  setDropdownNameSpaceList,
  noData,
}: any) => {
  const [displayList, setDisplayList] = useState([]);
  const [startingPosition, setStartingPosition] = useState(0);
  const [endingPosition, setEndingPosition] = useState(5);
  const renderFilter = () => {
    const filteredVal = nameSpaceList.filter(
      (obj) => obj.id == dropdownNameSpaceList
    );
    return filteredVal[0];
  };
  const router = useRouter();
  const reqBody = { campNum: +router?.query?.supports[0] };
  const pageChange = (pageNumber, pageSize) => {
    setStartingPosition((pageNumber - 1) * pageSize);
    setEndingPosition((pageNumber - 1) * pageSize + pageSize);
  };
  return (
    <div className="user--cards-outer">
      <div className={styles.card_spacing}>
        {userSupportedCampsList?.map((supportedCampList, i) => {
          return (
            <Card
              key={i}
              type="inner"
              title={
                <div className={styles.main_card_title}>
                  {messages.labels.nickname}{" "}
                  <span className={styles.Bluecolor}>
                    {" "}
                    <b>{supportedCampList.nick_name}</b>
                  </span>
                </div>
              }
            >
              <div className="Headings--wrap">
                <div className="Headings--inn">
                  <span className={styles.main_card_Heading}>
                    {messages.labels.listOfSupportedCamps}
                  </span>

                  <Select
                    size="large"
                    className={styles.dropdown}
                    value={renderFilter()}
                    onChange={(selectedNameSpaceList) => {
                      setDropdownNameSpaceList(selectedNameSpaceList);
                    }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {nameSpaceList?.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.id}>
                          {item.label}
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
                                    <div className={styles.card_heading_title}>
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
                                                topicnum: data?.topic_num,
                                                campnum: reqBody?.campNum,
                                                namespace: data?.namespace_id,
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
                                                {campData.support_order} {": "}
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
                />
              ) : (
                ""
              )}
            </Card>
          );
        })}
      </div>
      <BackTop />
    </div>
  );
};
