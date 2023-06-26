import React from "react";
import { Card } from "antd";
import styles from "./archive.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { useRouter } from "next/router";

const ArchivedCampMsg = () => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  const campArchiveStatement = "This camp has been archived";
  const isAuth = useAuthentication();
  const router = useRouter();
  return campRecord?.is_archive &&
    isAuth.isUserAuthenticated &&
    router?.asPath.includes("/topic/") &&
    !router?.asPath.includes("/topic/history") ? (
    <span>
      <Card className={styles.archive_wrapper}>{campArchiveStatement}</Card>
    </span>
  ) : null;
};
export default ArchivedCampMsg;
