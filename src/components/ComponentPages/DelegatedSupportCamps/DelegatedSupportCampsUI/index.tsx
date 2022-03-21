import React from "react";
import { Card, Modal, Row, Col, Button, Form } from "antd";
import Icon, {
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import styles from "./DelegatedSupportedCamps.module.scss";
import messages from "../../../../messages";
export default function DelegatedSupportCampsUI({
  RemoveCardDelegatedSupportedCamps,
  handleSupportedCampsCancel,
  isRemoveSupportModalVisible,
  handelViewMoreModalCancel,
  showViewMoreModal,
  viewMoreModalVisible,
}) {
  function CardTitle(props) {
    return (
      <div className={styles.card_heading_title}>
        {messages.labels.fortopics}<span> &quot;{props.value}&quot;</span>
      </div>
    );
  }
  function CurrentSupportedCamps(props) {
    return (
      <>
        <p>
          {props.id_data} &nbsp;
          <span className={styles.Bluecolor}>{props.value}</span>
        </p>
      </>
    );
  }
  function SupportedCampsTo(props) {
    return (
      <>
        <div className={styles.line_height}>
          <p>
            Support delegated to:
            <span className={styles.Bluecolor}>{props.supportedto}</span>
          </p>
          <p>
            Nick Name:
            <span className={styles.Bluecolor}>{props.NickName}</span>
          </p>
        </div>
      </>
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
              onClick={() => RemoveCardDelegatedSupportedCamps()}
            >
              <CloseCircleOutlined /> {messages.labels.removeSupport}{" "}
            </a>
          </Link>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <div>
          <Row>
            <Col span={12}>
              <>
                <SupportedCampsTo
                  supportedto="Pranav"
                  NickName="rohit_telentelgia"
                />
              </>
            </Col>
            <div></div>
            <Col span={12} className={styles.border_left}>
              <div className={styles.line_height1}>
                <p>
                  <b>{messages.labels.currentSupportedCamps}</b>
                </p>
                <CurrentSupportedCamps
                  value="Technological Improvement"
                  id_data="1."
                />
                <CurrentSupportedCamps value="Digital Identity" id_data="2." />
                <CurrentSupportedCamps value="Prototype" id_data="3." />
              </div>
              <Link href={""}>
                <a className={styles.mrgn_left} onClick={showViewMoreModal}>
                {messages.labels.viewMore}
                </a>
              </Link>
            </Col>
          </Row>
        </div>
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
              onClick={() => RemoveCardDelegatedSupportedCamps()}
            >
              <CloseCircleOutlined /> {messages.labels.removeSupport}{" "}
            </a>
          </Link>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <div>
          <Row>
            <Col span={12}>
              <SupportedCampsTo
                supportedto="Pranav"
                NickName="rohit_telentelgia"
              />
            </Col>
            <div></div>
            <Col span={12}>
              <div className={styles.line_height1}>
                <p>
                  <b>{messages.labels.currentSupportedCamps}</b>
                </p>
                <CurrentSupportedCamps
                  value="Technological Improvement"
                  id_data="1."
                />
                <CurrentSupportedCamps value="Digital Identity" id_data="2." />
                <CurrentSupportedCamps value="Prototype" id_data="3." />
              </div>
              <Link href={""}>
                <a className={styles.mrgn_left} onClick={showViewMoreModal}>
                {messages.labels.viewMore}
                </a>
              </Link>
            </Col>
          </Row>
        </div>
      </Card>
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
              Are you sure, you want to remove your delegate support given to
              pranav_telentelgia under the topic{" "}
              <span className={styles.Bluecolor}>
                &quot;Theories of Consiousness&quot;
              </span>{" "}
              ?
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
      <Modal
        title={<h3>Current Supported Campus:</h3>}
        footer={null}
        visible={viewMoreModalVisible}
        onOk={handelViewMoreModalCancel}
        onCancel={handelViewMoreModalCancel}
        closeIcon={<CloseCircleOutlined />}
      >
        <h3>
          {" "}
          For topic{" "}
          <span className={styles.Bluecolor}>
            &quot;Theories of Consciousness&quot;
          </span>{" "}
        </h3>
        <div className={styles.topic_content}>
          <p>
            {messages.labels.supportdelegatedto}  
            <span className={styles.Bluecolor}>Pranav</span>
          </p>
          <p>
            {messages.labels.nickname}
            <span className={styles.Bluecolor}>rohit_telentelgia</span>
          </p>
        </div>
        <h3 className={styles.marginTop}>List of current supported camps</h3>
        <div className={styles.list_Content}>
          <CurrentSupportedCamps value="Representational Qualia" id_data="1." />
          <CurrentSupportedCamps value="Mind-Brain Identity" id_data="2." />
          <CurrentSupportedCamps value="Representational Qualia" id_data="3." />
          <CurrentSupportedCamps value="Panexperientialism" id_data="4." />
          <CurrentSupportedCamps
            value="Absolute space conscious"
            id_data="5."
          />
          <CurrentSupportedCamps
            value="Consciousness fundamental"
            id_data="6."
          />
          <CurrentSupportedCamps value="Mind is a seprate field" id_data="7." />
          <CurrentSupportedCamps value="Spacetime geometry " id_data="8." />
          <CurrentSupportedCamps value="Force of phisics " id_data="9." />
          <CurrentSupportedCamps value="Multisens Realism" id_data="10." />
          <CurrentSupportedCamps value="Qualitative present" id_data="11." />
          <CurrentSupportedCamps value="Phisicalistic Idealism" id_data="12." />
          <CurrentSupportedCamps
            value="Holistic Panexperiential"
            id_data="13."
          />
          <CurrentSupportedCamps
            value="Functional Property Dualism"
            id_data="14."
          />
          <CurrentSupportedCamps value="Comp Functionalism" id_data="15." />
        </div>
      </Modal>
    </div>
  );
}
