import { Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

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

const propTypes = {
  views: PropTypes.number,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

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
      className={`!m-0 !text-canLight font-medium font-inter flex items-center gap-2 ${className}`}
      {...restProps}
    >
      <EyeOutlined className="" />
      <span className="text-canBlack text-opacity-50 text-xs font-normal">
        {!views || views == 0 ? 0 : formatNumber(views)}
      </span>
    </Typography.Paragraph>
  );
};

ViewCounts.propTypes = propTypes;

export default ViewCounts;
