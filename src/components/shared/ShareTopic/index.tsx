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

const shareIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-canBlack text-xl font-bold"
  >
    <path
      d="M16 3.42857C16 5.32143 14.4643 6.85714 12.5714 6.85714C11.5393 6.85714 10.6143 6.4 9.98571 5.67857L6.78214 7.28214C6.83214 7.51429 6.85714 7.75357 6.85714 8C6.85714 8.24643 6.83214 8.48571 6.78214 8.71786L9.98571 10.3214C10.6143 9.6 11.5393 9.14286 12.5714 9.14286C14.4643 9.14286 16 10.6786 16 12.5714C16 14.4643 14.4643 16 12.5714 16C10.6786 16 9.14286 14.4643 9.14286 12.5714C9.14286 12.325 9.16786 12.0857 9.21786 11.8536L6.01429 10.25C5.38571 10.9714 4.46071 11.4286 3.42857 11.4286C1.53571 11.4286 0 9.89286 0 8C0 6.10714 1.53571 4.57143 3.42857 4.57143C4.46071 4.57143 5.38571 5.02857 6.01429 5.75L9.21786 4.14643C9.16786 3.91429 9.14286 3.675 9.14286 3.42857C9.14286 1.53571 10.6786 0 12.5714 0C14.4643 0 16 1.53571 16 3.42857ZM3.42857 9.71429C3.88323 9.71429 4.31926 9.53367 4.64075 9.21218C4.96225 8.89069 5.14286 8.45466 5.14286 8C5.14286 7.54534 4.96225 7.10931 4.64075 6.78782C4.31926 6.46633 3.88323 6.28571 3.42857 6.28571C2.97391 6.28571 2.53788 6.46633 2.21639 6.78782C1.8949 7.10931 1.71429 7.54534 1.71429 8C1.71429 8.45466 1.8949 8.89069 2.21639 9.21218C2.53788 9.53367 2.97391 9.71429 3.42857 9.71429ZM14.2857 3.42857C14.2857 3.20345 14.2414 2.98053 14.1552 2.77254C14.0691 2.56456 13.9428 2.37557 13.7836 2.21639C13.6244 2.0572 13.4354 1.93093 13.2275 1.84478C13.0195 1.75863 12.7966 1.71429 12.5714 1.71429C12.3463 1.71429 12.1234 1.75863 11.9154 1.84478C11.7074 1.93093 11.5184 2.0572 11.3592 2.21639C11.2001 2.37557 11.0738 2.56456 10.9876 2.77254C10.9015 2.98053 10.8571 3.20345 10.8571 3.42857C10.8571 3.65369 10.9015 3.87661 10.9876 4.0846C11.0738 4.29259 11.2001 4.48157 11.3592 4.64075C11.5184 4.79994 11.7074 4.92621 11.9154 5.01237C12.1234 5.09852 12.3463 5.14286 12.5714 5.14286C12.7966 5.14286 13.0195 5.09852 13.2275 5.01237C13.4354 4.92621 13.6244 4.79994 13.7836 4.64075C13.9428 4.48157 14.0691 4.29259 14.1552 4.0846C14.2414 3.87661 14.2857 3.65369 14.2857 3.42857ZM12.5714 14.2857C13.0261 14.2857 13.4621 14.1051 13.7836 13.7836C14.1051 13.4621 14.2857 13.0261 14.2857 12.5714C14.2857 12.1168 14.1051 11.6807 13.7836 11.3592C13.4621 11.0378 13.0261 10.8571 12.5714 10.8571C12.1168 10.8571 11.6807 11.0378 11.3592 11.3592C11.0378 11.6807 10.8571 12.1168 10.8571 12.5714C10.8571 13.0261 11.0378 13.4621 11.3592 13.7836C11.6807 14.1051 12.1168 14.2857 12.5714 14.2857Z"
      fill="#242B37"
    />
  </svg>
);

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
        {shareIcon}
        {/* <ShareAltOutlined className="text-canBlack p-1 text-xl font-bold" /> */}
      </a>
    </Dropdown>
  );
};

export default SocialShareTopic;