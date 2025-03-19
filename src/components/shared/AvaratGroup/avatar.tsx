import { useEffect, useMemo, useState } from "react";
import { Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import md5 from "md5";

import { getGravatarPicApi } from "src/network/api/notificationAPI";

export const getGravatarImage = async (email) => {
  try {
    const res = await getGravatarPicApi(email);
    if (res?.data?.status_code === 200) {
      if (res?.data.data !== null) {
        return `data:image/jpeg;base64,${res.data.data.image_data}`;
      }
      return false;
    }
    return false; // If status_code is not 200, return null
  } catch (error) {
    console.error("Error fetching Gravatar:", error);
    return false;
  }
};

const SingleAvatar = ({ user, imageBaseURL = "" }) => {
  const [isGravatarAvailable, setIsGravatarAvailable] = useState(null);
  const userName = useMemo(() => {
    return `${user?.first_name || ""} ${user?.last_name || ""}`;
  }, [user?.first_name, user?.last_name]);

  const renderAvatar = () => {
    if (user?.profile_picture_path && !isGravatarAvailable) {
      return (
        <Avatar
          className="uppercase flex justify-center items-center text-xs"
          data-testId={`initial-avatar-${user?.id}`}
        >
          {user?.first_name?.charAt(0)}
        </Avatar>
      );
    }

    if (user?.profile_picture_path) {
      return (
        <Avatar
          className="dddd"
          src={imageBaseURL + user?.profile_picture_path}
          data-testId={`browse-topic-avatar-item-${user?.id}`}
        />
      );
    }

    if (!user?.profile_picture_path && isGravatarAvailable) {
      return (
        <Avatar
          src={isGravatarAvailable}
          data-testId={`gravatar-avatar-${user?.id}`}
        />
      );
    }

    if (!user?.profile_picture_path && !isGravatarAvailable) {
      return (
        <Avatar
          className="uppercase flex justify-center items-center text-xs"
          data-testId={`initial-avatar-${user?.id}`}
        >
          {user?.first_name?.charAt(0)}
        </Avatar>
      );
    }

    return (
      <Avatar
        icon={<UserOutlined />}
        data-testId={`default-avatar-${user?.id}`}
      />
    );
  };

  return (
    <Popover
      id={`popover-${user?.id}`}
      content={user?.nick_name}
      placement="top"
    >
      {renderAvatar()}
    </Popover>
  );
};

export default SingleAvatar;
