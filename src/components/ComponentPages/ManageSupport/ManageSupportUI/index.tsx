import React from "react";
import { Card, Tag, Select, Spin } from "antd";
import messages from "../../../../messages";
import styles from "../ManageSupportUI/ManageSupport.module.scss";
import Link from "next/link";
import { Button } from "antd";
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
        <div className={styles.notes}>
          {" "}
          Note : To change support order of camp, drag & drop the camp box on
          your choice position.
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
