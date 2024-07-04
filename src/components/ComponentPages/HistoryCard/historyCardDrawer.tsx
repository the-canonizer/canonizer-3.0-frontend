import { Button, Drawer, List, Modal, Tabs, Typography } from "antd";

import { useState } from "react";

const { Title } = Typography;

function HistoryCardDrawer({
  onClick,
  displayText,
  agreedSupporters=[],
  notAgreedSupporters=[],
}: any) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    onClick()
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const data = [
    "Jane Doe",
    "Jane Doe",
    "Jane Doe",
    "Jane Doe",
    "Jane Doe",
    "Jane Doe",
  ];
  return (
    <div onClick={open ? onClose : showDrawer}>
      <Button type="link" className="p-0" onClick={showDrawer}>
        <i className="icon-info-light"></i>
      </Button>
      <Drawer
        closable={false}
        className="ch-drawer"
        placement="right"
        onClose={onClose}
        open={open}
        width={627}
      >
        <Button
          type="link"
          className="text-2xl text-[#242B37] p-0 mb-8 gap-5 flex items-center leading-none"
          icon={<i className="icon-back"></i>}
        >
          Support Status
        </Button>
        <Tabs defaultActiveKey="1" className="ch-modal-tabs">
          <Tabs.TabPane tab="Agreed" key="1">
            <List
              className="agree-list"
              header={<div>Nickname </div>}
              footer={false}
              bordered
              dataSource={agreedSupporters}
              renderItem={(item:any) => <List.Item>{item?.nickNameData?.name}</List.Item>}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Not Agreed" key="2">
            <List
              className="agree-list nt-agree"
              header={<div>Nickname </div>}
              footer={false}
              bordered
              dataSource={notAgreedSupporters}
              renderItem={(item:any) => <List.Item>{item?.nickNameData?.name}</List.Item>}
            />
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
      {displayText}
    </div>
  );
}

export default HistoryCardDrawer;
