import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { message } from "antd";

import NotificationsListUI from "./UI";
import {
  deleteAllNotifications,
  getNotificationsList,
  markAllNotificationRead,
} from "src/network/api/notificationAPI";
import { RootState } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
import DeleteAllPopup from "./UI/conformationModal";
import ReadPopup from "./UI/readConformationModal";

const SettingsUI = () => {
  const { list } = useSelector((state: RootState) => ({
    list: state.notifications.data,
  }));

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true),
    [notsList, setNotsList] = useState([]),
    [rendredNotsList, setRendredNotsList] = useState([]),
    [isDeleteOpen, setIsDeleteOpen] = useState(false),
    [isReadOpen, setIsReadOpen] = useState(false);

  useEffect(() => {
    const filterType = router.query.filter;
    if (filterType) {
      let filteredList = [];

      if (filterType === "1") {
        filteredList = list?.filter((n) => +n?.is_seen === 1);
      }

      if (filterType === "2") {
        filteredList = list?.filter((n) => +n?.is_seen === 0);
      }

      setRendredNotsList(filteredList);

      setNotsList(list);
    } else {
      setNotsList(list);
      setRendredNotsList(list);
    }
  }, [list, router.query.filter]);

  const getList = async (p = 1) => {
    setIsLoading(true);

    await getNotificationsList(p, -1);

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

  const deleteAll = async () => {
    const ids = notsList?.map((n) => n?.id);

    const body = { ids: ids };

    const res = await deleteAllNotifications(body);

    if (res?.status_code === 200) {
      message.success(res?.message);
      if (router?.query?.filter === "2" || router?.query?.filter === "1") {
        delete router.query.filter;
        router?.push(router, null, { shallow: true });
      }
    } else {
      message.error(res?.message || "Something went wrong!");
    }

    setIsDeleteOpen(false);
  };

  const deleteClick = (e) => {
    e?.preventDefault();
    deleteAll();
  };

  const onReadClose = (e) => {
    e?.preventDefault();
    setIsReadOpen(false);
  };

  const allReadMark = async () => {
    const ids = [];

    notsList?.forEach((n) => {
      if (+n?.is_seen === 0) {
        ids?.push(n?.id);
      }
    });

    const body = { ids: ids };

    const res = await markAllNotificationRead(body, 1, -1);

    if (res?.status_code === 200) {
      message.success(res?.message);

      if (router?.query?.filter === "2") {
        delete router.query.filter;
        router?.push(router, null, { shallow: true });
      }
    } else {
      message.error(res?.message || "Something went wrong!");
    }

    setIsReadOpen(false);
  };

  const onReadAll = (e) => {
    e?.preventDefault();
    allReadMark();
  };

  return (
    <CustomSpinner key="notification-spinner" spinning={isLoading}>
      <NotificationsListUI
        list={notsList}
        rendredNotsList={rendredNotsList}
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
