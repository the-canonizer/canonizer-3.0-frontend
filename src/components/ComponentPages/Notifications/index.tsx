import { useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";

import NotificationsListUI from "./UI";

const SettingsUI = () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const data = [
      {
        id: "1",
        title: "Rohit has made the following post to the Camp Agreement forum",
        time: "Today 11:56",
      },
      {
        id: "2",
        title:
          "Vikram has just added their support to this camp: Software Development Team",
        time: "Today 11:56",
      },
      {
        id: "3",
        title:
          "Sunil has just removed their support from this camp: Software Development Team",
        time: "Today 11:56",
      },
      {
        id: "4",
        title:
          "Reena has just added their support to this camp: Scalability Architecture / Server Ar...",
        time: "Today 11:56",
      },
    ];

    console.log("[NOTIFICATIONS LIST]", router.query);

    setList(data);
  }, []);

  const onViewMoreClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <Fragment>
      <NotificationsListUI
        list={list}
        isLoading={isLoading}
        page={page}
        onViewMoreClick={onViewMoreClick}
      />
    </Fragment>
  );
};
export default SettingsUI;
