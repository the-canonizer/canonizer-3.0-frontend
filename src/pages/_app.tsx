import "antd/dist/antd.css";
import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";
import { store } from "../store";
import { Provider } from "react-redux";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
import ErrorBoundary from "../hoc/ErrorBoundary";
import GoogleAnalyticScripts from "../firebaseConfig/scripts";
import React from "react";
import App, { AppInitialProps, AppContext } from "next/app";
import { wrapper } from "../store";

class WrappedApp extends App<AppInitialProps> {
  public render() {
    const { Component, pageProps } = this.props;
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
}

export default wrapper.withRedux(WrappedApp);
