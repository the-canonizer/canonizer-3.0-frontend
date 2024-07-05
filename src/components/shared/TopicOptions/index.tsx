import { useEffect } from "react";
import {
  EditOutlined,
  LineChartOutlined,
  MoreOutlined,
  PrinterOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import Link from "next/link";

import type { MenuProps } from "antd";

import SecondaryButton from "../Buttons/SecondaryButton";
import HandIcon from "components/ComponentPages/Home/TrandingTopic/handIcon";
import GenerateModal from "components/common/generateScript";
import SupportIcon from "./statementIcon";
import CodeIcon from "./codeIcon";

const TopicOptions = ({ eventLineHref = "" }) => {
  const onPrint = () => {
    const hiddenElem = document.querySelector(".currentCampRecords"),
      insideDiv = hiddenElem?.querySelector(".ant-collapse-item"),
      header: any = hiddenElem?.querySelector(".ant-collapse-header");

    if (!insideDiv?.classList?.contains("ant-collapse-item-active")) {
      header?.click();
    }

    setTimeout(() => {
      if (insideDiv?.classList?.contains("ant-collapse-item-active")) {
        header?.click();
      }
    }, 5000);
  };

  useEffect(() => {
    window.onbeforeprint = () => onPrint();
  }, []);

  const onPrintCamp = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    onPrint();

    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };

  const items: MenuProps["items"] = [
    {
      key: "event_line",
      label: (
        <Link href={eventLineHref} passHref>
          <a className="text-canBlack font-medium text-sm">Event Line</a>
        </Link>
      ),
      icon: <LineChartOutlined className="!text-canBlack font-medium" />,
      className: "",
    },
    {
      key: "topic_subscribe_btn",
      label: (
        <SecondaryButton className="border-0 p-0 text-canBlack font-medium text-sm hocus:!bg-transparent hocus:!text-canBlack p-0">
          Subscribe to entire Topic
        </SecondaryButton>
      ),
      icon: <WifiOutlined className="rotate-45" />,
    },
    {
      key: "camp_subscribe_btn",
      label: (
        <SecondaryButton className="border-0 p-0 text-canBlack font-medium text-sm hocus:!bg-transparent hocus:!text-canBlack p-0">
          Subscribe to the Camp{" "}
        </SecondaryButton>
      ),
      icon: <WifiOutlined className="rotate-45" />,
    },
    {
      key: "join_and_support",
      label: (
        <SecondaryButton className="border-0 p-0 text-canBlack font-medium text-sm hocus:!bg-transparent hocus:!text-canBlack p-0">
          Directly join and support
        </SecondaryButton>
      ),
      icon: <HandIcon fill="#242B37" />,
    },
    {
      key: "camp_edit_manage",
      label: (
        <Link href={eventLineHref} passHref>
          <a className="text-canBlack font-medium text-sm">
            Manage/edit this Camp
          </a>
        </Link>
      ),
      icon: <EditOutlined className="!text-canBlack" />,
    },
    {
      key: "manage_topic",
      label: (
        <Link href={eventLineHref} passHref>
          <a className="text-canBlack font-medium text-sm">
            Manage/edit this Topic
          </a>
        </Link>
      ),
      icon: <EditOutlined className="!text-canBlack" />,
    },
    {
      key: "manage_statement",
      label: (
        <Link href={eventLineHref} passHref>
          <a className="text-canBlack font-medium text-sm">
            Manage/edit Camp statement
          </a>
        </Link>
      ),
      icon: <SupportIcon />,
    },
    {
      key: "ebed_code",
      label: <GenerateModal topic_num="" camp_num="" />,
      icon: <CodeIcon />,
    },
    {
      key: "print",
      label: (
        <a onClick={onPrintCamp} className="font-medium text-sm">
          Print
        </a>
      ),
      icon: <PrinterOutlined className="!text-canBlack" />,
    },
  ];

  return (
    <Dropdown
      key="dropdown_menus"
      placement="bottomRight"
      menu={{ items }}
      trigger={["click"]}
      overlayClassName="rounded-lg overflow-hidden shadow-md [&_.ant-dropdown-menu]:px-3 [&_.ant-dropdown-menu]:pb-0 [&_.ant-dropdown-menu-item]:!py-2 [&_.ant-dropdown-menu-item]:!px-0 [&_.ant-dropdown-menu-item]:border-b-2 [&_.ant-dropdown-menu-title-content]:before:content-['|'] [&_.ant-dropdown-menu-title-content]:before:pl-1 [&_.ant-dropdown-menu-title-content]:before:pr-2 [&_.ant-dropdown-menu-title-content]:before:text-canGrey2 [&_.ant-dropdown-menu-title-content]:flex [&_.ant-dropdown-menu-title-content]:items-center [&_.ant-dropdown-menu-title-content]:justify-start"
      className="ml-3"
    >
      <a className="" onClick={(e) => e.preventDefault()}>
        <MoreOutlined className="!text-canBlack p-1 !text-2xl !font-bold" />
      </a>
    </Dropdown>
  );
};

export default TopicOptions;
