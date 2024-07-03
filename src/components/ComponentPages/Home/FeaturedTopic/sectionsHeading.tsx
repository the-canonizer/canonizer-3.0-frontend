import { Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import Headings from "src/components/shared/Typography";

const SectionHeading = ({
  title,
  infoContent,
  icon = <InfoCircleOutlined />,
}) => {
  return (
    <Headings level={5} className="text-sm font-bold uppercase">
      {title}{" "}
      {icon ? (
        <Popover content={infoContent} placement="top">
          {icon}
        </Popover>
      ) : null}
    </Headings>
  );
};

export default SectionHeading;
