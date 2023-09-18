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
  const getQueryParams = () => {
    let isbool = false;
    let params = "?";
    if (filterObject?.filterByScore != 0) {
      params = params + `score=${filterObject?.filterByScore}&`;
      isbool = true;
    }
    if (filterObject?.algorithm != "blind_popularity") {
      params = params + `algo=${filterObject?.algorithm}&`;
      isbool = true;
    }
    if (filterObject?.asof != "default") {
      params = params + `asof=${filterObject?.asof}&`;
      isbool = true;
    }
    if (filterObject?.asof == "bydate") {
      params = params + `asofdate=${filterObject?.asofdate}&`;
      isbool = true;
    }
    if (filterObject?.namespace_id != 1) {
      params = params + `canon=${filterObject?.namespace_id}&`;
      isbool = true;
    }
    if (viewThisVersion) {
      params = params + `viewversion=1&`;
      isbool = true;
    }
    params = params.slice(0, -1);
    return params;
  };

  return (
    <Fragment>
      <div className={styles.logo}>
        <Link href={`/${getQueryParams()}`}>
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
