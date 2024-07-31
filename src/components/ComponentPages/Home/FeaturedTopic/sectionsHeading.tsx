import { Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import Headings from "src/components/shared/Typography";
import { useRouter } from "next/router";

const propTypes = {
  title: PropTypes.string,
  infoContent: PropTypes.string,
  icon: PropTypes.element,
};

const SectionHeading = ({
  title,
  infoContent,
  icon = <InfoCircleOutlined />,
  className = "",
}) => {
  const router = useRouter();
  return (
    <Headings level={5} className={`text-sm font-bold uppercase ${className}`}>
      {title}{" "}
      {icon ? (
        <Popover content={infoContent} placement="top">
          {icon}
        </Popover>
      ) : null}
    </Headings>
  );
};

SectionHeading.propTypes = propTypes;

export default SectionHeading;