import { Fragment } from "react";
import { useRouter } from "next/router";

import styles from "./layout.module.scss";

import useAuthentication from "src/hooks/isUserAuthenticated";
import LoggedInHeader from "src/components/common/headers/loggedInHeader";
import LoggedOutHeader from "src/components/common/headers/loggedOutHeader";
import Footer from "src/components/common/footer";
import GoogleAd from "src/components/googleAds";

function Layout(props: any) {
  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

  return (
    <Fragment>
      <div className={styles.pageWrap}>
        {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
        {props?.campInfoBar ? props?.campInfoBar : null}
        <div className={styles.contentWrap}>
          <div
            className={
              styles.contentArea +
              " " +
              styles.eventListArea +
              " " +
              `${
                router?.asPath.includes("timelinetest")
                  ? styles.timelineLayout
                  : ""
              }`
            }
          >
            {props.children}{" "}
          </div>

          {!router?.asPath.includes("eventline") ||
          router?.asPath.includes("videos")
          && (
            <aside className={styles.rightSidebar}>
              <GoogleAd
                ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
                ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
              />
            </aside>
          )}
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default Layout;
