import React, { useEffect, useState } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { RootState } from "src/store";

const ProfileInfo = ({
  isGravatarImage,
  loadingImage,
  loggedUser,
  isMobile,
  menu = <></>,
  withoutDropdown = false,
  showGravatar = false,
}: any) => {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  let dataMain;

  if (loggedInUser?.profile_picture && !loadingImage) {
    dataMain = (
      <Avatar
        src={loggedInUser?.profile_picture}
        size={isMobile ? "small" : "default"}
        className="-mb-[10px] cursor-pointer"
      />
    );
  } else if (!loadingImage) {
    dataMain = (
      <Avatar
        src={loggedInUser?.profile_picture}
        className="-mb-[10px] cursor-pointer"
      />
    );
  } else {
    dataMain = (
      <Avatar
        style={{ fontSize: `${isMobile ? "12px" : ""}` }}
        size={isMobile ? "small" : "default"}
        className="uppercase bg-canBlue text-white flex justify-center items-center text-sm border-[1px] border-solid border-white -mb-[10px]"
      >
        {loggedUser?.first_name?.charAt(0) + loggedUser?.last_name?.charAt(0)}
      </Avatar>
    );
  }

  if (withoutDropdown) {
    return dataMain;
  }

  return (
    <div id="profile_area" className="mt-0 lg:-mt-2 mr-2" key="profile_area">
      <Dropdown dropdownRender={() => menu} trigger={["click"]} placement="bottomLeft">
        <a
          id="profile_link"
          onClick={(e) => e.preventDefault()}
          className="[&_.downArrow]:hover:visible [&_.downArrow]:hover:opacity-100"
        >
          <Space id="profile_space">
            {dataMain}
            <DownOutlined
              id="profile_down_arrow"
              className="text-canLight opacity-0 invisible downArrow"
            />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default ProfileInfo;
