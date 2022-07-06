import { useState, Fragment, useEffect } from "react";
import { useSelector } from "react-redux";

import NotificationsListUI from "./UI";
import {
  getNotificationsList,
  markNotificationRead,
} from "../../../network/api/notificationAPI";
import { RootState } from "../../../store";

const SettingsUI = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const per_page = 50;

  const { list } = useSelector((state: RootState) => {
    return {
      list: state.notifications.data,
    };
  });

  const getList = async (p) => {
    const res = await getNotificationsList(p, per_page);
    setIsLoading(false);
    if (res && res?.status_code == 200) {
      setTotal(res?.data?.total_rows);
    }
  };

  useEffect(() => {
    getList(page);
  }, [page]);

  const onViewMoreClick = (p) => {
    setIsLoading(true);
    setPage(p);
  };

  const onNotifyClick = async (id) => {
    await markNotificationRead(id);
  };

  return (
    <Fragment>
      <NotificationsListUI
        list={list}
        isLoading={isLoading}
        page={page}
        onViewMoreClick={onViewMoreClick}
        total={total}
        per_page={per_page}
        onNotifyClick={onNotifyClick}
      />
    </Fragment>
  );
};
export default SettingsUI;
