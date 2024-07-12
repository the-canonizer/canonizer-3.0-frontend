import { Dropdown } from "antd";

import type { MenuProps } from "antd";

import SortIcon from "./sortIcon";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const SortByDropdown = ({ onSort }) => {
  const items: MenuProps["items"] = [
    {
      key: "sort_a_z",
      label: (
        <SecondaryButton
          className="inline-flex border-0 p-0 !bg-transparent h-auto"
          onClick={(e) => onSort(e, "asc")}
        >
          A-Z <SortIcon className="rotate-180 scale-x-[-1]" />
        </SecondaryButton>
      ),
    },
    {
      key: "sort_z_a",
      label: (
        <SecondaryButton
          className="inline-flex border-0 p-0 !bg-transparent h-auto"
          onClick={(e) => onSort(e, "desc")}
        >
          Z-A <SortIcon />
        </SecondaryButton>
      ),
    },
  ];

  return (
    <Dropdown
      key="dropdown_item"
      placement="bottomRight"
      menu={{ items }}
      trigger={["click"]}
      overlayClassName="rounded-lg overflow-hidden shadow-md [&_.ant-dropdown-menu]:w-24 [&_.ant-dropdown-menu]:pb-0 [&_.ant-dropdown-menu-item]:!py-2 [&_.ant-dropdown-menu-item]:!px-3 [&_.ant-dropdown-menu-item]:border-b-2 [&_.ant-dropdown-menu-title-content]:flex [&_.ant-dropdown-menu-title-content]:items-center [&_.ant-dropdown-menu-title-content]:justify-start"
      className="ml-3 border-[1px] rounded-lg overflow-hidden !text-canBlack w-auto flex py-1 px-3"
    >
      <a className="" onClick={(e) => e.preventDefault()}>
        Sort By <SortIcon />
      </a>
    </Dropdown>
  );
};

export default SortByDropdown;
