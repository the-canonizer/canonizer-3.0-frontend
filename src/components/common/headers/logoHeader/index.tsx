import Link from "next/link";
import Image from "next/image";

import styles from "../siteHeader.module.scss";

const LogoHeader = () => {
  return (
    <>
      <div className={styles.logo}>
        <Link href="/" passHref>
          <a>
            <Image
              src={"/images/logo.svg"}
              alt="Picture of the author"
              layout="responsive"
              width={225}
              height={42}
            />
          </a>
        </Link>
      </div>
    </>
  );
};

export default LogoHeader;
