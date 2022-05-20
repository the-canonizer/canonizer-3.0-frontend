import React, { useState, useEffect } from "react";
import styles from "../UserProfileUI/UserProfile.module.scss";
import messages from "../../../../messages";
import { Card, Image, Row, Col, Form, message, Tag } from "antd";
import { getUserProfileById } from "src/network/api/userApi";
const userProfileDetails = () => {
  const [profileData, setProfileData] = useState({} as any);
  const GetUserProfileData = async () => {
    let response = await getUserProfileById();
    if (response && response.status_code === 200) {
      setProfileData(response.data);
      console.log(response.data.city);
    }
  };
  //onLoad
  useEffect(() => {
    GetUserProfileData();
  }, []);
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
                <h3>{profileData.first_name}</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.email}
                </label>
                <h3>{profileData.email}</h3>
              </Col>
            </Row>
          </div>

          <div style={{ paddingBottom: "8px" }}>
            <Row gutter={30}>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.address}
                </label>
                <h3>{profileData.address_1}</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.City}
                </label>
                <h3>{profileData.city}</h3>
              </Col>
            </Row>
          </div>
          <div style={{ paddingBottom: "8px" }}>
            <Row gutter={30}>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.zipCode}
                </label>
                <h3>{profileData.postal_code}</h3>
              </Col>
              <Col md={12}>
                <label className={styles.userProfileLabel}>
                  {messages.labels.country}
                </label>
                <h3>{profileData.country}</h3>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </>
  );
};

export default userProfileDetails;
