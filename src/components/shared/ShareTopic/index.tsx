import {
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { ShareAltOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

import type { MenuProps } from "antd";

import { isServer } from "src/utils/generalUtility";

const SocialShareTopic = ({ campUrl, campName }) => {
  const items: MenuProps["items"] = [
    {
      key: "facebook_share",
      label: (
        <FacebookShareButton
          url={campUrl}
          quote={campName}
          hashtag={`#${!isServer() && window?.location?.hostname}`}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      ),
    },
    {
      key: "twitter_share",
      label: (
        <TwitterShareButton url={campUrl} title={campName}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      ),
    },
    {
      key: "linkedin_share",
      label: (
        <LinkedinShareButton url={campUrl}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      ),
    },
  ];

  return (
    <Dropdown
      key="dropdown_menus"
      placement="bottomRight"
      menu={{ items }}
      trigger={["click"]}
      overlayClassName="[&_.ant-dropdown-menu]:flex [&_.ant-dropdown-menu]:py-2 [&_.ant-dropdown-menu]:px-2 rounded-lg overflow-hidden shadow-md [&_.ant-dropdown-menu-title-content]:flex"
    >
      <a className="" onClick={(e) => e.preventDefault()}>
        <ShareAltOutlined className="text-canBlack p-1 text-xl font-bold" />
      </a>
    </Dropdown>
  );
};

export default SocialShareTopic;
