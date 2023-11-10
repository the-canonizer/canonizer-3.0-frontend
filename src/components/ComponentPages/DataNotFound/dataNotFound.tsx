import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./datanotfound.module.scss";

const DataNotFound = ({ name, backURL, message = "" }) => {
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
          <Link href={{ pathname: backURL }}>
            <a className={styles.btnGoBack}>Go Back</a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DataNotFound;
