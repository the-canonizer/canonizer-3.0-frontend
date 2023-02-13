import React from "react";
import App, { AppInitialProps } from "next/app";
import { Provider } from "react-redux";
import scriptLoader from "react-async-script-loader";

import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";

import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../components/ComponentPages/TimeLine/timeline.css";
import "../assets/scss/global.scss";

import ErrorBoundary from "../hoc/ErrorBoundary";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
import GoogleAnalyticScripts from "../firebaseConfig/scripts";
import { store, wrapper } from "../store";

class WrappedApp extends App<AppInitialProps> {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GoogleAnalyticScripts />
        <Provider store={store}>
          <ErrorBoundary>
            <HeadContentAndPermissionComponent
              componentName={Component.displayName || Component.name}
            />
            <Component {...pageProps} />
          </ErrorBoundary>
        </Provider>
      </>
    );
  }
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

const googleAPIKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
//export default wrapper.withRedux(MyApp);
export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places`,
])(wrapper.withRedux(WrappedApp));
