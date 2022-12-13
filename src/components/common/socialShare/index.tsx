import { Typography } from "antd";
import {
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";

import styles from "./social-share.module.scss";

import { isServer } from "../../../utils/generalUtility";

const { Text } = Typography;

const SocialShare = ({ campUrl, campName }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.btn_group}>
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
  );
};

export default SocialShare;
