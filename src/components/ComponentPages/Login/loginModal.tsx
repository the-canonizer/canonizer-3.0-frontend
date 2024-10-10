import { Modal } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import Login from "./index";

const LoginModal = () => {
  const visible = useSelector((state: RootState) => state.ui.loginModalVisible);
  const [isOpen, setIsOpen] = useState(visible);

  useEffect(() => setIsOpen(visible), [visible]);

  return (
    <Fragment>
      <Modal
        style={{ top: "20px", zIndex: 1100 }}
        visible={isOpen}
        open={isOpen}
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
