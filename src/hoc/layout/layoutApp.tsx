"use client"

import dynamic from "next/dynamic";

import styles from "./layout.module.scss";

import useAuthentication from "../../hooks/isUserAuthenticated";
import GoogleAd from "../../components/googleAds";

const LoggedInHeader = dynamic(
  () => import("../../components/common/headers/loggedInHeader/LoggedInHeaderApp"),
  { ssr: false }
);
const LoggedOutHeader = dynamic(
  () => import("../../components/common/headers/loggedOutHeader/LoggedOutHeaderApp"),
  { ssr: false }
);
const Footer = dynamic(() => import("../../components/common/footer/footerApp"), {
  ssr: false,
});
import { useSearchParams } from "next/navigation";

function Layout(props: any) {
  
  const searchParams = useSearchParams()
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <div className={styles.pageWrap}>
        {/* {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />} */}
        {/* <LoggedInHeader /> */}
        <LoggedOutHeader />
        <div className={styles.contentWrap}>
          <div
            className={
              styles.contentArea +
              " " +
              styles.eventListArea +
              " " +
              `${
                searchParams?.has("timelinetest")
                  ? styles.timelineLayout
                  : ""
              }`
            }
          >
            {props.children}{" "}
          </div>

          {!searchParams?.has("eventline") && (
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
    </>
  );
}

export default Layout;
