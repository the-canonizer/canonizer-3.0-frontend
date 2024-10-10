import React from "react";
import styles from "../UserProfileUI/UserProfile.module.scss";
import messages from "../../../../messages";
import { Card, Row, Col } from "antd";
import CustomSkelton from "../../../common/customSkelton";
import Image from "next/image";
const UserProfileDetails = ({
  profileData,
  userSupportedCampsList,
  userProfileCardSkeleton,
}: any) => {
  const firstNameLength = 15;
  const lastNameLength = 15;
  return (
    <>
      {
        !userSupportedCampsList?.[0]?.private_status ? (
          <Card
            title={
              <h3 style={{ margin: "0px" }}>{messages.labels.userProfile} </h3>
            }
          >
            {userProfileCardSkeleton ? (
              <CustomSkelton
                skeltonFor="profileDetails"
                bodyCount={3}
                stylingClass=""
                isButton={false}
              />
            ) : (
              <div>
                <div
                  className={`${styles.profileInfo} ${
                    profileData?.profile_picture ? styles.profileAvatar : ""
                  }`}
                >
                  {profileData?.profile_picture && (
                    <div className={styles.profile_picture}>
                      <Image
                        src={profileData.profile_picture}
                        alt="profile-picture"
                        width={90}
                        height={90}
                        style={{ borderRadius: "50px" }}
                      />
                    </div>
                  )}
                  <Row gutter={30} className="user-profile-wrap">
                    {profileData?.first_name || profileData?.last_name ? (
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
                    ) : (
                      ""
                    )}
                    {profileData?.email ? (
                      <Col md={12} sm={12} xs={12}>
                        <label className={styles.userProfileLabel}>
                          {messages.labels.emailAddress}
                        </label>
                        <h3>{profileData.email}</h3>
                      </Col>
                    ) : (
                      ""
                    )}

                    {profileData?.address_1 ? (
                      <Col md={12} sm={12} xs={12}>
                        <label className={styles.userProfileLabel}>
                          {messages.labels.address}
                        </label>
                        <h3>{profileData.address_1}</h3>
                      </Col>
                    ) : (
                      ""
                    )}
                    {profileData?.city ? (
                      <Col md={12} sm={12} xs={12}>
                        <label className={styles.userProfileLabel}>
                          {messages.labels.City}
                        </label>
                        <h3>{profileData.city}</h3>
                      </Col>
                    ) : (
                      ""
                    )}
                    {profileData?.postal_code ? (
                      <Col md={12} sm={12} xs={12}>
                        <label className={styles.userProfileLabel}>
                          {messages.labels.zipcode}
                        </label>
                        <h3>{profileData.postal_code}</h3>
                      </Col>
                    ) : (
                      ""
                    )}
                    {profileData?.country ? (
                      <Col md={12} sm={12} xs={12}>
                        <label className={styles.userProfileLabel}>
                          {messages.labels.country}
                        </label>
                        <h3>{profileData.country}</h3>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                </div>
              </div>
            )}
          </Card>
        ) : (
          ""
        )
        //   "":
        //   <CustomSkelton
        //   skeltonFor="profileDetails"
        //   bodyCount={3}
        //   stylingClass=""
        //   isButton={false}
        // />
      }
    </>
  );
};

export default UserProfileDetails;
