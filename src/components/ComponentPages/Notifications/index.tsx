import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import NotificationsListUI from "./UI";
import { getNotificationsList } from "src/network/api/notificationAPI";
import { RootState } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
import DeleteAllPopup from "./UI/conformationModal";
import ReadPopup from "./UI/readConformationModal";

const SettingsUI = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true),
    [isDeleteOpen, setIsDeleteOpen] = useState(false),
    [isReadOpen, setIsReadOpen] = useState(false);

  const per_page = 100000000000000000000;

  const { list } = useSelector((state: RootState) => ({
    list: state.notifications.data,
  }));

  const getList = async (p = 1) => {
    setIsLoading(true);

    await getNotificationsList(p, per_page);

    setIsLoading(false);
  };

  useEffect(() => {
    getList();
  }, []);

  const onBackClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  const onAllReadClick = (e) => {
    e?.preventDefault();
    setIsReadOpen(true);
  };

  const onFilterClick = (e, type) => {
    e?.preventDefault();
    router.query.filter = type;

    if (router?.query?.filter === "0") {
      delete router.query.filter;
    }

    router.push(router, null, { shallow: true });
  };

  const onAllDelete = (e) => {
    e?.preventDefault();
    setIsDeleteOpen(true);
  };

  const onDeleteClose = (e) => {
    e?.preventDefault();
    setIsDeleteOpen(false);
  };

  const deleteClick = (e) => {
    e?.preventDefault();

    setIsDeleteOpen(false);
  };

  const onReadClose = (e) => {
    e?.preventDefault();
    setIsReadOpen(false);
  };

  const onReadAll = (e) => {
    e?.preventDefault();
    setIsReadOpen(false);
  };

  return (
    <CustomSpinner key="notification-spinner" spinning={isLoading}>
      <NotificationsListUI
        list={list}
        isLoading={isLoading}
        onBackClick={onBackClick}
        onAllReadClick={onAllReadClick}
        router={router}
        onFilterClick={onFilterClick}
        onAllDelete={onAllDelete}
      />
      <DeleteAllPopup
        onClose={onDeleteClose}
        onDelete={deleteClick}
        isOpen={isDeleteOpen}
      />
      <ReadPopup onClose={onReadClose} onRead={onReadAll} isOpen={isReadOpen} />
    </CustomSpinner>
  );
};
export default SettingsUI;
