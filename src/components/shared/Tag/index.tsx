import { Tag } from "antd";

const Tags = ({ className = "", icon = "", ...props }: any) => {
  return (
    <Tag className={`text-base text-black font-normal ${className}`} icon={icon} {...props}>
      {props?.children}
    </Tag>
  );
};

export default Tags;
