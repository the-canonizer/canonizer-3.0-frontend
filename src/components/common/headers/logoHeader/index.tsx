import { Fragment } from "react";
import Link from "next/link";

import styles from "../siteHeader.module.scss";

const LogoHeader = () => {
  return (
    <Fragment>
      <div className={styles.logoWrap}>
        <Link href="/">
          <a className={styles.logoText}>
            canonizer<span className={styles.logoDot}>.</span>
          </a>
        </Link>
        <span className={styles.tagline}>Where people find common ground</span>
      </div>
    </Fragment>
  );
};

export default LogoHeader;
