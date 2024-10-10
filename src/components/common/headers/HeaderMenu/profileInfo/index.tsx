import React, { Fragment } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { useSelector } from "react-redux";
import md5 from "md5";
import { DownOutlined } from "@ant-design/icons";

import { RootState } from "src/store";

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
        src={loggedInUser?.profile_picture}
        size={isMobile ? "small" : "default"}
        className="-mb-[10px] cursor-pointer"
      />
    ) : isGravatarImage && !loadingImage ? (
      loggedInUser?.email && (
        <Avatar
          src={`https://www.gravatar.com/avatar/${md5(
            loggedInUser?.email
          )}.png`}
          className="-mb-[10px] cursor-pointer"
        />
      )
    ) : (
      <Avatar
        style={{ fontSize: `${isMobile ? "12px" : ""}` }}
        size={isMobile ? "small" : "default"}
        className="uppercase bg-canBlue text-white flex justify-center items-center  text-sm border-[1px] border-solid border-white -mb-[10px]"
      >
        {loggedUser?.first_name?.charAt(0) + loggedUser?.last_name?.charAt(0)}
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
