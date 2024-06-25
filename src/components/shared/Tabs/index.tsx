import { Tabs } from "antd";

const CustomTabs = ({ className = "", ...props }: any) => {
  return (
    <Tabs
      className={`text-sm text-canBlack font-normal ${className}`}
      {...props}
    >
      {props?.children}
    </Tabs>
  );
};

export default CustomTabs;
