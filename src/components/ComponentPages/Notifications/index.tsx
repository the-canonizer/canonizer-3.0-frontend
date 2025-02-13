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

const NotificationPage = () => {
  const { list } = useSelector((state: RootState) => ({
    list: state.notifications.data,
  }));

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true),
    [notsList, setNotsList] = useState([]),
    [isDeleteOpen, setIsDeleteOpen] = useState(false),
    [isDeleteDisabled, setIsDeleteDisabled] = useState(false),
    [isReadOpen, setIsReadOpen] = useState(false),
    [isReadDisabled, setIsReadDisabled] = useState(false),
    [page, setPage] = useState(1),
    [loadMore, setLoadMore] = useState(false),
    [limit] = useState(10),
    [total, setTotal] = useState(0),
    [readCount, setReadCount] = useState(0),
    [unreadCount, setUnreadCount] = useState(0),
    [isFetchingData, setIsFetchingData] = useState(false),
    [isLastReached, setIsLastReached] = useState(false),
    [type, setType] = useState("all");

  useEffect(() => {
    setNotsList(list);
  }, [list]);

  useEffect(() => {
    if (router?.query?.filter === "1") {
      setType("read");
      setPage(1);
    } else if (router?.query?.filter === "2") {
      setType("unread");
      setPage(1);
    } else {
      setType("all");
      setPage(1);
    }
  }, [router?.query?.filter]);

  const getList = async () => {
    setIsLoading(true);

    const isSeen = 0;

    const res = await getNotificationsList(page, limit, isSeen, type, loadMore);

    if (res?.status_code === 200) {
      setIsFetchingData(false);
      setLoadMore(false);
      setTotal(res?.data?.all_count);
      setReadCount(res?.data?.read_count);
      setUnreadCount(res?.data?.unread_count);

      if (+res?.data?.last_page === +page) {
        setIsLastReached(true);
      } else {
        setIsLastReached(false);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
      getList();
  }, [page, type]);

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
    // Mark all notifications as read send is_read = "all" and ids = []
    // or selected item delete send is_delete = "selected" and ids = [id1, id2, id3]
    const body = { ids: [], is_delete: "all" };

    const res = await deleteAllNotifications(body);

    if (res?.status_code === 200) {
      message.success(res?.message);

      if (router?.query?.filter === "2" || router?.query?.filter === "1") {
        delete router.query.filter;
        router?.push(router, null, { shallow: true });
      }

      getList();
    }

    setIsDeleteOpen(false);
    setIsDeleteDisabled(false);
  };

  const deleteClick = (e) => {
    setIsDeleteDisabled(true);
    e?.preventDefault();
    deleteAll();
  };

  const onReadClose = (e) => {
    e?.preventDefault();
    setIsReadOpen(false);
  };

  const allReadMark = async () => {
    // Mark all notifications as read send is_read = "all" and ids = []
    // or selected item read send is_read = "selected" and ids =  [id1, id2, id3]
    const body = { ids: [], is_read: "all" };

    const res = await markAllNotificationRead(body);

    if (res?.status_code === 200) {
      message.success(res?.message);

      if (router?.query?.filter === "2") {
        delete router.query.filter;
        router?.push(router, null, { shallow: true });
      }

      getList();
    } else {
      message.error(res?.message);
    }

    setIsReadOpen(false);
    setIsReadDisabled(false);
  };

  const onReadAll = (e) => {
    setIsReadDisabled(true);
    e?.preventDefault();
    allReadMark();
  };

  const loadMoreNotifications = async () => {
    setIsFetchingData(true);
    setLoadMore(true);
    setPage((prev) => prev + 1);
  };

  return (
    <CustomSpinner key="notification-spinner" spinning={isLoading}>
      <NotificationsListUI
        list={notsList}
        isLoading={isLoading}
        onBackClick={onBackClick}
        onAllReadClick={onAllReadClick}
        router={router}
        onFilterClick={onFilterClick}
        onAllDelete={onAllDelete}
        loadMoreNotifications={loadMoreNotifications}
        readCount={readCount}
        unreadCount={unreadCount}
        total={total}
        isFetchingData={isFetchingData}
        isLastReached={isLastReached}
      />
      <DeleteAllPopup
        onClose={onDeleteClose}
        onDelete={deleteClick}
        isOpen={isDeleteOpen}
        isDeleteDisabled={isDeleteDisabled}
      />
      <ReadPopup
        onClose={onReadClose}
        onRead={onReadAll}
        isOpen={isReadOpen}
        isReadDisabled={isReadDisabled}
      />
    </CustomSpinner>
  );
};

export default NotificationPage;
