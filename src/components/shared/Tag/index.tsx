import { Tag } from "antd";

const Headings = ({ className = "", icon = "", ...props }: any) => {
  return (
    <Tag className={`text-base text-black font-normal ${className}`} icon={icon} {...props}>
      {props?.children}
    </Tag>
  );
};

export default Headings;
