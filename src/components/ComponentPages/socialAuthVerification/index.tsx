import { message } from "antd";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import {
  FacebookFilled,
  GithubFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import styles from "./Social.module.scss";

import {
  socialLogin,
  userSocialAccountsList,
  userSocialAccountDelete,
} from "../../../network/api/userApi";
import IconWrapper from "./iconWrapper";
import MultiUserModal from "./multipleAccounts";
import isAuth from "../../../hooks/isUserAuthenticated";

function SocialAuthVerification() {
  const [socialLinks, setSocialLinks] = useState({});

  const { isUserAuthenticated } = isAuth();

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
    if (isUserAuthenticated) {
      fetchList();
    }
  }, [isUserAuthenticated]);

  const onLinkClick = async (provider) => {
    let body = { provider };
    const res = await socialLogin(body);

    if (res && res.status_code === 200) {
      // dispatch(
      //   setValue({ label: "redirect_tab_setting", value: "tab=social" })
      // );
      localStorage.setItem("redirectTab", "tab=social");
      window.location.href = res.data.url;
    }
  };

  const onUnlinkClick = async (provider, id) => {
    const res = await userSocialAccountDelete(id);

    if (res && res.status_code === 200) {
      message.success(res.message);
      fetchList();
    }
  };

  return (
    <Fragment>
      <section className={`${styles.wrapper}`}>
        <h3 className="mb-5 uppercase text-canBlack font-semibold text-base">
          Social Oauth
        </h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="">
            <IconWrapper
              socialLinks={socialLinks}
              onUnlinkClick={onUnlinkClick}
              onLinkClick={onLinkClick}
              provider=" "
              icon={
                <Image
                  width={32}
                  height={32}
                  alt="google-logo"
                  src="/images/google.svg"
                />
              }
            />
          </div>

          <IconWrapper
            socialLinks={socialLinks}
            onUnlinkClick={onUnlinkClick}
            onLinkClick={onLinkClick}
            provider=""
            icon={<Image
              width={32}
              height={32}
              alt="google-logo"
              src="/images/meta_icon.png"
            />}
          />
          {/* <IconWrapper
            socialLinks={socialLinks}
            onUnlinkClick={onUnlinkClick}
            onLinkClick={onLinkClick}
            provider="twitter"
            icon={<TwitterOutlined />}
          /> */}
          <IconWrapper
            socialLinks={socialLinks}
            onUnlinkClick={onUnlinkClick}
            onLinkClick={onLinkClick}
            provider=""
            icon={<Image
              width={32}
              height={32}
              alt="google-logo"
              src="/images/linkedin.png"
            />}
          />
          <IconWrapper
            socialLinks={socialLinks}
            onUnlinkClick={onUnlinkClick}
            onLinkClick={onLinkClick}
            provider=""
            icon={<Image
              width={32}
              height={32}
              alt="google-logo"
              src="/images/github_icon.png"
            />}
          />
        </div>
      </section>
      <MultiUserModal />
    </Fragment>
  );
}

export default SocialAuthVerification;
