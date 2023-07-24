import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import styles from "../siteHeader.module.scss";

const LogoHeader = () => {
  const { filterByScore, filterObject, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterByScore: state.filters?.filterObject?.filterByScore,
      filterObject: state?.filters?.filterObject,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );
  return (
    <Fragment>
      <div className={styles.logo}>
        <Link
          href={`/?score=${filterByScore}&algo=${filterObject?.algorithm}${
            filterObject?.asof == "bydate"
              ? "&asofdate=" + filterObject?.asofdate
              : ""
          }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
            viewThisVersion ? "&viewversion=1" : ""
          }`}
        >
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
