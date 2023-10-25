import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "../siteHeader.module.scss";

const LogoHeader = () => {
  return (
    <Fragment>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/site-images/logo.svg`}
              alt="Picture of the author"
              layout="responsive"
              width={200}
              height={42}
            />
          </a>
        </Link>
      </div>
    </Fragment>
  );
};

export default LogoHeader;
