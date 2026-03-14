import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import EmailPopup from "./emailPopup";
import NameConfirmationPopup from "./nameConfirmationPopup";

const RegistrationModal = () => {
  const { isEmailModal, isNameModal } = useSelector((state: RootState) => ({
    isEmailModal: state.ui.showSocialLoginEmailPopup,
    isNameModal: state.ui.showSocialLoginNamePopup,
  }));

  return (
    <Fragment>
      {/* email confirmation popup */}
      <Modal
        style={{ top: "20px" }}
        visible={isEmailModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
        data-testid="emailpopup"
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
        data-testid="nameconfirmation"
      >
        <NameConfirmationPopup isModal={true} />
      </Modal>
    </Fragment>
  );
};

export default RegistrationModal;
