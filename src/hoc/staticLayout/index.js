import { store } from "../../store";
import { createWrapper } from "next-redux-wrapper";
import HeadContent from "../../hoc/headContent";
import AppHeader from "../../components/app/header";
import Header from "../../components/static/header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Layout(props) {
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
        {isLogin ? <AppHeader /> : <Header />}
        <h1>read store {auth.authenticated}</h1>
        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

// export default Layout;
export default wrapper.withRedux(Layout);
