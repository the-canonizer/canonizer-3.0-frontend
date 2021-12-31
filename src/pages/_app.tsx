import "antd/dist/antd.css";
import "../../styles/globals.scss";
import "../../styles/variables.less";
import { store, persistor } from "../store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { createWrapper } from "next-redux-wrapper";
import HeadContentComponent from "../components/common/headContentAndPermisisonCheck";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            <HeadContentComponent componentName={Component.name}>
              {" "}
            </HeadContentComponent>
            <Component {...pageProps} />
          </>
        </PersistGate>
      </Provider>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
