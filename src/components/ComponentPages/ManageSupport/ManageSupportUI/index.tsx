import React, { useState } from "react";
import { Card, Tag, Select, Spin } from "antd";
import messages from "../../../../messages";
import styles from "../ManageSupportUI/ManageSupport.module.scss";
import Link from "next/link";
import { Button, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { DraggableArea } from "react-draggable-tags";
import { placeholders } from "src/messages/placeholder";

const ManageSupportUI = ({ nickNameList }) => {
  const tagsArrayList = [
    { id: 1, content: "Representation Qualia", dis: false },
    { id: 2, content: "Code By design", dis: false },
    { id: 3, content: "Talentelgia", dis: false },
  ];
  const [item, setItem] = useState(tagsArrayList);

  const removeSupport = (id) => {
    const filterItem = item.map((obj) => {
      if (obj.id == id) {
        obj.dis = true;
      }
      return obj;
    });
    setItem(filterItem);
  };

  const clearChanges = () => {
    setItem([...tagsArrayList]);
  };

  const removeAll = (checked) => {
    const disabeleAllTopic = item.map((obj) => {
      obj.dis = checked;
      return obj;
    });
    setItem(disabeleAllTopic);
  };
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
              <input
                type="checkbox"
                onClick={(e) => removeAll((e.target as any).checked)}
              ></input>
            </span>
            <span className={styles.removeAll}>Remove all</span>
            <Button
              htmlType="button"
              className={styles.clear_Btn}
              onClick={() => clearChanges()}
            >
              Clear all changes
            </Button>
          </span>
        </div>

        <DraggableArea
          tags={item}
          render={({ tag, index }) => (
            <div className="">
              <Button key={3} className={styles.tag_btn} disabled={tag.dis}>
                <div className={styles.btndiv}>
                  {" "}
                  <span className={styles.count}>{tag.id}. </span>
                  <Link href="">
                    <a className={styles.count}>{tag.content}</a>
                  </Link>
                </div>
                <CloseCircleOutlined onClick={() => removeSupport(tag.id)} />
              </Button>
            </div>
          )}
          onChange={(tags) => console.log(tags)}
        />

        <div>
          <Card className={styles.margin_top} type="inner">
            <div className={styles.card_heading}>
              <p>Nick Name To Support Above Camps</p>
            </div>
            <Select
              placeholder={placeholders.nickName}
              size="large"
              className={styles.dropdown}
              value={nickNameList.nick_name}
            >
              {nickNameList?.map((nick) => {
                return (
                  <Select.Option key={nick.id} value={nick.id}>
                    {nick.nick_name}
                  </Select.Option>
                );
              })}
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
