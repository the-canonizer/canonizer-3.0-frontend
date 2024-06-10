import React, { Fragment } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { useSelector } from "react-redux";
import md5 from "md5";

import { RootState } from "src/store";

const ProfileInfo = ({
  isGravatarImage,
  loadingImage,
  loggedUser,
  isMobile,
  menu = <></>,
}: any) => {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  let dataMain = (
    <Space size={isMobile ? "small" : "large"}>
      {loggedInUser?.profile_picture && !loadingImage ? (
        <Avatar
          style={{
            cursor: "pointer",
          }}
          src={loggedInUser?.profile_picture}
          size={isMobile ? "small" : "default"}
        />
      ) : isGravatarImage && !loadingImage ? (
        loggedInUser?.email && (
          <Avatar
            src={`https://www.gravatar.com/avatar/${md5(
              loggedInUser?.email
            )}.png`}
          />
        )
      ) : (
        <Avatar
          style={{
            border: "1px solid #fff",
            color: "#fff",
            backgroundColor: "#4484ce",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: `${isMobile ? "12px" : ""}`,
            cursor: "pointer",
          }}
          size={isMobile ? "small" : "default"}
        >
          {loggedUser?.first_name?.charAt(0).toUpperCase() +
            loggedUser?.last_name?.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Space>
  );

  return (
    <Fragment>
      <div className="" key="profile_area">
        <div className="hdrUserdropdown" key="user_dropdown">
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
            {dataMain}
          </Dropdown>
        </div>
      </div>
    </Fragment>
  );
};
export default ProfileInfo;
