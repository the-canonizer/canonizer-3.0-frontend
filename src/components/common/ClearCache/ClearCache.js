import React, { useState, useEffect } from "react";
import moment from "moment";
import { logOut } from "../headers/loggedInHeaderNavigation";

const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = moment(latestDate);
  const momCurrentDateTime = moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  } else {
    return false;
  }
};

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

    useEffect(() => {
      fetch("/meta.json")
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          const currentVersionDate = localStorage.getItem("build_number");

          const shouldForceRefresh = buildDateGreaterThan(
            latestVersionDate,
            +currentVersionDate ?? 0
          );
          if (shouldForceRefresh) {
            setIsLatestBuildDate(false);
            refreshCacheAndReload();
            localStorage.setItem("build_number", latestVersionDate);
          } else {
            setIsLatestBuildDate(true);
          }
        });
    }, []);

    const refreshCacheAndReload = () => {
      localStorage.clear();
      logOut()
      if (caches) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    };

    return (
      <React.Fragment>
        <Component {...props} />
      </React.Fragment>
    );
  }

  return ClearCacheComponent;
}

export default withClearCache;
