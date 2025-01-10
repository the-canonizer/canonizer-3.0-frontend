import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarOutlined,
  MailOutlined,
  UserOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import md5 from "md5";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import { getGravatarImage } from "components/shared/AvaratGroup/avatar";
import { Avatar, Tooltip } from "antd";
import { useIsMobile } from "src/hooks/useIsMobile";

const ItemCard = ({ icon, label, text, showTooltip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full lg:w-5/12">
      <label className="flex gap-2 text-canLight font-normal text-xs cursor-pointer">
        <span>{icon}</span>
        <span>{label}</span>
      </label>
      <h3
        className="text-canBlack font-medium text-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tooltip
          title={
            <span>
              You are not able to see this because the owner of this information
              has set this as <b>Private</b>.
            </span>
          }
          visible={showTooltip && isHovered}
        >
          {text}
        </Tooltip>
      </h3>
    </div>
  );
};
const UserProfileDetails = ({
  profileData,
  userSupportedCampsList,
  userProfileCardSkeleton,
}) => {
  const isMobile = useIsMobile();
  const [gravatarAvailable, setGravatarAvailable] = useState(null);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    const fetchGravatarImage = async () => {
     if (!profileData?.profile_picture && profileData?.email) {
        const res = await getGravatarImage(profileData?.email);
        setGravatarAvailable(res);
    }
    };
    fetchGravatarImage();
  }, [profileData?.email]);

  const checkFieldIsPrivate = (field) => {
    return profileData?.private_flags?.split(",").includes(field);
  };

  const firstNameLength = 15;
  const lastNameLength = 15;

  if (userSupportedCampsList?.[0]?.private_status) {
    return null;
  }

  if (userProfileCardSkeleton) {
    return (
      <CommonCards>
        <CustomSkelton
          skeltonFor="profileDetails"
          bodyCount={3}
          stylingClass=""
          isButton={false}
        />
      </CommonCards>
    );
  }

let imagePath = null;

// Check if profile picture is available, otherwise check if Gravatar is available
  if (profileData?.profile_picture) {
    imagePath = profileData.profile_picture;
  } else if (!profileData?.profile_picture && gravatarAvailable) {
    imagePath = gravatarAvailable;
  }
  
  const address_data = {
    address_1: profileData?.address_1,
    address_2: profileData?.address_2,
    city: profileData?.city,
    country: profileData?.country,
    postal_code: profileData?.postal_code ? `- ${profileData.postal_code}` : "",
  };

  // const address = addressParts
  //   .filter(Boolean) // Filters out any falsy values (null, undefined, empty string)
  //   .join(", ") // Joins the non-empty parts with a comma and space
  //   .trim(); // Ensures no leading or trailing spaces

  const getNameInitials = (first_name, last_name) => {
    if (first_name && last_name) {
      return first_name?.charAt(0) + last_name?.charAt(0);
    } else if (first_name) {
      return first_name?.charAt(0);
    } else if (last_name) {
      return last_name?.charAt(0);
    } else {
      return null;
    }
  };

  const renderedAddress = Object?.entries(address_data)
    ?.filter(([key, value]) => Boolean(value))
    ?.map(([key, value], index) => (
      <Tooltip
        key={key}
        title={
          checkFieldIsPrivate(key) ? (
            <span>
              You are not able to see this because the owner of this information
              has set this as <b>Private</b>.
            </span>
          ) : undefined
        }
      >
        <span>
          {value}
          {index <
          Object?.entries(address_data).filter(([_, val]) => Boolean(val))
            ?.length -
            1
            ? ", "
            : ""}
        </span>
      </Tooltip>
    ));

  const renderUserImage = () => {
    return (
      <>
        {!imagePath &&
        (profileData?.first_name == undefined ||
          profileData?.last_name == undefined) ? (
          <Avatar
            style={{ fontSize: `${isMobile ? "25px" : "30px"}` }}
            size={95}
            className="uppercase bg-canBlue text-white flex justify-center items-center  text-sm border-[1px] border-solid border-white -mb-[10px]"
            icon={<UserOutlined />}
          />
        ) : !imagePath ? (
          <Avatar
            style={{ fontSize: `${isMobile ? "25px" : "20px"}` }}
            size={100}
            className="uppercase bg-canBlue text-white flex justify-center items-center  text-sm border-[1px] border-solid border-white -mb-[10px]"
          >
            {getNameInitials(profileData?.first_name, profileData?.last_name)}
          </Avatar>
        ) : (
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden object-cover [&_img]:object-cover [&_img]:object-top">
            <Image
              src={imagePath}
              alt="profile-picture"
              width={100}
              height={100}
              style={{ borderRadius: "50px" }}
              onError={() => {
                setProfileImageError(true);
              }}
            />
          </div>
        )}
      </>
    );
  };
  return (
    <CommonCards className="bg-white lg:bg-canGray mt-10 lg:mt-2">
      <div className={`flex gap-5 flex-wrap`}>
        {/* {!imagePath || profileImageError ? (
          <Avatar
            style={{ fontSize: `${isMobile ? "25px" : "20px"}` }}
            size={100}
            className="uppercase bg-canBlue text-white flex justify-center items-center  text-sm border-[1px] border-solid border-white -mb-[10px]"
          >
            {getNameInitials(profileData?.first_name, profileData?.last_name)}
          </Avatar>
        ) : (
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden object-cover [&_img]:object-cover [&_img]:object-top">
            <Image
              src={imagePath}
              alt="profile-picture"
              width={100}
              height={100}
              style={{ borderRadius: "50px" }}
              onError={() => {
                setProfileImageError(true);
              }}
            />
          </div>
        )} */}

        {renderUserImage()}
        <div className="flex flex-wrap gap-4">
          {profileData?.first_name || profileData?.last_name ? (
            <ItemCard
              icon={<UserOutlined />}
              label={messages.labels.name}
              text={
                (profileData.first_name?.length > firstNameLength
                  ? profileData.first_name.substring(0, 15) + "..."
                  : profileData.first_name
                  ? profileData.first_name
                  : "") +
                " " +
                (profileData.last_name?.length > lastNameLength
                  ? profileData.last_name.substring(0, 15) + "..."
                  : profileData.last_name
                  ? profileData.last_name
                  : "")
              }
              showTooltip={
                checkFieldIsPrivate("first_name") ||
                checkFieldIsPrivate("last_name")
              }
            />
          ) : null}
          {profileData?.email ? (
            <Tooltip title="Consult with the owner of the data to make it public">
              <ItemCard
                icon={<MailOutlined />}
                label={messages.labels.emailAddress}
                text={profileData.email}
                showTooltip={checkFieldIsPrivate("email")}
              />
            </Tooltip>
          ) : null}
          {profileData?.birthday ? (
            <ItemCard
              icon={<CalendarOutlined />}
              label="Date of Birth"
              text={profileData.birthday}
              showTooltip={checkFieldIsPrivate("birthday")}
            />
          ) : null}
          {Object?.keys(address_data)?.length ? (
            <ItemCard
              icon={<EnvironmentOutlined />}
              label={messages.labels.address}
              text={<>{renderedAddress}</>}
              showTooltip={false} // Tooltips are handled individually
            />
          ) : null}
        </div>
      </div>
    </CommonCards>
  );
};

export default UserProfileDetails;
