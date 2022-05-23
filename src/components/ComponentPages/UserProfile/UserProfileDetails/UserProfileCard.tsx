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
const UserProfileCard = () => {
  return (
    <div className="user--cards-outer">
      <div className={styles.card_spacing}>
        <Card
          type="inner"
          title={<div className={styles.main_card_title}>Nick name</div>}
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

          <div className="inner--cards">
            <div className={styles.cardBox_tags}>
              <Card
                title={
                  <div className={styles.card_heading_title}>
                    Canonizer3 Topic Page Design
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
                    Canonizer3 Logo Design
                  </div>
                }
              >
                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        History Page Design Canonizer LLC
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        Logo Design By Canonizer LLC
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
                    Canonizer UI UX Design
                  </div>
                }
              >
                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        Home Page Design Canonizer LLC
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        UI UX Design Canonizer LLC
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        Logo Design By Canonizer LLC
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
                    Server Side Language
                  </div>
                }
              >
                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        Home Page Design Canonizer LLC
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>GitHub Action</a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>MYSQL</a>
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
                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        Laravel Passport And Auth
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>
                        UI UX Design Canonizer LLC
                      </a>
                    </Link>
                  </div>
                </Tag>

                <Tag className={styles.tag_btn}>
                  <div>
                    {""}
                    <span className={styles.count}>{""}</span>
                    <Link href={""}>
                      <a className={styles.Bluecolor}>PHP Laravel Framework</a>
                    </Link>
                  </div>
                </Tag>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
let onlyMyTopicsCheck = false;
const handleCheckbox = (e) => {
  onlyMyTopicsCheck = e.target.checked;
};

export default UserProfileCard;
