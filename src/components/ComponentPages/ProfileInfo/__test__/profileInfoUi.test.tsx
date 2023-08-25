import { render } from "../../../../utils/testUtils";
import ProfileInfoUI from "../ProfileInfoUI";
import VerifyMobileNumberForm from "../../Form/VerifyMobileNumberForm";

import styles from "./ProfileInfo.module.scss";

const mobileCarrier = [];
const algorithmList = [];
const languageList = [];
const onFinish = () => {};
const onFinishFailed = () => {};
const onVerifyClick = () => {};
const onOTPBtnClick = () => {};
const isOTPModalVisible = true;
const handleOTPCancel = () => {};
const otp = "";
const handleChangeOTP = () => {};
const handleselectAfter = () => {};
const privateFlags = "loading";
const handleAddressChange = () => {};
const handleAddressSelect = () => {};
const address = "";
const toggleVerifyButton = 0;
const handleMobileNumberChange = () => {};
const disableButton = false;
const postalCodeDisable = false;
const userProfileSkeleton = false;
const userProfileSkeletonV = true;

// const innerComponent = <VerifyMobileNumberForm />;
describe("sssfsf", () => {
  it("render", () => {
    const { container } = render(
      <ProfileInfoUI
        form={null}
        formVerify={null}
        mobileCarrier={mobileCarrier}
        algorithmList={algorithmList}
        languageList={languageList}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onVerifyClick={onVerifyClick}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        toggleVerifyButton={toggleVerifyButton}
        handleMobileNumberChange={handleMobileNumberChange}
        disableButton={disableButton}
        postalCodeDisable={postalCodeDisable}
        userProfileSkeleton={userProfileSkeleton}
        userProfileSkeletonV={userProfileSkeletonV}
      />
    );
    const component = container.querySelector("#verifyNumber");
    expect(
      component.parentElement.classList.contains(styles.profileInfo_wrapper)
    ).toBe(true);
  });
});
