import React from "react";
import messages from "../../../../messages";
import styles from "../UserProfileUI/UserProfile.module.scss";
import Link from "next/link";
import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Image,
  Row,
  Col,
  Form,
  message,
  Tag,
  Checkbox,
  Select,
} from "antd";

export const UserProfileCard = ({
  userSupportedCampsList,
  setUserSupportedCampsList,
}) => {
  return (
    <div className="user--cards-outer">
      <div className={styles.card_spacing}>
        {userSupportedCampsList?.map((val, i) => {
          return (
            <Card
              key={i}
              type="inner"
              title={
                <div className={styles.main_card_title}>
                  Nick name : <span> {val.nick_name}</span>
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
                    defaultValue={""}
                  >
                    <Select.Option key="custom-key" value="">
                      /General/
                    </Select.Option>
                  </Select>
                </div>
              </div>
              {val.topic?.map((data, i) => {
                return (
                  <span key={i}>
                    <div className="inner--cards">
                      <div className={styles.cardBox_tags}>
                        <Card
                          title={
                            <div className={styles.card_heading_title}>
                              {data.title}
                            </div>
                          }
                        >
                          <Tag className={styles.tag_btn}>
                            <div>
                              {""}
                              <span className={styles.count}>{""}</span>
                              <Link href={""}>
                                <a className={styles.Bluecolor}>
                                  Topic Page Design Canonizer LLC
                                </a>
                              </Link>
                            </div>
                          </Tag>
                        </Card>
                      </div>

                      <div className={styles.cardBox_tags}>
                        <Card
                          title={
                            <div className={styles.card_heading_title}>
                              Scalability Architecture
                            </div>
                          }
                        >
                          {data.camps?.map((campData, id) => {
                            return (
                              <Tag className={styles.tag_btn} key={id}>
                                <div>
                                  {""}
                                  <span className={styles.count}>{""}</span>
                                  <Link href={""}>
                                    <a className={styles.Bluecolor}>
                                      {campData.camp_name}
                                    </a>
                                  </Link>
                                </div>
                              </Tag>
                            );
                          })}
                        </Card>
                      </div>
                    </div>
                  </span>
                );
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
