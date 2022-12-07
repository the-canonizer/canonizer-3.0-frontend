import useAuthentication from "../../hooks/isUserAuthenticated";
import Image from "next/image";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import Spinner from "../../components/common/spinner/spinner";
import styles from "./layout.module.scss";
import Footer from "../../components/common/footer";
import Link from "next/link";
import Script from "next/script";

function Layout(props) {
  const { isUserAuthenticated } = useAuthentication();

  return (
    <>
      <div className={styles.pageWrap}>
        {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
        <Spinner>{""}</Spinner>
        <div className={styles.contentWrap}>
          <div className={styles.contentArea}>{props.children} </div>
          <aside className={styles.rightSidebar}>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6646446076038181"
            ></Script>

            <Script>
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
          </aside>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
