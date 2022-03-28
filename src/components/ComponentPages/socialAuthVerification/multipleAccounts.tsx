import { Form } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store";
import { hideMultiUserModal } from "../../../store/slices/uiSlice";
import MultiUserModalForm from "./multipleAccountsUI";

const MultiUserModal = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const visible = useSelector(
    (state: RootState) => state.ui.multipleUserModalVisible
  );

  const [modalForm] = Form.useForm();

  useEffect(() => {
    const usersD = [
      {
        id: 1,
        name: "User One",
      },
      {
        id: 2,
        name: "User Two",
      },
    ];
    setUsers(usersD);
  }, []);

  const closeModal = () => dispatch(hideMultiUserModal());

  const onFinish = (v: any) => {
    console.log("Values", v);
  };

  console.log("modal status ff", visible);

  return (
    <Fragment>
      <MultiUserModalForm
        visible={visible}
        onFinish={onFinish}
        closeModal={closeModal}
        users={users}
        modalForm={modalForm}
      />
    </Fragment>
  );
};

export default MultiUserModal;
