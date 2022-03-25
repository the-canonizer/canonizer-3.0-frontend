import { message, Col, Divider, Row, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import {
  FacebookFilled,
  TwitterOutlined,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import styles from "./Social.module.scss";

import {
  socialLogin,
  userSocialAccountsList,
  userSocialAccountDelete,
} from "../../../network/api/userApi";
import Details from "./details";

const { Text } = Typography;

function SocialAuthVerification() {
  const [socialLinks, setSocialLinks] = useState({});

  const fetchList = async () => {
    const res = await userSocialAccountsList();

    if (res && res.status_code === 200) {
      const socialData = {};

      res.data.forEach((s) => {
        socialData[s.provider] = s.id;
        socialData[s.provider + "_email"] = s.social_email;
        socialData[s.provider + "_name"] = s.social_name;
      });

      setSocialLinks(socialData);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onLinkClick = async (provider) => {
    let body = { provider };
    const res = await socialLogin(body);

    try {
      if (res.data) {
        localStorage.setItem("redirectTab", "tab=social");
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUnlinkClick = async (provider, id) => {
    const res = await userSocialAccountDelete(id);

    if (res && res.status_code === 200) {
      message.success(res.message);
      fetchList();
    }
  };

  console.log("link:- ", socialLinks);

  return (
    <Fragment>
      <section className={`${styles.wrapper}`}>
        <div className={`${styles.icon_container}`}>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <Image
                  width={30}
                  height={30}
                  alt="google-logo"
                  src="/images/google.svg"
                />
                <caption>Google</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Details
                  socialLinks={socialLinks}
                  onUnlinkClick={onUnlinkClick}
                  onLinkClick={onLinkClick}
                  provider="google"
                />
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <FacebookFilled />
                <caption>facebook</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Details
                  socialLinks={socialLinks}
                  onUnlinkClick={onUnlinkClick}
                  onLinkClick={onLinkClick}
                  provider="facebook"
                />
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <TwitterOutlined />
                <caption>Twitter</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Details
                  socialLinks={socialLinks}
                  onUnlinkClick={onUnlinkClick}
                  onLinkClick={onLinkClick}
                  provider="twitter"
                />
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <LinkedinFilled />
                <caption>Linkedin</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Details
                  socialLinks={socialLinks}
                  onUnlinkClick={onUnlinkClick}
                  onLinkClick={onLinkClick}
                  provider="linkedin"
                />
              </div>
            </div>
          </div>
          <div className={`${styles.icon_wrapper}`}>
            <div className={`${styles.icon_box}`}>
              <div className={`${styles.icons}`}>
                <GithubFilled />
                <caption>Github</caption>
              </div>
              <Divider plain className={styles.divider} />
              <div className={`${styles.content}`}>
                <Details
                  socialLinks={socialLinks}
                  onUnlinkClick={onUnlinkClick}
                  onLinkClick={onLinkClick}
                  provider="github"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default SocialAuthVerification;
