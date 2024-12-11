import { useEffect, useMemo, useState } from "react";
import { Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import md5 from "md5";

import { getGravatarPicApi } from "src/network/api/notificationAPI";

export const getGravatarImage = async (email) => {
  let data = await getGravatarPicApi(email);
  if (data?.status == 200) {
    return true;
  }
  return false;
};

const SingleAvatar = ({ user, imageBaseURL = "" }) => {
  const [isGravatarAvailable, setIsGravatarAvailable] = useState(false);

  useEffect(() => {
    const fetchGravatarImage = async () => {
      if (!user?.profile_picture_path && user?.email) {
        getGravatarImage(user?.email)
          .then((res) => setIsGravatarAvailable(res))
          .catch((err) => setIsGravatarAvailable(false));
      }
    };

    fetchGravatarImage();
  }, [user?.email]);

  const userName = useMemo(() => {
    return `${user?.first_name || ""} ${user?.middle_name || ""} ${
      user?.last_name || ""
    }`;
  }, [user?.first_name, user?.middle_name, user?.last_name]);

  const renderAvatar = () => {
    if (user?.profile_picture_path) {
      return (
        <div id={`browse-topic-avatar-item-${user?.id}`}>
          <Avatar
            className="dddd"
            src={imageBaseURL + user?.profile_picture_path}
          />
        </div>
      );
    }

    if (!user?.profile_picture_path && isGravatarAvailable) {
      return (
        <div id={`gravatar-avatar-${user?.id}`}>
          <Avatar
            src={`https://www.gravatar.com/avatar/${md5(user?.email)}.png`}
          />
        </div>
      );
    }

    if (!user?.profile_picture_path && !isGravatarAvailable) {
      return (
        <div id={`initial-avatar-${user?.id}`}>
          <Avatar className="uppercase flex justify-center items-center text-xs">
            {user?.first_name?.charAt(0)}
          </Avatar>
        </div>
      );
    }

    return (
      <div id={`default-avatar-${user?.id}`}>
        <Avatar icon={<UserOutlined />} />
      </div>
    );
  };

  return (
    <Popover id={`popover-${user?.id}`} content={userName} placement="top">
      {renderAvatar()}
    </Popover>
  );
};

export default SingleAvatar;
