import useAuthentication from "../../hooks/isUserAuthenticated";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import Spinner from "../../components/common/spinner/spinner";
import styles from "./layout.module.scss";
import Footer from "../../components/common/footer";
import GoogleAd from "../../components/googleAds";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CampRecentActivities from "@/components/ComponentPages/Home/CampRecentActivities";

function Layout(props: any) {
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();

  const [log, setLog] = useState(isUserAuthenticated);

  useEffect(() => setLog(isUserAuthenticated), [isUserAuthenticated]);

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
                router?.asPath.includes("timelinetest")
                  ? styles.timelineLayout
                  : ""
              }`
            }
          >
            {props.children}{" "}
          </div>

          {!router?.asPath.includes("eventline") && (
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
