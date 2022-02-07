import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/isUserAuthenticated";
import Image from "next/image";

import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import Spinner from "../../components/common/spinner/spinner";
import styles from "./layout.module.scss";
import Footer from "../../components/common/footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
function Layout(props) {
  const [isLogin, setIsLogin] = useState(false);

  const { isUserAuthenticated } = useAuthentication();

  const isAuthenticate = useSelector(
    (state: RootState) => state.auth.authenticated
  );

  // useEffect(() => {
  //   if (isUserAuthenticated) {
  //     setIsLogin(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <div className="app-layout">
        {isAuthenticate ? <LoggedInHeader /> : <LoggedOutHeader />}

        {/* <div className="app-content">{props.children}</div> */}
        <Spinner>{""}</Spinner>
        <div className={styles.contentWrap}>
          <div className={styles.contentArea}>{props.children}</div>
          <aside className={styles.rightSidebar}>
            <Image
              src="/images/right-sidebar-adv.png"
              width={200}
              height={635}
              alt=""
            />
          </aside>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Layout;
