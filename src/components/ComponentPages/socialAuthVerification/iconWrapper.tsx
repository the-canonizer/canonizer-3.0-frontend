import { useSelector } from "react-redux";

import Details from "./details";
import { RootState } from "src/store";

function IconWrapper({
  socialLinks,
  onUnlinkClick,
  onLinkClick,
  provider,
  icon,
}) {
  const { globalUserProfileData, globalUserProfileDataEmail } = useSelector(
    (state: RootState) => ({
      globalUserProfileData: state.topicDetails.globalUserProfileData,
      globalUserProfileDataEmail: state.topicDetails.globalUserProfileDataEmail,
    })
  );

  //   <Text strong className={`${styles.name}`}>
  //   {socialLinks[provider + "_name"]}
  // </Text>
  // <Text className={`${styles.email}`}>
  //   {socialLinks[provider + "_email"]}
  // </Text>

  return (
    <div className="border border-canGrey2 rounded-lg flex justify-center bg-canGray">
      <div className="w-full ">
        <div className="px-5 py-5 flex lg:justify-center justify-start items-center shadow-social-icon-shadow bg-white rounded-tl-lg rounded-tr-lg gap-2.5 lg:gap-0 ">
          <div className="flex items-center"> {icon}</div>
          <div className="lg:hidden flex flex-col justify-start items-start">
            <h3 className="mb-1 text-center text-base font-medium text-canBlack">
              {socialLinks[provider + "_name"] ?? globalUserProfileData}
            </h3>
            <p className=" text-center text-sm font-normal text-canBlack">
              {socialLinks[provider + "_email"] ?? globalUserProfileDataEmail}
            </p>
          </div>
        </div>
        <div className="px-5 py-5  w-full flex flex-col justify-center items-center rounded-bl-lg rounded-br-lg ">
          <div className="lg:flex hidden flex-col">
            <h3 className="mb-1 text-center text-base font-medium text-canBlack">
              {socialLinks[provider + "_name"] ?? globalUserProfileData}
            </h3>
            <p className="mb-5 text-center text-sm font-normal text-canBlack">
              {socialLinks[provider + "_email"] ?? globalUserProfileDataEmail}
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
  );
}

export default IconWrapper;
