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

const SingleAvatar = ({ user }) => {
  const [isGravatarAvailable, setIsGravatarAvailable] = useState(false);

  useEffect(() => {
    const fetchGravatarImage = async () => {
      if (!user?.profile_picture_path && user?.email) {
        const available = await getGravatarImage(user?.email);
        setIsGravatarAvailable(available);
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
      return <Avatar src={user?.profile_picture_path} />;
    }

    if (!user?.profile_picture_path && isGravatarAvailable) {
      return (
        <Avatar
          src={`https://www.gravatar.com/avatar/${md5(user?.email)}.png`}
        />
      );
    }

    if (!user?.profile_picture_path && !isGravatarAvailable) {
      return (
        <Avatar className="uppercase flex justify-center items-center text-xs">
          {user?.first_name?.charAt(0)}
        </Avatar>
      );
    }

    return <Avatar icon={<UserOutlined />} />;
  };

  return (
    <Popover content={userName} placement="top">
      {renderAvatar()}
    </Popover>
  );
};

export default SingleAvatar;
