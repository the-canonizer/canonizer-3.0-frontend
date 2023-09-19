import { Divider } from "antd";
import { Fragment } from "react";

import styles from "./Social.module.scss";

import Details from "./details";

function IconWrapper({
  socialLinks,
  onUnlinkClick,
  onLinkClick,
  provider,
  icon,
}: any) {
  return (
    <Fragment>
      <div className={`${styles.icon_wrapper}`}>
        <div className={`${styles.icon_box}`}>
          <div className={`${styles.icons}`}>
            {icon}
            <div className={styles.caption}>{provider}</div>
          </div>
          <Divider plain className={styles.divider} />
          <div className={`${styles.content}`}>
            <Details
              socialLinks={socialLinks}
              onUnlinkClick={onUnlinkClick}
              onLinkClick={onLinkClick}
              provider={provider.toLowerCase()}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default IconWrapper;
