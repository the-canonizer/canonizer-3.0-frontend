import React from "react";
import { Card, Tag, Select, Spin } from "antd";
import messages from "../../../../messages";
import styles from "../ManageSupportUI/ManageSupport.module.scss";
import Link from "next/link";
import { Button, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const ManageSupportUI = () => {
  return (
    <>
      <Card
        className={styles.card_width}
        title={
          <div className={styles.main_card_title}>
            {messages.labels.SupportedCamps}
          </div>
        }
      >
        <span className={styles.warning}>
          <strong> Warning! </strong>`Agreement` is a parent camp to the list of
          child camps.If you commit support to Agreement the support of the camp
          in this list will be removed
        </span>
        <Col md={12}>
          <Tag className={styles.tag_btn}>
            <div>
              {""}
              <span className={styles.count}>{""}</span>
            </div>
            <Link href="">
              <a>1 . Home Page by Code District</a>
            </Link>
          </Tag>

          <Tag className={styles.tag_btn}>
            <div>
              {""}
              <span className={styles.count}>{""}</span>
            </div>
            <Link href="">
              <a>2 . Home Page Design Talentelgia</a>
            </Link>
          </Tag>
        </Col>
        <div className={styles.hrtag}></div>
        <div className={styles.notes}>
          {" "}
          Note : To change support order of camp, drag & drop the camp box on
          your choice position.
        </div>

        <div className="mb-4">
          <span className={styles.quickAction}>
            Quick Action:
            <span className={styles.checkbox}>
              <input type="checkbox"></input>
            </span>
            <span className={styles.removeAll}>Remove all</span>
            <Button htmlType="button" className={styles.clear_Btn}>
              Clear all changes
            </Button>
          </span>
        </div>

        <Tag className={styles.tag_btn}>
          <div>
            {""}
            <span className={styles.count}>{""}</span>
          </div>
          <Link href="/topic/441-UserProfile-Testing2/1-Agreement#statement">
            <a>1 . Representational Qualia</a>
          </Link>
          <CloseCircleOutlined />
        </Tag>
        <div>
          <Card className={styles.margin_top} type="inner">
            <div className={styles.card_heading}>
              <p>Nick Name To Support Above Camps</p>
            </div>
            <Select
              // style={{color:"#4484ce"}}
              size="large"
              className={styles.dropdown}
              defaultValue={"team"}
              value={"Team_Talentelgia"}
            >
              <Select.Option key="custom-key" value="">
                All
              </Select.Option>
            </Select>
            <div className={styles.Upload_Cancel_Btn}>
              <Button
                id="uploadBtn"
                htmlType="submit"
                className={styles.Upload_Btn}
              >
                Submit
              </Button>
              <Button
                id="cancelBtn"
                htmlType="button"
                className={styles.cancel_Btn}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
};

export default ManageSupportUI;
