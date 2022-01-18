import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import Registration from "./index";

const RegistrationModal = () => {
  const visible = useSelector(
    (state: RootState) => state.ui.registrationModalVisible
  );

  return (
    <Fragment>
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <Registration isModal={true} />
      </Modal>
    </Fragment>
  );
};

export default RegistrationModal;
