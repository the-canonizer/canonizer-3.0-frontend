import React, { Fragment } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "../../../store";
import { hideMultiUserModal } from "../../../store/slices/uiSlice";
import { removeSocialUsers } from "../../../store/slices/authSlice";
import MultiUserModalForm from "./multipleAccountsUI";
import { deactivateUser } from "../../../network/api/userApi";

const MultiUserModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const visible = useSelector(
    (state: RootState) => state.ui.multipleUserModalVisible
  );

  const users = useSelector((state: RootState) => state.auth.socialUsers || []);

  const closeModal = () => dispatch(hideMultiUserModal());
  const removeUsers = () => dispatch(removeSocialUsers());

  const onFinish = async (v: any) => {
    const body = { user_id: v.selected_user };

    const res = await deactivateUser(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      closeModal();
      removeUsers();
      router?.push("/settings?tab=social");
    }
  };

  return (
    <Fragment>
      <MultiUserModalForm
        visible={visible}
        onFinish={onFinish}
        closeModal={closeModal}
        users={users}
      />
    </Fragment>
  );
};

export default MultiUserModal;
