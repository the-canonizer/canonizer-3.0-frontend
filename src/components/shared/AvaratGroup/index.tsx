import { Avatar } from "antd";

import CustomSkelton from "src/components/common/customSkelton";
import SingleAvatar from "./avatar";

const AvatarGroup = ({
  avatars = [],
  loading = false,
  maxCount = 4,
  imageBaseURL = "",
  haveShowMore = 0,
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
      maxCount={haveShowMore > 0 ? maxCount + 1 : maxCount}
      {...restProps}
      id="browse-topic-avatars-container"
      className="[&_.ant-avatar]:!bg-canBlue2 [&_.ant-avatar]:border-2 [&_.ant-avatar-string]:!text-canBlack"
    >
      {avatars?.map((av) => (
        <SingleAvatar user={av} key={av?.id} imageBaseURL={imageBaseURL} />
      ))}
      {haveShowMore > 0 ? (
        <Avatar
          className="uppercase flex justify-center items-center text-[0.6rem]"
          data-testId={`show-more-avatar-${haveShowMore}`}
        >
          {haveShowMore > 0 ? "+" + haveShowMore : ""}
        </Avatar>
      ) : null}
    </Avatar.Group>
  );
};

export default AvatarGroup;
