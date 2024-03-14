import { useState, Fragment, useEffect } from "react";
import { useSelector } from "react-redux";

import NotificationsListUI from "./UI";
import { getNotificationsList } from "src/network/api/notificationAPI";
import { RootState } from "src/store";

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
    if (res && res?.status_code == 200) {
      setTotal(res?.data?.total_rows);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getList(page);
  }, [page]);

  const onViewMoreClick = (p) => {
    setIsLoading(true);
    setPage(p);
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
      />
    </Fragment>
  );
};
export default SettingsUI;
