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
    <div className="relative">
      <Avatar.Group maxCount={maxCount} {...restProps}>
        {avatars?.map((av) => (
          <SingleAvatar user={av} />
        ))}
      </Avatar.Group>
    </div>
  );
};

export default AvatarGroup;
