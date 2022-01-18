import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/isUserAuthenticated";
import Spinner from "../../components/common/spinner/spinner";
import Footer from "../../components/common/footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
function Layout(props) {
  const [isLogin, setIsLogin] = useState(false);

  const { isUserAuthenticated } = useAuthentication();

  const isAuthenticate = useSelector(
    (state: RootState) => state.auth.authenticated
  );

  useEffect(() => {
    if (isUserAuthenticated) {
      setIsLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="app-layout">
        {isAuthenticate ? <LoggedInHeader /> : <LoggedOutHeader />}

        <div className="app-content">{props.children}</div>
        <Spinner>{""}</Spinner>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
