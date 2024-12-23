import { Button, Drawer, List, Tabs } from "antd";
import Link from "next/link";
import { useState } from "react";

import { useIsMobile } from "src/hooks/useIsMobile";

function HistoryCardDrawer({
  onClick,
  displayText,
  agreedSupporters = [],
  notAgreedSupporters = [],
}: any) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    onClick();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div
      onClick={open ? onClose : showDrawer}
      className="flex gap-2 cursor-pointer"
    >
      <Button
        type="link"
        className="p-0 flex mt-0.5 gap-2 cursor-pointer"
        onClick={showDrawer}
      >
        <i className="icon-info-light"></i>
      </Button>
      <Drawer
        closable={false}
        className="ch-drawer"
        placement="right"
        onClose={onClose}
        open={open}
        width={isMobile ? 300 : 627}
      >
        <Button
          id="history-drawer-back-button"
          type="link"
          className="text-lg lg:text-2xl text-canBlack p-0 mb-8 gap-5 flex items-center leading-none"
          icon={<i className="icon-back"></i>}
        >
          Support Status
        </Button>
        <Tabs
          defaultActiveKey="1"
          id="history-drawer-tabs-container"
          className="ch-modal-tabs"
        >
          <Tabs.TabPane tab="Agreed" key="1" id="history-drawer-agree-list">
            <List
              className="agree-list"
              header={<div>Nickname </div>}
              footer={false}
              bordered
              dataSource={agreedSupporters}
              renderItem={(item: any) => (
                <List.Item>
                  <Link
                    href={item && item?.nickNameData?.path}
                    id="history-drawer-agree-list-item"
                  >
                    {item?.nickNameData?.name}
                  </Link>
                </List.Item>
              )}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Not Agreed"
            key="2"
            id="history-drawer-not-agreed-list"
          >
            <List
              className="agree-list nt-agree"
              header={<div>Nickname </div>}
              footer={false}
              bordered
              dataSource={notAgreedSupporters}
              renderItem={(item: any) => (
                <List.Item>
                  <Link
                    href={item && item?.nickNameData?.path}
                    id="history-drawer-not-agreed-list-item"
                  >
                    {item?.nickNameData?.name}
                  </Link>
                </List.Item>
              )}
            />
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
      {displayText}
    </div>
  );
}

export default HistoryCardDrawer;
