import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/isUserAuthenticated";
import Spinner from "../../components/common/spinner/spinner";

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
      <div className="app-layout">
        {isLogin ? <LoggedInHeader /> : <LoggedOutHeader />}

        <div className="app-content">{props.children}</div>
        <Spinner>{""}</Spinner>
      </div>
    </>
  );
}

export default Layout;
