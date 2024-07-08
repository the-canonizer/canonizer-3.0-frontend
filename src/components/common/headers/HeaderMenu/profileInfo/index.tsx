import React, { Fragment } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { useSelector } from "react-redux";
import md5 from "md5";

import { RootState } from "src/store";
import { DownOutlined } from "@ant-design/icons";

const ProfileInfo = ({
  isGravatarImage,
  loadingImage,
  loggedUser,
  isMobile,
  menu = <></>,
  withoutDropdown = false,
}: any) => {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  let dataMain =
    loggedInUser?.profile_picture && !loadingImage ? (
      <Avatar
        style={{
          cursor: "pointer",
          marginBottom: "-10px",
        }}
        src={loggedInUser?.profile_picture}
        size={isMobile ? "small" : "default"}
      />
    ) : isGravatarImage && !loadingImage ? (
      loggedInUser?.email && (
        <Avatar
          style={{ marginBottom: "-10px" }}
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
          backgroundColor: "#5482C8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: `${isMobile ? "12px" : ""}`,
          cursor: "pointer",
          marginBottom: "-10px",
        }}
        size={isMobile ? "small" : "default"}
      >
        {loggedUser?.first_name?.charAt(0).toUpperCase() +
          loggedUser?.last_name?.charAt(0).toUpperCase()}
      </Avatar>
    );

  if (withoutDropdown) {
    return dataMain;
  }

  return (
    <Fragment>
      <div className="mt-0 lg:-mt-2 mr-2" key="profile_area">
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
          <a
            onClick={(e) => e.preventDefault()}
            className="[&_.downArrow]:hover:visible [&_.downArrow]:hover:opacity-100"
          >
            <Space>
              {dataMain}
              <DownOutlined className="text-canLight opacity-0 invisible downArrow" />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Fragment>
  );
};
export default ProfileInfo;
