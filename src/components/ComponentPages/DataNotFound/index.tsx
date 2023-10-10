import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";

import styles from "../404/errorPage.module.scss";

const DataNotFound = () => {
  const router = useRouter();
  const {
    filterByScore,
    filterObject,
    viewThisVersion,
    // archeived
  } = useSelector((state: RootState) => ({
    filterByScore: state.filters?.filterObject?.filterByScore,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
  }));
  return (
    <>
      <div className={styles.errorPageContentWrap}>
        <div className={styles.errorPageImg}>
          <Image
            src={"/images/topic-not-found.png"}
            alt="404 page"
            width={487}
            height={552}
            layout="fixed"
          />
        </div>
        <div className={styles.errorPageContent}>
          <h3>Topic Not Found</h3>
          <p>
            {`We're sorry, the page you requested could not be found Please go
            back to the homepage`}
          </p>
          <Link
            href={`/?score=${filterByScore}&algo=${filterObject?.algorithm}${
              filterObject?.asof == "bydate"
                ? "&asofdate=" + filterObject?.asofdate
                : ""
            }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
              viewThisVersion ? "&viewversion=1" : ""
            }`}
          >
            <a className={styles.btnGoBack}>Go Back</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DataNotFound;
