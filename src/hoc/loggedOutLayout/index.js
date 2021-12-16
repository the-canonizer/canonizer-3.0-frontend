import { store } from "../../store";
import { createWrapper } from "next-redux-wrapper";
import HeadContent from "../headContent";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import LoggedOutHeader from "../../components/common/headers/loggedOutHeader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LoggedOutLayout(props) {
  const [isLogin, setIsLogin] = useState(false);
  const { auth } = store.getState();

  useEffect(() => {
    if (auth.authenticated && auth.token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <>
      <HeadContent
        title={props.meta.title}
        description={props.meta.description}
        route={props.meta.route}
        image_url={props.meta.image_url}
      />
      <div className="app-layout">
        {isLogin ? <LoggedInHeader /> : <LoggedOutHeader />}
        <h1>read store {auth.authenticated}</h1>
        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

// export default Layout;
export default wrapper.withRedux(LoggedOutLayout);
