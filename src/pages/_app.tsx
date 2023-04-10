import React from "react";
import App, { AppContext, AppInitialProps } from "next/app";
import { Provider } from "react-redux";
import scriptLoader from "react-async-script-loader";

import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";

import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";

import ErrorBoundary from "../hoc/ErrorBoundary";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
// import GoogleAnalyticScripts from "../firebaseConfig/scripts";
import { store, wrapper } from "../store";
import { metaTagsApi } from "src/network/api/metaTagsAPI";

class WrappedApp extends App<AppInitialProps> {
  public render() {
    const { Component, pageProps, meta } = this.props as any;
    console.log("[META_LOG]", meta);
    return (
      <>
        {/* <GoogleAnalyticScripts /> */}
        <Provider store={store}>
          <ErrorBoundary>
            <HeadContentAndPermissionComponent
              componentName={Component.displayName || Component.name}
              metaContent={meta}
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
WrappedApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const componentName =
    appContext.Component.displayName || appContext.Component.name;

  const req = {
    page_name:
      componentName == "SocialLoginCallbackPage" ? "Home" : componentName,
    keys: {
      topic_num: appContext.router.asPath.includes("forum")
        ? appContext.router?.query?.topic?.toLocaleString().split("-")[0]
        : appContext.router?.query?.camp?.length &&
          appContext.router.query.camp[0].split("-")[0],
      camp_num: appContext.router.asPath.includes("forum")
        ? appContext.router.query.camp?.toLocaleString().split("-")[0]
        : appContext.router?.query?.camp?.length > 1
        ? appContext.router.query.camp[1].split("-")[0]
        : "1",
      forum_num:
        appContext.router?.query?.camp?.length > 2
          ? Object.keys(appContext.router.query)?.length > 2
            ? appContext.router?.query?.id
            : null
          : null,
    },
  };

  const defaultTags = {
    page_name: "Home",
    title: "Build consensus by canonizing what you believe is right",
    description:
      "Bringing the world together by canonizing what you believe is right. Your thoughts are processed through our pattented algorithims in a qualified & quantified camp where others can see, join & together change the world.",
    author: "",
  };

  const metaResults = await metaTagsApi(req);
  const metaData =
    metaResults?.status_code == 200 ? metaResults.data : defaultTags;

  return { ...appProps, meta: metaData };
};

const googleAPIKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
//export default wrapper.withRedux(MyApp);
export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places`,
])(wrapper.withRedux(WrappedApp));
