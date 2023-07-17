import {
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { ShareAltOutlined } from "@ant-design/icons";

import styles from "./social-share.module.scss";

import { isServer } from "../../../utils/generalUtility";
import { Fragment } from "react";
import { Dropdown, Menu } from "antd";

const SocialShare = ({ campUrl, campName }) => {
  const campForumDropdownMenu = (
    <Menu className={styles.campForumDropdownMenu}>
      <Menu.Item>
        <div className={styles.wrapper}>
          <div className={"camp-social " + styles.btn_group}>
            <FacebookShareButton
              url={campUrl}
              quote={campName}
              hashtag={`#${!isServer() && window?.location?.hostname}`}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={campUrl} title={campName}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={campUrl}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Fragment>
      <Dropdown
        className={styles.campForumDropdown}
        placement="bottomRight"
        overlay={campForumDropdownMenu}
        trigger={["click"]}
      >
        <a className={styles.shareIcon} onClick={(e) => e.preventDefault()}>
          <span>Share</span> <ShareAltOutlined />
        </a>
      </Dropdown>
    </Fragment>
  );
};

export default SocialShare;
