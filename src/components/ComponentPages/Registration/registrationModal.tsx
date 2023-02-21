import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";

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
        open={isOTPModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <Registration isModal={true} />
      </Modal>

      {/* email confirmation popup */}
      <Modal
        style={{ top: "20px" }}
        open={isEmailModal}
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
        open={isNameModal}
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
