import { Divider } from "antd";
import { Fragment } from "react";

import styles from "./Social.module.scss";

import Details from "./details";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

function IconWrapper({
  socialLinks,
  onUnlinkClick,
  onLinkClick,
  provider,
  icon,
}: any) {
  const { globalUserProfileData, globalUserProfileDataEmail } = useSelector(
    (state: RootState) => ({
      globalUserProfileData: state.topicDetails.globalUserProfileData,
      globalUserProfileDataEmail: state.topicDetails.globalUserProfileDataEmail,
    })
  );
  return (
    <Fragment>
      <div className="border border-canGrey2 rounded-lg flex justify-center bg-canGray">
        <div className=" w-full ">
          <div className=" px-5 py-5 flex justify-center items-center shadow-social-icon-shadow bg-white rounded-tl-lg rounded-tr-lg">
            {icon}
            <div className={styles.caption}>{provider}</div>
          </div>
          {/* <Divider plain className={styles.divider} /> */}
          <div className="px-5 py-5  w-full flex flex-col justify-center items-center rounded-bl-lg rounded-br-lg ">
            <div>
              <h3 className="mb-1 text-center text-base font-medium text-canBlack">
              { globalUserProfileData}
              </h3>
              <p className="mb-5 text-center text-sm font-normal text-canBlack">
              { globalUserProfileDataEmail}
              </p>
            </div>

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
