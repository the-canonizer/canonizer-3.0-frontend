import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import NotificationsListUI from "./UI";
import { getNotificationsList } from "src/network/api/notificationAPI";
import { RootState } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";

const SettingsUI = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const per_page = 50;

  const { list } = useSelector((state: RootState) => {
    return {
      list: state.notifications.data,
    };
  });

  const getList = async (p) => {
    setIsLoading(true);
    const res = await getNotificationsList(p, -1);
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

  const onBackClick = (e) => {
    e?.preventDefault();
  };

  const onAllReadClick = (e) => {
    e?.preventDefault();
  };

  const onFilterClick = (e, type) => {
    e?.preventDefault();
    router.query.filter = type;

    if (router?.query?.filter === "0") {
      delete router.query.filter;
    }

    router.push(router, null, { shallow: true });
  };

  return (
    <CustomSpinner key="notification-spinner" spinning={isLoading}>
      <NotificationsListUI
        list={list}
        isLoading={isLoading}
        page={page}
        onViewMoreClick={onViewMoreClick}
        total={total}
        per_page={per_page}
        onBackClick={onBackClick}
        onAllReadClick={onAllReadClick}
        router={router}
        onFilterClick={onFilterClick}
      />
    </CustomSpinner>
  );
};
export default SettingsUI;
