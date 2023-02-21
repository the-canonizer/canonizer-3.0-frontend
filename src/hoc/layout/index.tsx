import { useEffect, useState } from "react";
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

function Layout(props: any) {
  const { isUserAuthenticated } = useAuthentication();

  const [log, setLog] = useState(isUserAuthenticated);

  useEffect(() => setLog(isUserAuthenticated), [isUserAuthenticated]);

  return (
    <div className={styles.pageWrap}>
      {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
      <div className={styles.contentWrap}>
        <div className={styles.contentArea}>{props.children} </div>
        <aside className={styles.rightSidebar}>
          <GoogleAd
            ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
            ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT}
          />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
