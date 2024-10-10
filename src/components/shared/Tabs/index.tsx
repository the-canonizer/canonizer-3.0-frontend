import { Tabs } from "antd";

const CustomTabs = ({ className = "", ...props }: any) => {
  return (
    <Tabs
      className={`text-sm text-canBlack font-normal [&_.ant-tabs-tab-btn]:!border-none ${className}`}
      {...props}
    >
      {props?.children}
    </Tabs>
  );
};

export default CustomTabs;
