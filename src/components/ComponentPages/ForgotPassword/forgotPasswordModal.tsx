import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import ForgotPassword from "./index";

const ForgotModal = () => {
  const visible = useSelector(
    (state: RootState) => state.ui.forgotModalVisible
  );

  return (
    <Fragment>
      <Modal
        style={{ top: "20px" }}
        visible={visible}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <ForgotPassword isModal={true} />
      </Modal>
    </Fragment>
  );
};

export default ForgotModal;
