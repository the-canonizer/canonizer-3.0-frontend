import { Typography } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import Link from "next/link";

import CustomSkelton from "src/components/common/customSkelton";
import { changeSlashToArrow } from "src/utils/generalUtility";

const NameSpaceLabel = ({ namespace, loading = false, ...restProps }) => {
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

  if (!namespace) {
    return null;
  }

  return (
    <Typography.Paragraph
      className="!bg-transparent border-0 p-0 flex items-center leading-1 !mb-0 mr-3"
      {...restProps}
    >
      <FlagOutlined className="text-canLight p-1 text-medium" />
      <Link href="#">
        <a className="!text-canBlue text-sm font-inter font-medium hover:!canHoverBlue line-clamp-1 max-w-52">
          {changeSlashToArrow(namespace)}
        </a>
      </Link>
    </Typography.Paragraph>
  );
};

export default NameSpaceLabel;
