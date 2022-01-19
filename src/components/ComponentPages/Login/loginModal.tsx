import { Modal } from "antd";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import Login from "./index";

const LoginModal = () => {
  const visible = useSelector((state: RootState) => state.ui.loginModalVisible);

  return (
    <Fragment>
      <Modal
        visible={visible}
        // title="Title"
        // onOk={handleOk}
        // onCancel={handleCancel}
        footer={null}
        closable={false}
        width={800}
        className="loginModal"
      >
        <Login isModal={true} />
      </Modal>
    </Fragment>
  );
};

export default LoginModal;
