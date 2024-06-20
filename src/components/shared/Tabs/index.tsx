import { Tabs } from "antd";

const CustomTabs = ({ className = "", ...props }: any) => {
  return (
    <Tabs
      className={`text-14 text-black font-normal ${className}`}
      {...props}
    >
      {props?.children}
    </Tabs>
  );
};

export default CustomTabs;
