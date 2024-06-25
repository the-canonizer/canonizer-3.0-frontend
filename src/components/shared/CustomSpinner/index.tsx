import { Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const CustomSpinner = (props) => {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      {...props}
    >
      {props.children}
    </Spin>
  );
};

export default CustomSpinner;
