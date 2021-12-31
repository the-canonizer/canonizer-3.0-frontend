import { store } from "../../store";
import LoggedInHeader from "../../components/common/headers/loggedInHeader";
import { useEffect } from "react";
import { Layout } from "antd";
import Spinner from "../../components/common/spinner/spinner";
import styles from "../layout.module.scss";
function LoggedInLayout(props) {
  const { auth } = store.getState();

  const { Content } = Layout;

  useEffect(() => {
    if (!auth.token) {
      window.location.href = "/login";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Layout className={styles["app-layout"]}>
        <LoggedInHeader />
        <Content className="app-content">
          {props.children}
          <Spinner></Spinner>
        </Content>
      </Layout>
    </>
  );
}

// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

export default LoggedInLayout;
// export default wrapper.withRedux(LoggedInLayout);
