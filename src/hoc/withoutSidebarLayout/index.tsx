import { Fragment, useEffect, useState } from "react";

import useAuthentication from "../../hooks/isUserAuthenticated";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import Spinner from "../../components/common/spinner/spinner";
import styles from "./withoutSidebarLayout.module.scss";
import Footer from "../../components/common/footer";

function WithoutSidebarLayout(props: any) {
  const { isUserAuthenticated } = useAuthentication();

  const [log, setLog] = useState(isUserAuthenticated);

  useEffect(() => setLog(isUserAuthenticated), [isUserAuthenticated]);

  return (
    <Fragment>
      <div className={styles.pageWrap} data-testid="loggedInHeader">
        {isUserAuthenticated ? <LoggedInHeader /> : <LoggedOutHeader />}
        <div className={styles.contentWrap}>
          <div className={styles.contentArea}>{props.children} </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

export default WithoutSidebarLayout;
