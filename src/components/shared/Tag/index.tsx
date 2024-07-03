import { Tag } from "antd";

const Tags = ({ className = "", icon = "", ...props }: any) => {
  return (
    <Tag className={`text-sm text-canBlack font-normal ${className}`} icon={icon} {...props}>
      {props?.children}
    </Tag>
  );
};

export default Tags;
