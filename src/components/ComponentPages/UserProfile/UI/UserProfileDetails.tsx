import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import md5 from "md5";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import CommonCards from "components/shared/Card";
import { getGravatarImage } from "components/shared/AvaratGroup/avatar";

const ItemCard = ({ icon, label, text }) => {
  return (
    <div className="w-full lg:w-5/12">
      <label className="flex gap-2 text-canLight font-normal text-xs">
        <span>{icon}</span>
        <span>{label}</span>
      </label>
      <h3 className="text-canBlack font-medium text-sm">{text}</h3>
    </div>
  );
};

const UserProfileDetails = ({
  profileData,
  userSupportedCampsList,
  userProfileCardSkeleton,
}) => {
  const [isGravatarAvailable, setIsGravatarAvailable] = useState(false);

  useEffect(() => {
    const fetchGravatarImage = async () => {
      if (!profileData?.profile_picture && profileData?.email) {
        const available = await getGravatarImage(profileData?.email);
        setIsGravatarAvailable(available);
      }
    };

    fetchGravatarImage();
  }, [profileData?.email]);

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

  const imagePath = profileData?.profile_picture
    ? profileData?.profile_picture
    : !profileData?.profile_picture && isGravatarAvailable
    ? `https://www.gravatar.com/avatar/${md5(profileData?.email)}.png`
    : null;

  const address = `${profileData.address_1}, ${profileData.address_2}, ${profileData.city}, ${profileData.country} - ${profileData.postal_code}`;

  return (
    <CommonCards className="bg-white lg:bg-canGray mt-10 lg:mt-2">
      <div className={`flex gap-5 flex-wrap`}>
        {imagePath && (
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden object-cover [&_img]:object-cover [&_img]:object-top">
            <Image
              src={imagePath}
              alt="profile-picture"
              width={100}
              height={100}
              style={{ borderRadius: "50px" }}
            />
          </div>
        )}

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
            />
          ) : null}
          {profileData?.email ? (
            <ItemCard
              icon={<MailOutlined />}
              label={messages.labels.emailAddress}
              text={profileData.email}
            />
          ) : null}
          {profileData?.birthday ? (
            <ItemCard
              icon={<CalendarOutlined />}
              label="Date of Birth"
              text={profileData.birthday}
            />
          ) : null}
          {address ? (
            <ItemCard
              icon={<MailOutlined />}
              label={messages.labels.address}
              text={address}
            />
          ) : null}
        </div>
      </div>
    </CommonCards>
  );
};

export default UserProfileDetails;
