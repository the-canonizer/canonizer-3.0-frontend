import React from "react";
import { Card, Tag, Select } from "antd";
import messages from "../../../../messages";
import styles from "../ManageSupportUI/ManageSupport.module.scss";
import Link from "next/link";
import { Button, Col } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { DraggableArea } from "react-draggable-tags";
import { placeholders } from "src/messages/placeholder";

const ManageSupportUI = ({
  nickNameList,
  manageSupportList,
  removeAll,
  clearAllChanges,
  handleClose,
  checked,
  setManageSupportList,
  manageSupportRevertData,
  getSupportStatusData,
  cancelManageRoute,
  submitNickNameSupportCamps,
}) => {
  let tagsArrayList = [];
  {
    manageSupportList && manageSupportList.length > 0
      ? ((tagsArrayList = manageSupportList),
        tagsArrayList.forEach((obj) => {
          obj.id = obj.camp_num;
        }))
      : "";
  }

  let nickNameValue = nickNameList.length > 0 && nickNameList[0]?.nick_name;

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
        {getSupportStatusData !== "" ? (
          <>
            <span className={styles.warning}>
              <strong> Warning! </strong>
              {getSupportStatusData}
            </span>
            <Col md={12}>
              {manageSupportRevertData?.map((tag) => {
                return (
                  <Tag key={tag.camp_num} className={styles.tag_btn}>
                    <div>
                      {""}
                      <span className={styles.count}>{""}</span>
                    </div>
                    <Link href="">
                      <a>
                        {tag.support_order} . {tag.camp_name}
                      </a>
                    </Link>
                  </Tag>
                );
              })}
            </Col>
          </>
        ) : (
          ""
        )}
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
                checked={checked}
                onClick={(e) =>
                  removeAll((e.target as any).checked, manageSupportList)
                }
              ></input>
            </span>
            <span className={styles.removeAll}>Remove all</span>
            <Button
              htmlType="button"
              className={styles.clear_Btn}
              onClick={(e) => clearAllChanges(manageSupportList)}
            >
              Clear all changes
            </Button>
          </span>
        </div>
        <DraggableArea
          tags={tagsArrayList}
          render={({ tag, index }) => (
            <div className="">
              <Button
                key={tag.camp_num}
                className={styles.tag_btn}
                disabled={tag.dis}
              >
                <div className={styles.btndiv}>
                  {" "}
                  <span className={styles.count}>
                    {getSupportStatusData !== ""
                      ? tag.camp_num
                      : tag.support_order}
                    .{" "}
                  </span>
                  <Link href="">
                    <a className={styles.Bluecolor}> {tag.camp_name}</a>
                  </Link>
                </div>
                <CloseCircleOutlined
                  onClick={() => handleClose(tag, tag.topic_num, tagsArrayList)}
                />
              </Button>
            </div>
          )}
          onChange={(tags) => {
            setManageSupportList(tags);
          }}
        />

        <div>
          <Card className={styles.margin_top} type="inner">
            <div className={styles.card_heading}>
              <p>Nick Name To Support Above Camps</p>
            </div>
            <Select
              //defaultValue={'demo'}
              placeholder={placeholders.nickName}
              size="large"
              className={styles.dropdown}
              //value={nickNameList.nick_name}
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
                onClick={submitNickNameSupportCamps}
              >
                Submit
              </Button>
              <Button
                id="cancelBtn"
                htmlType="button"
                className={styles.cancel_Btn}
                onClick={cancelManageRoute}
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
