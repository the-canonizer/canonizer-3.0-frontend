import React from "react";
import { Card, Modal, Tag, Button, Form } from "antd";
import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import styles from "./DirectSupportedCamps.module.scss";
import Link from "next/link";
export default function DirectSupportedCampsUI({
  RemoveCardSupportedCamps,
  handleSupportedCampsCancel,
  isSupportedCampsModalVisible,
}) {
  function CardTitle(props) {
    return (
      <div className={styles.card_heading_title}>
        For topics<span> &quot;{props.value}&quot;</span>
      </div>
    );
  }
  return (
    <div>
      <Card
        className={styles.cardBox_tags}
        type="inner"
        size="default"
        title={<CardTitle value="Theories of Consciousness" />}
        extra={
          <Link href={""}>
            <a
              className={styles.RemoveCardSupported}
              onClick={() => RemoveCardSupportedCamps()}
            >
              <CloseCircleOutlined /> Remove support{" "}
            </a>
          </Link>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <Tag
          className={styles.tag_btn}
          closable
          closeIcon={<CloseCircleOutlined />}
        >
          <div>
            {" "}
            <span className={styles.count}>1. </span> Representational Quilia
          </div>
        </Tag>
      </Card>
      <Card
        className={styles.cardBox_tags}
        type="inner"
        size="default"
        title={<CardTitle value="Front End Language" />}
        extra={
          <Link href={""}>
            <a
              className={styles.RemoveCardSupported}
              onClick={() => RemoveCardSupportedCamps()}
            >
              <CloseCircleOutlined /> Remove support{" "}
            </a>
          </Link>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <Tag
          className={styles.tag_btn}
          closable
          closeIcon={<CloseCircleOutlined />}
        >
          <div>
            {" "}
            <span className={styles.count}>1. </span> Next JS{" "}
          </div>
        </Tag>
        <Tag
          className={styles.tag_btn}
          closable
          closeIcon={<CloseCircleOutlined />}
        >
          <div>
            {" "}
            <span className={styles.count}>2. </span> react JS Framework
          </div>
        </Tag>
      </Card>
      <Card
        className={styles.cardBox_tags}
        type="inner"
        size="default"
        title={<CardTitle value="Front End Language" />}
        extra={
          <Link href={""}>
            <a
              className={styles.RemoveCardSupported}
              onClick={() => RemoveCardSupportedCamps()}
            >
              <CloseCircleOutlined /> Remove support{" "}
            </a>
          </Link>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <Tag
          className={styles.tag_btn}
          closable
          closeIcon={<CloseCircleOutlined />}
        >
          <div>
            {" "}
            <span className={styles.count}>1. </span> Next JS{" "}
          </div>
        </Tag>
        <Tag
          className={styles.tag_btn}
          closable
          closeIcon={<CloseCircleOutlined />}
        >
          <div>
            {" "}
            <span className={styles.count}>2. </span> react JS Framework
          </div>
        </Tag>
      </Card>

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
