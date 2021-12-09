import store from "../../store";
import { createWrapper } from "next-redux-wrapper";
import HeadContent from "../../hoc/headContent";
import AppHeader from "../../components/app/header";
import Header from "../../components/static/header";

function Layout(props) {
  const isLogin = false;
  return (
    <>
      <HeadContent
        title={props.meta.title}
        description={props.meta.description}
        route={props.meta.route}
        image_url={props.meta.image_url}
      />
      <div className="app-layout">
        <AppHeader />
        <div className="app-content">{props.children}</div>
      </div>
    </>
  );
}

// const makeStore = () => store;
// const wrapper = createWrapper();

export default Layout;
// export default wrapper.withRedux(Layout);
