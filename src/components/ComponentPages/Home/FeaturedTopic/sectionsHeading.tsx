import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

import Headings from "src/components/shared/Typography";

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
  return (
    <Headings
      level={5}
      className={`text-sm relative font-bold uppercase ${className}`}
    >
      <span className="mr-3">{title}</span>
      {icon ? (
        <Tooltip title={infoContent} placement="top">
          {icon}
        </Tooltip>
      ) : null}
    </Headings>
  );
};

SectionHeading.propTypes = propTypes;

export default SectionHeading;
