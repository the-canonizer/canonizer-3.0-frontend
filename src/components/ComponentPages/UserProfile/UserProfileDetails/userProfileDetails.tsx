import React from "react";
import styles from "../UserProfileUI/UserProfile.module.scss";
import messages from "../../../../messages";
import { Card, Image, Row, Col, Form, message, Tag } from "antd";
const userProfileDetails = () => {
  return (
    <>
      <Card title={<h3>{messages.labels.userProfile} </h3>}>
        <div>
          <div style={{ paddingBottom: "8px" }}>
            <Row gutter={30}>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.name}
                </label>
                <h3>Rohit</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.email}
                </label>
                <h3>rohit.gupta98765@gmail.com</h3>
              </Col>
            </Row>
          </div>

          <div style={{ paddingBottom: "8px" }}>
            <Row gutter={30}>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.address}
                </label>
                <h3>sector 91</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.City}
                </label>
                <h3>Mohali</h3>
              </Col>
            </Row>
          </div>
          <div style={{ paddingBottom: "8px" }}>
            <Row gutter={30}>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.zipCode}
                </label>
                <h3>32456</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.country}
                </label>
                <h3>India</h3>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </>
  );
};

export default userProfileDetails;
