import React from "react";
import { Card, Modal, Tag, Button, Form } from "antd";
import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import styles from "./DirectSupportedCamps.module.scss";
import Link from "next/link";
import messages from "../../../../messages";

export default function DirectSupportedCampsUI({
  RemoveCardSupportedCamps,
  handleSupportedCampsCancel,
  isSupportedCampsModalVisible,
  directSupportedCampsList,
  search,
}) {
  function CardTitle(props) {
    return (
      <div className={styles.card_heading_title}>
        {messages.labels.fortopics}
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
  }
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
        ?.map((data, i) => {
          return (
            <Card
              key={i}
              className={styles.cardBox_tags}
              type="inner"
              size="default"
              title={
                <CardTitle title_link={data.title_link} value={data.title} />
              }
              extra={
               
                <div
                  className={styles.RemoveCardSupported}
                  onClick={() => RemoveCardSupportedCamps()}
                >
                  <CloseCircleOutlined /> {messages.labels.removeSupport}{" "}
                </div>
              
              }
              style={{ width: 760, marginBottom: 16 }}
            >
              {data.camps?.map((val, i) => {
                return (
                  <Tag
                    className={styles.tag_btn}
                    closable
                    closeIcon={<CloseCircleOutlined />}
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
                  </Tag>
                );
              })}
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
              onClick={handleSupportedCampsCancel}
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
    </div>
  );
}
