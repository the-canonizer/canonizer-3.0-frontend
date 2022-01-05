import "antd/dist/antd.css";
import "../../styles/globals.scss";
import "../../styles/variables.less";
import { store } from "../store";
import { Provider } from "react-redux";

import { createWrapper } from "next-redux-wrapper";
import HeadContentComponent from "../components/common/headContentAndPermisisonCheck";
import ErrorBoundary from "../hoc/errorBoundary";
import GoogleAnalyticScripts from "../firebaseConfig/scripts";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalyticScripts />
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ErrorBoundary>
          <HeadContentComponent componentName={Component.name}>
            {" "}
          </HeadContentComponent>
          <Component {...pageProps} />
        </ErrorBoundary>
        {/* </PersistGate> */}
      </Provider>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
