import "antd/dist/antd.css";
import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";
import { store } from "../store";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { createWrapper } from "next-redux-wrapper";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
import ErrorBoundary from "../hoc/errorBoundary";
import GoogleAnalyticScripts from "../firebaseConfig/scripts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalyticScripts />
      <Provider store={store}>
        <ErrorBoundary>
          <HeadContentAndPermissionComponent componentName={Component.name} />
          <Component {...pageProps} />
        </ErrorBoundary>
      </Provider>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
