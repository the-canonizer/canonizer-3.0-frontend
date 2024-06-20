import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";

const Breadcrumbs = ({
  className = "",
  separator = <RightOutlined />,
  ...props
}: any) => {
  return (
    <Breadcrumb
      className={`text-14 text-black font-normal ${className}`}
      separator={separator}
      {...props}
    />
  );
};

export default Breadcrumbs;
