import { Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const CustomSpinner = (props) => {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      wrapperClassName={`h-full [&_.ant-spin-container]:h-full ${props.wrapperClassName}`}
      className={`h-full ${props.className}`}
      fullscreen
      {...props}
    >
      {props.children}
    </Spin>
  );
};

export default CustomSpinner;
