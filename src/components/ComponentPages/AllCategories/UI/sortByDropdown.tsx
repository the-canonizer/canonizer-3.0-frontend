import { Dropdown } from "antd";
import PropTypes from "prop-types";

import type { MenuProps } from "antd";

import SortIcon from "./sortIcon";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const propTypes = {
  onSort: PropTypes.func,
};

const SortByDropdown = ({ onSort }) => {
  const items: MenuProps["items"] = [
    {
      key: "sort_a_z",
      label: (
        <SecondaryButton
          id="sort_a_z_button"
          className="inline-flex border-0 p-0 !bg-transparent h-auto"
          onClick={(e) => onSort(e, "asc")}
        >
          A-Z{" "}
          <SortIcon id="sort_a_z_icon" className="rotate-180 scale-x-[-1]" />
        </SecondaryButton>
      ),
    },
    {
      key: "sort_z_a",
      label: (
        <SecondaryButton
          id="sort_z_a_button"
          className="inline-flex border-0 p-0 !bg-transparent h-auto"
          onClick={(e) => onSort(e, "desc")}
        >
          Z-A <SortIcon id="sort_z_a_icon" />
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
      <a id="sort_by_link" className="" onClick={(e) => e.preventDefault()}>
        Sort By <SortIcon id="sort_by_icon" />
      </a>
    </Dropdown>
  );
};

SortByDropdown.propTypes = propTypes;

export default SortByDropdown;
