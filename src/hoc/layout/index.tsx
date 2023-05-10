import dynamic from "next/dynamic";

import styles from "./layout.module.scss";

import useAuthentication from "../../hooks/isUserAuthenticated";
import GoogleAd from "../../components/googleAds";

const LoggedInHeader = dynamic(
  () => import("../../components/common/headers/loggedInHeader"),
  { ssr: false }
);
const LoggedOutHeader = dynamic(
  () => import("../../components/common/headers/loggedOutHeader"),
  { ssr: false }
);
const Footer = dynamic(() => import("../../components/common/footer"), {
  ssr: false,
});
import { useRouter } from "next/router";

function Layout(props: any) {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <div className={styles.pageWrap}>
        {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
        <div className={styles.contentWrap}>
          <div
            className={
              styles.contentArea +
              " " +
              styles.eventListArea +
              " " +
              `${
                router.asPath.includes("timelinetest")
                  ? styles.timelineLayout
                  : ""
              }`
            }
          >
            {props.children}{" "}
          </div>

          {!router.asPath.includes("eventline") && (
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
