import { Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import CustomSkelton from "src/components/common/customSkelton";

function formatNumber(num) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  if (num > 99) {
    return "99+";
  }
  return num.toString();
}

const ViewCounts = ({
  views = 0,
  loading = false,
  className = "",
  ...restProps
}) => {
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

  return (
    <Typography.Paragraph
      className={`m-0 !text-canLight font-medium font-inter flex items-center ${className}`}
      {...restProps}
    >
      <EyeOutlined className="text-canLight p-1 text-medium" />{" "}
      {!views || views == 0 ? 0 : formatNumber(views)}
    </Typography.Paragraph>
  );
};

export default ViewCounts;
