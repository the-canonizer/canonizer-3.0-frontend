import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./errorPage.module.scss";

const My404 = () => {
  const router = useRouter();
  const goBack = () => {
    router?.back();
  };
  return (
    <>
      <div className={styles.errorPageContentWrap}>
        <div className={styles.errorPageImg}>
          <Image
            src={"/images/404-page-img.png"}
            alt="404 page"
            width={487}
            height={552}
            layout="fixed"
          />
        </div>
        <div className={styles.errorPageContent}>
          <h2>404</h2>
          <h3>Page Not Found</h3>
          <p>
            {`We're sorry, the page you requested could not be found Please go
            back to the homepage`}
          </p>
          <Link href={""}>
            <a onClick={goBack} className={styles.btnGoBack}>
              Go Back
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default My404;
