import { Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const CustomSpinner = ({ wrapperClassName = "", className = "", children, ...rest }) => {
  return (
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      wrapperClassName={`h-full overflow-hidden [&_.ant-spin-container]:h-full ${wrapperClassName}`}
      className={`!h-full !max-h-full ${className}`}
      {...rest}
    >
      {children}
    </Spin>
  );
};

export default CustomSpinner;
