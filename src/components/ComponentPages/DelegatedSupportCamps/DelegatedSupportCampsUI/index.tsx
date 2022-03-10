import React from "react";
import { Card, Modal, Row, Col, Button, Form } from "antd";
import Icon, {
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import styles from "./DelegatedSupportedCamps.module.scss";
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
        For topics<span> "{props.value}"</span>
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
          <a
            className={styles.RemoveCardSupported}
            onClick={() => RemoveCardDelegatedSupportedCamps()}
          >
            <CloseCircleOutlined /> Remove support{" "}
          </a>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <div>
          <Row>
            <Col span={12}>
              <div className={styles.line_height}>
                <p>
                  Support delegated to:
                  <span className={styles.Bluecolor}>Pranav</span>
                </p>
                <p>
                  Nick Name:
                  <span className={styles.Bluecolor}>rohit_telentelgia</span>
                </p>
              </div>
            </Col>
            <div></div>
            <Col span={12} className={styles.border_left}>
              <div className={styles.line_height1}>
                <p>
                  <b>Current Supported Camps:</b>
                </p>
                <p>
                  1. &nbsp;
                  <span className={styles.Bluecolor}>
                    Technological Improvement
                  </span>
                </p>
                <p>
                  2. &nbsp;
                  <span className={styles.Bluecolor}>Digital Identity</span>
                </p>
                <p>
                  3. &nbsp;<span className={styles.Bluecolor}>Prototype</span>
                </p>
              </div>
              <a className={styles.mrgn_left} onClick={showViewMoreModal}>
                View More
              </a>
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
          <a
            className={styles.RemoveCardSupported}
            onClick={() => RemoveCardDelegatedSupportedCamps()}
          >
            <CloseCircleOutlined /> Remove support{" "}
          </a>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <div>
          <Row>
            <Col span={12}>
              <div className={styles.line_height}>
                <p>
                  Support delegated to:
                  <span className={styles.Bluecolor}>Pranav</span>
                </p>
                <p>
                  Nick Name:
                  <span className={styles.Bluecolor}>rohit_telentelgia</span>
                </p>
              </div>
            </Col>
            <div></div>
            <Col span={12}>
              <div className={styles.line_height1}>
                <p>
                  <b>Current Supported Camps:</b>
                </p>
                <p>
                  1. &nbsp;
                  <span className={styles.Bluecolor}>
                    Technological Improvement
                  </span>
                </p>
                <p>
                  2. &nbsp;
                  <span className={styles.Bluecolor}>Digital Identity</span>
                </p>
                <p>
                  3. &nbsp;<span className={styles.Bluecolor}>Prototype</span>
                </p>
              </div>
              <a className={styles.mrgn_left} onClick={showViewMoreModal}>
                View More
              </a>
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
                "Theories of Consiousness"
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
            "Theories of Consciousness"
          </span>{" "}
        </h3>
        <div className={styles.topic_content}>
          <p>
            Support delegated to:
            <span className={styles.Bluecolor}>Pranav</span>
          </p>
          <p>
            Nick Name:
            <span className={styles.Bluecolor}>rohit_telentelgia</span>
          </p>
        </div>
        <h3 className={styles.marginTop}>List of current supported camps</h3>
        <div className={styles.list_Content}>
          <p>
            1. &nbsp;
            <span className={styles.Bluecolor}>Representational Qualia</span>
          </p>
          <p>
            2. &nbsp;
            <span className={styles.Bluecolor}>Mind-Brain Identity</span>
          </p>
          <p>
            3. &nbsp;<span className={styles.Bluecolor}>Property Dualism</span>
          </p>
          <p>
            4. &nbsp;
            <span className={styles.Bluecolor}>Panexperientialism</span>
          </p>
          <p>
            5. &nbsp;
            <span className={styles.Bluecolor}>Absolute space conscious</span>
          </p>
          <p>
            6. &nbsp;
            <span className={styles.Bluecolor}>Consciousness fundamental</span>
          </p>
          <p>
            7. &nbsp;
            <span className={styles.Bluecolor}>Mind is a seprate field</span>
          </p>
          <p>
            8. &nbsp;
            <span className={styles.Bluecolor}>Spacetime geometry</span>
          </p>
          <p>
            9. &nbsp;<span className={styles.Bluecolor}>Force of phisics</span>
          </p>
          <p>
            10. &nbsp;
            <span className={styles.Bluecolor}>Multisens Realism</span>
          </p>
          <p>
            11. &nbsp;
            <span className={styles.Bluecolor}>Qualitative present</span>
          </p>
          <p>
            12. &nbsp;
            <span className={styles.Bluecolor}>Phisicalistic Idealism</span>
          </p>
          <p>
            13. &nbsp;
            <span className={styles.Bluecolor}>Holistic Panexperiential</span>
          </p>
          <p>
            14. &nbsp;
            <span className={styles.Bluecolor}>
              Functional Property Dualism{" "}
            </span>
          </p>
          <p>
            15. &nbsp;
            <span className={styles.Bluecolor}>Comp Functionalism</span>
          </p>
        </div>
      </Modal>
    </div>
  );
}
