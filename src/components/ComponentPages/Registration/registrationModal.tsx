import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import Registration from "./index";
import EmailPopup from "./emailPopup";

const RegistrationModal = () => {
  const { isOTPModal, isEmailModal } = useSelector((state: RootState) => ({
    isOTPModal: state.ui.registrationModalVisible,
    isEmailModal: state.ui.showSocialLoginEmailPopup,
  }));

  return (
    <Fragment>
      <Modal
        style={{ top: "20px" }}
        visible={isOTPModal}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <Registration isModal={true} />
      </Modal>

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
    </Fragment>
  );
};

export default RegistrationModal;
