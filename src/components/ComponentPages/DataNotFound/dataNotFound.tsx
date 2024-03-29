import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./datanotfound.module.scss";
import { Typography } from "antd";
const { Link: AntLink } = Typography;
const DataNotFound = ({ name, backURL, message = "", goBack = false }: any) => {
  let routeHistory = JSON.parse(localStorage.getItem("router_history")) || [];
  const router = useRouter();
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
          <h3>{message ? message : name + "  Not Found"}</h3>
          <p>{`We're sorry, the page you requested could not be found.`}</p>
          {goBack ? (
            <AntLink
              onClick={() => {
                if (routeHistory?.length > 1) {
                  router?.back();
                } else {
                  router.push("/");
                }
              }}
            >
              <a className={styles.btnGoBack}>Go Back</a>
            </AntLink>
          ) : (
            <Link href={{ pathname: backURL }}>
              <a className={styles.btnGoBack}>Go Back</a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default DataNotFound;
