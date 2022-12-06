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

const { Text } = Typography;

const SocialShare = ({ campUrl, campName }) => {
  return (
    <div className={styles.wrapper}>
      <Text className={styles.social_login_text} id="social-login-title">
        Share current topic/camp on the social media.
      </Text>
      <div className={styles.btn_group}>
        <FacebookShareButton
          url={campUrl}
          quote={campName}
          hashtag={`#${window?.location?.hostname}`}
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
