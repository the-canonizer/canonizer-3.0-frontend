import React, { useState } from "react";
import { Card, Modal, Button, Form } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "./DirectSupportedCamps.module.scss";
import Link from "next/link";
import messages from "../../../../messages";

export default function DirectSupportedCampsUI({
  removeCardSupportedCamps,
  handleSupportedCampsCancel,
  isSupportedCampsModalVisible,
  directSupportedCampsList,
  search,
  removeSupport,
  handleClose,
  saveChanges,
  showSaveChanges,
  setRevertBack,
  revertBack,
  handleRevertBack,
  visible,
  idData,
  handleOk,
  handleCancel,
}) {
  const [valData, setValData] = useState({});
  let tagsArrayList = [],
    DataArr = [];

  const CardTitle = (props) => {
    return (
      <div className={styles.card_heading_title}>
        {messages.labels.fortopic}
        <span>
          {" "}
          &quot;
          <Link href={props.title_link}>
            <a>{props.value}</a>
          </Link>
          &quot;
        </span>
      </div>
    );
  };
  return (
    <div>
      {directSupportedCampsList
        .filter((val) => {
          if (search.trim() == "") {
            return val;
          } else if (
            val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
          ) {
            return val;
          }
        })
        ?.map((data, id) => {
          DataArr = data;
          tagsArrayList = data.camps;
          return (
            <Card
              key={id}
              className={styles.cardBox_tags}
              type="inner"
              size="default"
              title={
                <CardTitle title_link={data.title_link} value={data.title} />
              }
              extra={
                <div
                  className={styles.RemoveCardSupported}
                  onClick={() => removeCardSupportedCamps(data)}
                >
                  <CloseCircleOutlined /> {messages.labels.removeSupport}{" "}
                </div>
              }
              style={{ width: 760, marginBottom: 16 }}
            >
              {(revertBack.lenght > 0 ? revertBack : tagsArrayList)?.map(
                (val) => {
                  return (
                    <Button
                      key={val.camp_num}
                      className={styles.tag_btn}
                      disabled={val.dis}
                    >
                      <div>
                        {" "}
                        <span className={styles.count}>
                          {val.support_order}.{" "}
                        </span>
                        <Link href={val.camp_link}>
                          <a className={styles.Bluecolor}> {val.camp_name}</a>
                        </Link>
                      </div>
                      <CloseCircleOutlined
                        onClick={(e) => {
                          handleClose(val, data.topic_num, data),
                            setValData(val),
                            setRevertBack([]);
                        }}
                      />
                    </Button>
                  );
                }
              )}

              {showSaveChanges && idData == data.topic_num ? (
                <div className={styles.tag_Changes}>
                  <Button
                    className={styles.save_Changes_Btn}
                    onClick={saveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button
                    className={styles.revert_Btn}
                    onClick={(e) => {
                      handleRevertBack(idData, data.camps);
                    }}
                  >
                    Revert
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Card>
          );
        })}
      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        visible={isSupportedCampsModalVisible}
        onOk={handleSupportedCampsCancel}
        onCancel={handleSupportedCampsCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p>
              Your Support for all the camps under the Topics{" "}
              <span className={styles.Bluecolor}>
                &quot;Front End Language&quot;
              </span>{" "}
              will be removed. Are you sure you want to continue?
            </p>
          </Form.Item>
          <Form.Item
            className={styles.text_right}
            style={{ marginBottom: "0px" }}
          >
            <Button
              onClick={removeSupport}
              type="primary"
              style={{
                marginTop: 10,
                marginRight: 10,
              }}
              className="ant-btn ant-btn-orange"
            >
              Remove
            </Button>
            <Button
              onClick={handleSupportedCampsCancel}
              type="default"
              style={{
                marginTop: 10,
              }}
              className="ant-btn"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={null}
        visible={visible}
        onOk={() => {
          handleOk(idData, valData);
        }}
        onCancel={handleCancel}
      >
        <h1>Changes will be reverted ?</h1>
      </Modal>
    </div>
  );
}
