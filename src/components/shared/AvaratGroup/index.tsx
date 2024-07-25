import { Avatar } from "antd";

import CustomSkelton from "src/components/common/customSkelton";
import SingleAvatar from "./avatar";

const AvatarGroup = ({
  avatars = [],
  loading = false,
  maxCount = 4,
  ...restProps
}: any) => {
  if (loading) {
    return (
      <CustomSkelton
        skeltonFor="list"
        bodyCount={1}
        stylingClass="listSkeleton"
        isButton={false}
      />
    );
  }

  if (!avatars?.length) {
    return null;
  }

  return (
    <Avatar.Group
      maxCount={maxCount}
      {...restProps}
      className="[&_.ant-avatar]:!bg-canBlue2 [&_.ant-avatar-string]:!text-canBlack"
    >
      {avatars?.map((av) => (
        <SingleAvatar user={av} key={av?.id} />
      ))}
    </Avatar.Group>
  );
};

export default AvatarGroup;
