import { store } from "../../store";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import { useEffect, useState } from "react";

function LoggedOutLayout(props) {
  const [isLogin, setIsLogin] = useState(false);
  const { auth } = store.getState();

  useEffect(() => {
    if (auth.authenticated && auth.token) {
      setIsLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="app-layout">
        {isLogin ? <LoggedInHeader /> : <LoggedOutHeader />}
        <h1>read store {auth.authenticated}</h1>
        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

export default LoggedOutLayout;
// export default wrapper.withRedux(LoggedOutLayout);
