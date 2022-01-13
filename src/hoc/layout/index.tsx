import Image from "next/image";

import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/isUserAuthenticated";
import Spinner from "../../components/common/spinner/spinner";
import styles from "./layout.module.scss";
import Footer from "../../components/common/footer";
function Layout(props) {
  const [isLogin, setIsLogin] = useState(false);

  const { isUserAuthenticated } = useAuthentication();

  useEffect(() => {
    if (isUserAuthenticated) {
      setIsLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.pageWrap}>
        {isLogin ? <LoggedInHeader /> : <LoggedOutHeader />}
        <div className={styles.contentWrap}>
          <aside className={styles.leftSidebar}></aside>
          <div className={styles.contentArea}>{props.children}</div>
          <aside className={styles.rightSidebar}>
            <Image  src="/images/right-sidebar-adv.png" width={202} height={635} alt="" />
          </aside>
        </div>
        <Spinner>{""}</Spinner>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
