import React, { useState } from "react";
import messages from "../../../../messages";
import styles from "../UserProfileUI/UserProfile.module.scss";
import Link from "next/link";
import { Card, Tag, Select, Spin } from "antd";
export const UserProfileCard = ({
  userSupportedCampsList,
  setUserSupportedCampsList,
  nameSpaceList,
  dropdownNameSpaceList,
  setDropdownNameSpaceList,
  noData,
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
                                          {data.title}
                                        </a>
                                      </Link>
                                    </div>
                                  }
                                >
                                  {data.camps?.map((campData, id) => {
                                    return (
                                      <Tag className={styles.tag_btn} key={id}>
                                        <div>
                                          {""}
                                          <span className={styles.count}>
                                            {""}
                                          </span>
                                          {campData.delegate_nick_name_id !=
                                          0 ? (
                                            <>
                                              <p
                                                className={
                                                  styles.userProfileLabel
                                                }
                                              >
                                                Support deligated to{" "}
                                                <a className={styles.Bluecolor}>
                                                  {
                                                    campData.delegate_nick_name_id
                                                  }
                                                </a>
                                              </p>
                                              <b
                                                className={
                                                  styles.userProfileLabel
                                                }
                                              >
                                                Supported camp list:{" "}
                                              </b>
                                              <a className={styles.Bluecolor}>
                                                {campData.camp_name}
                                              </a>
                                            </>
                                          ) : (
                                            <Link href={campData.camp_link}>
                                              <a className={styles.Bluecolor}>
                                                {campData.camp_name}
                                              </a>
                                            </Link>
                                          )}
                                        </div>
                                      </Tag>
                                    );
                                  })}
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
