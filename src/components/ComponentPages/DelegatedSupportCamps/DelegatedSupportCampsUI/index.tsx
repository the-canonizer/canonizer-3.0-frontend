import React, { useState } from "react";
import { Card, Modal, Row, Col, Button, Form, Empty } from "antd";
import Icon, {
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import styles from "./DelegatedSupportedCamps.module.scss";
import messages from "../../../../messages";
export default function DelegatedSupportCampsUI({
  removeCardDelegatedSupportedCamps,
  handleSupportedCampsCancel,
  isRemoveSupportModalVisible,
  handelViewMoreModalCancel,
  showViewMoreModal,
  viewMoreDataValue,
  viewMoreModalVisible,
  delegatedSupportCampsList,
  search,
  removeSupport,
  removeSupportCampsData,
}) {
  const limit = 3;
  function CardTitle(props) {
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
  }
  function CurrentSupportedCamps(props) {
    return (
      <>
        <p>
          {props.id_data} &nbsp;
          <Link href={props.camp_link}>
            <a className={styles.Bluecolor}>{props.value}</a>
          </Link>
        </p>
      </>
    );
  }
  function SupportedCampsTo(props) {
    return (
      <>
        <div className={styles.line_height}>
          <p>
            Support delegated to:{" "}
            <Link href={props.supportedto_link}>
              <a className={styles.Bluecolor}>{props.supportedto}</a>
            </Link>
          </p>
          <p>
            Nick Name:{" "}
            <Link href={props.NickNameLink}>
              <a className={styles.Bluecolor}>{props.NickName}</a>
            </Link>
          </p>
        </div>
      </>
    );
  }
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  const filteredArray = () => {
    return delegatedSupportCampsList.filter((val) => {
      if (search.trim() == "") {
        return val;
      } else if (
        val.title.toLowerCase().trim().includes(search.toLowerCase().trim())
      ) {
        return val;
      }
    });
  };
  return (
    <div>
      {delegatedSupportCampsList.length > 0
        ? filteredArray().length > 0
          ? filteredArray()?.map((data, i) => {
              return (
                <Card
                  key={i}
                  className={styles.cardBox_tags}
                  type="inner"
                  size="default"
                  title={
                    <CardTitle
                      title_link={data.title_link}
                      value={data.title}
                    />
                  }
                  extra={
                    <div
                      className={styles.RemoveCardSupported}
                      onClick={() => removeCardDelegatedSupportedCamps(data)}
                    >
                      <CloseCircleOutlined /> {messages.labels.removeSupport}{" "}
                    </div>
                  }
                  style={{ width: 760, marginBottom: 16 }}
                >
                  <div>
                    <Row className={styles.flex_wrap}>
                      <Col span={12} className={styles.flex_wrap_col}>
                        <>
                          <SupportedCampsTo
                            supportedto={data.delegated_to_nick_name}
                            supportedto_link={data.delegated_to_nick_name_link}
                            NickName={data.my_nick_name}
                            NickNameLink={data.my_nick_name_link}
                          />
                        </>
                      </Col>
                      <Col span={12} className={styles.border_left}>
                        <div className={styles.line_height1}>
                          <p>
                            <b>{messages.labels.currentSupportedCamps}</b>
                          </p>

                          {data.camps?.slice(0, limit).map((val, i) => {
                            return (
                              <CurrentSupportedCamps
                                key={i}
                                value={val.camp_name}
                                id_data={val.support_order + "."}
                                camp_link={val.camp_link}
                              />
                            );
                          })}
                        </div>
                        {data.camps.length > limit ? (
                          <a
                            className={styles.mrgn_left}
                            onClick={(e) => showViewMoreModal(e, data)}
                          >
                            {messages.labels.viewMore}
                          </a>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                  </div>
                </Card>
              );
            })
          : showEmpty("No Data Found")
        : showEmpty("No Data Found")}

      <Modal
        className={styles.modal_cross}
        title="Remove Support"
        visible={isRemoveSupportModalVisible}
        onOk={handleSupportedCampsCancel}
        onCancel={handleSupportedCampsCancel}
        footer={null}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p>
              Are you sure, you want to remove your delegate support given to{" "}
              <span>
                &quot;
                <Link href={removeSupportCampsData.delegated_to_nick_name_link}>
                  <a>{removeSupportCampsData.delegated_to_nick_name}</a>
                </Link>
                &quot;
              </span>{" "}
              under the topic{" "}
              <span className={styles.Bluecolor}>
                &quot;
                <Link href={removeSupportCampsData.title_link}>
                  <a>{removeSupportCampsData.title}</a>
                </Link>
                &quot;
              </span>{" "}
              ?
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
        title={<h3>Current Supported Campus:</h3>}
        footer={null}
        visible={viewMoreModalVisible}
        onOk={handelViewMoreModalCancel}
        onCancel={handelViewMoreModalCancel}
        closeIcon={<CloseCircleOutlined />}
      >
        <>
          <h3>
            {" "}
            For topic{" "}
            <span className={styles.Bluecolor}>
              &quot;{" "}
              <Link href={viewMoreDataValue.title_link}>
                <a>{viewMoreDataValue.title}</a>
              </Link>{" "}
              &quot;
            </span>{" "}
          </h3>
          <div className={styles.topic_content}>
            <p>
              {messages.labels.supportdelegatedto}{" "}
              <Link href={viewMoreDataValue.delegated_to_nick_name_link}>
                <a className={styles.Bluecolor}>
                  {viewMoreDataValue.delegated_to_nick_name}
                </a>
              </Link>
            </p>
            <p>
              {messages.labels.nickname}{" "}
              <Link href={viewMoreDataValue.my_nick_name_link}>
                <a className={styles.Bluecolor}>
                  {viewMoreDataValue.my_nick_name}
                </a>
              </Link>
            </p>
          </div>
          <h3 className={styles.marginTop}>List of current supported camps</h3>
          <div className={styles.list_Content}>
            {viewMoreDataValue.camps?.map((val, i) => {
              return (
                <CurrentSupportedCamps
                  key={i}
                  value={val.camp_name}
                  id_data={val.support_order + "."}
                  camp_link={val.camp_link}
                />
              );
            })}
          </div>
        </>
      </Modal>
    </div>
  );
}
