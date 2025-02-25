import React from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "src/store";
import { hideMultiUserModal } from "src/store/slices/uiSlice";
import { removeSocialUsers } from "src/store/slices/authSlice";
import MultiUserModalForm from "./multipleAccountsUI";
import { deactivateUser } from "src/network/api/userApi";

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
    const body = {
      user_id: v.selected_user,
      provider: router?.query?.provider,
    };

    const res = await deactivateUser(body);

    if (res && res.status_code === 200) {
      message.success(res.message);
      closeModal();
      removeUsers();
      router?.push("/settings?tab=social");
    }
  };

  return (
    <MultiUserModalForm
      visible={visible}
      onFinish={onFinish}
      closeModal={closeModal}
      users={users}
    />
  );
};

export default MultiUserModal;
