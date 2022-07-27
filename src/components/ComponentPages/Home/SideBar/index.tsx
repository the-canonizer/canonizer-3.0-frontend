import { Button, Drawer } from "antd";
import React, { useState } from "react";
import { isServer } from "src/utils/generalUtility";
import TopicsFilter from "../../../common/topicsFilter";

export default function HomeSideBar({ onCreateCamp = () => {} }) {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      {!isServer && window.innerWidth >= 768 && (
        <TopicsFilter onCreateCamp={onCreateCamp} />
      )}
      {!isServer && window.innerWidth <= 767 && (
        <>
          <Button type="primary" onClick={showDrawer}>
            Open
          </Button>
          <Drawer
            title="Filters"
            placement="right"
            onClose={onClose}
            visible={visible}
          >
            <TopicsFilter onCreateCamp={onCreateCamp} />
          </Drawer>
        </>
      )}
    </>
  );
}
