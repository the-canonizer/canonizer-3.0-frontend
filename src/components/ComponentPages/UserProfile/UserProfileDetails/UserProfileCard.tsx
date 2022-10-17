import React, { useState } from "react";
import messages from "../../../../messages";
import styles from "../UserProfileUI/UserProfile.module.scss";
import Link from "next/link";
import { Card, Tag, Select, Spin } from "antd";
export const UserProfileCard = ({
  userSupportedCampsList,
  nameSpaceList,
  dropdownNameSpaceList,
  setDropdownNameSpaceList,
  noData,
  setUserSupportedCampsList,
  profileData,
}) => {
  const renderFilter = () => {
    const filteredVal = nameSpaceList.filter(
      (obj) => obj.id == dropdownNameSpaceList
    );
    return filteredVal[0];
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
                                          (Support Delegated to{" "}
                                          <a className={styles.Bluecolor}>
                                            {data.delegate_nick_name})
                                          </a>
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
            </Card>
          );
        })}
      </div>
    </div>
  );
};
