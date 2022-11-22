import React, { useState, useEffect } from "react";
import styles from "../UserProfileUI/UserProfile.module.scss";
import messages from "../../../../messages";
import { Card, Image, Row, Col, Form, message, Tag } from "antd";
const UserProfileDetails = ({ profileData, userSupportedCampsList }) => {
  const firstNameLength = 15;
  const lastNameLength = 15;
  return (
    <>
      {userSupportedCampsList[0]?.private_status == 0 ? (
        <Card
          title={
            <h3 style={{ margin: "0px" }}>{messages.labels.userProfile} </h3>
          }
        >
          <div>
            <div style={{ paddingBottom: "8px" }}>
              <Row gutter={30}>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.name}
                  </label>
                  <h3>
                    {(profileData.first_name?.length > firstNameLength
                      ? profileData.first_name.substring(0, 15) + "..."
                      : profileData.first_name
                      ? profileData.first_name
                      : "") +
                      " " +
                      (profileData.last_name?.length > lastNameLength
                        ? profileData.last_name.substring(0, 15) + "..."
                        : profileData.last_name
                        ? profileData.last_name
                        : "")}
                  </h3>
                </Col>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.emailAddress}
                  </label>
                  <h3>{profileData.email}</h3>
                </Col>
              </Row>
            </div>

            <div style={{ paddingBottom: "8px" }}>
              <Row gutter={30}>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.address}
                  </label>
                  <h3>{profileData.address_1}</h3>
                </Col>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.City}
                  </label>
                  <h3>{profileData.city}</h3>
                </Col>
              </Row>
            </div>
            <div style={{ paddingBottom: "8px" }}>
              <Row gutter={30}>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.zipcode}
                  </label>
                  <h3>{profileData.postal_code}</h3>
                </Col>
                <Col md={12} sm={12} xs={12}>
                  <label className={styles.userProfileLabel}>
                    {messages.labels.country}
                  </label>
                  <h3>{profileData.country}</h3>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default UserProfileDetails;
