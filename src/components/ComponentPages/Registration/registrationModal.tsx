import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { RootState } from "../../../store";
import Registration from "./index";
import EmailPopup from "./emailPopup";
import NameConfirmationPopup from "./nameConfirmationPopup";

const RegistrationModal = () => {
  const { isOTPModal, isEmailModal, isNameModal } = useSelector(
    (state: RootState) => ({
      isOTPModal: state.ui.registrationModalVisible,
      isEmailModal: state.ui.showSocialLoginEmailPopup,
      isNameModal: state.ui.showSocialLoginNamePopup,
    })
  );

  return (
    <Fragment>
      {/* registration popup */}
      <Modal
        style={{ top: "20px" }}
        visible={isOTPModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <Registration isModal={true} />
        </GoogleReCaptchaProvider>
      </Modal>

      {/* email confirmation popup */}
      <Modal
        style={{ top: "20px" }}
        visible={isEmailModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <EmailPopup isModal={true} />
      </Modal>

      {/* name confirmation popup */}
      <Modal
        style={{ top: "20px" }}
        visible={isNameModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <NameConfirmationPopup isModal={true} />
      </Modal>
    </Fragment>
  );
};

export default RegistrationModal;
