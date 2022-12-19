import React from "react";
import { Spin } from "antd";
import { usePromiseTracker } from "react-promise-tracker";

export default function Spinner({ children }: any) {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <Spin spinning={promiseInProgress} size="large">
      {children}
    </Spin>
  );
}
