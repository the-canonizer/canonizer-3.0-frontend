import React, { Fragment } from "react";
import App, { AppContext, AppInitialProps } from "next/app";
import { Provider } from "react-redux";
import scriptLoader from "react-async-script-loader";
import { CookiesProvider } from "react-cookie";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";

import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";

import ErrorBoundary from "../hoc/ErrorBoundary";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
import { store, wrapper } from "../store";
import { metaTagsApi } from "src/network/api/metaTagsAPI";
import { checkTopicCampExistAPICall } from "src/network/api/campDetailApi";

class WrappedApp extends App<AppInitialProps> {
  public render() {
    const { Component, pageProps, meta } = this.props as any;

    return (
      <Fragment>
        <CookiesProvider>
          <Provider store={store}>
            <ErrorBoundary>
              <HeadContentAndPermissionComponent
                componentName={Component.displayName || Component.name}
                metaContent={meta}
              />
              <GoogleReCaptchaProvider
                reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                scriptProps={{
                  async: false,
                  defer: false,
                  appendTo: "head",
                  nonce: undefined,
                }}
              >
                <Component {...pageProps} />
              </GoogleReCaptchaProvider>
            </ErrorBoundary>
          </Provider>
        </CookiesProvider>
      </Fragment>
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
  let prePath = appContext?.router?.asPath?.substring(
    0,
    appContext?.router?.asPath.lastIndexOf("/")
  );
  let path;

  if (prePath == "/manage/camp") {
    path =
      appContext?.router?.components &&
      appContext?.router?.components["/camp/history/[...camp]"]?.query;
  } else if (prePath == "/manage/topic") {
    path =
      appContext?.router?.components &&
      appContext?.router?.components["/topic/history/[...camp]"]?.query;
  } else if (prePath == "/manage/statement") {
    path =
      appContext?.router?.components &&
      appContext?.router?.components["/statement/history/[...camp]"]?.query;
  } else {
    path = appContext.router?.query;
  }
  const req = {
    page_name:
      componentName == "SocialLoginCallbackPage" ? "Home" : componentName,
    keys: {
      topic_num: appContext.router?.asPath.includes("forum")
        ? path?.topic?.toLocaleString().split("-")[0]
        : path?.camp?.length && path?.camp[0].split("-")[0],
      camp_num: appContext.router?.asPath.includes("forum")
        ? path?.camp?.toLocaleString().split("-")[0]
        : path?.camp?.length > 1
        ? path?.camp[1].split("-")[0]
        : "1",
      forum_num:
        appContext.router?.query?.camp?.length > 2
          ? Object.keys(appContext.router?.query)?.length > 2
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

  /**
   *
   * [OLD Routes]
   * /topic.asp/120/8
   * /support_list.asp?nick_name_id=1
   * /thread.asp/23/13/4
   * /forum.asp/88/1
   * /topoc.asp/85
   * /manage.asp/2/2?class=camp
   * /statement.asp/2/2
   * /stmt.asp/2/2
   * /[anything].asp/dadsa
   *
   */

  const redirect = async (
    url: string,
    topic_num: number,
    camp_num: number,
    is_type: string,
    nick_id: any = "",
    thread_id: any = ""
  ) => {
    const reqBody = { topic_num, camp_num, url, nick_id, thread_id, is_type };
    const checkRes = await checkTopicCampExistAPICall(reqBody);

    if (checkRes && checkRes?.status_code === 200 && checkRes?.data?.is_exist) {
      return url;
    }
    return "";
  };

  const aspath = appContext.router?.asPath;
  let returnData: string;

  if (aspath?.includes(".asp")) {
    if (aspath?.includes("topic.asp") || aspath?.includes("topoc.asp")) {
      const replaced = aspath.replace(".asp", "");
      let spilitedPath = replaced?.split("/");
      if (spilitedPath?.length > 3) {
        const topic = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0],
          camp = +spilitedPath[spilitedPath?.length - 1]?.split("-")[0] ?? 1;
        returnData = await redirect(
          `/topic/${topic}/${camp}`,
          topic,
          camp,
          "topic"
        );
      } else {
        const topic = +spilitedPath[spilitedPath?.length - 1],
          camp = 1;
        returnData = await redirect(
          `/topic/${topic}/${camp}`,
          topic,
          camp,
          "topic"
        );
      }
    } else if (aspath?.includes("support_list.asp")) {
      const nickname = appContext.ctx.query?.nick_name_id,
        canon = appContext.ctx.query?.nick_name_id || 1;

      if (nickname) {
        returnData = await redirect(
          "/user/supports/" + nickname + "?topicnum=&campnum=&canon=" + canon,
          null,
          null,
          "nickname",
          +nickname
        );
      }
    } else if (
      aspath?.includes("thread.asp") ||
      aspath?.includes("forum.asp")
    ) {
      const replaced = aspath.replace(".asp", "");
      let spilitedPath = replaced?.split("/");

      if (spilitedPath?.length > 4) {
        const topic = +spilitedPath[spilitedPath?.length - 3]?.split("-")[0],
          camp = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0] ?? 1,
          thread_id = +spilitedPath[spilitedPath?.length - 1];

        returnData = await redirect(
          `/forum/${topic}/${camp}/threads/${thread_id}`,
          topic,
          camp,
          "thread",
          null,
          thread_id
        );
      } else {
        const topic = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0],
          camp = +spilitedPath[spilitedPath?.length - 1]?.split("-")[0] ?? 1;
        returnData = await redirect(
          `/forum/${topic}/${camp}/threads`,
          topic,
          camp,
          "topic"
        );
      }
    } else if (
      aspath?.includes("statement.asp") ||
      aspath?.includes("smt.asp") ||
      aspath?.includes("stmt.asp")
    ) {
      const replaced = aspath.replace(".asp", "");
      let spilitedPath = replaced?.split("/");
      const topic = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0],
        camp = +spilitedPath[spilitedPath?.length - 1]?.split("-")[0] ?? 1;
      returnData = await redirect(
        `/statement/history/${topic}/${camp}`,
        topic,
        camp,
        "topic"
      );
    } else if (aspath?.includes("manage.asp")) {
      const replaced = aspath.replace(".asp", "");
      let spilitedPath = replaced?.split("?")[0]?.split("/");

      const classType = appContext.ctx.query?.class,
        topic = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0],
        camp = +spilitedPath[spilitedPath?.length - 1]?.split("-")[0] ?? 1;

      if (classType == "camp") {
        returnData = await redirect(
          `/camp/history/${topic}/${camp}`,
          topic,
          camp,
          "topic"
        );
      } else if (classType == "topic") {
        returnData = await redirect(
          `/topic/history/${topic}/${camp}`,
          topic,
          camp,
          "topic"
        );
      } else if (classType == "statement") {
        returnData = await redirect(
          `/statement/history/${topic}/${camp}`,
          topic,
          camp,
          "statement"
        );
      }
    } else if (aspath?.includes("login.asp")) {
      returnData = "/login";
    } else if (aspath?.includes("signup.asp")) {
      returnData = "/registration";
    } else {
      returnData = await redirect(aspath, null, null, "");
    }
  }

  if (returnData) {
    appContext.ctx.res.writeHead(302, { Location: returnData });
    appContext.ctx.res.end();
  }

  return { ...appProps, meta: metaData, returnURL: returnData };
};

const googleAPIKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
//export default wrapper.withRedux(MyApp);
export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${googleAPIKey}&libraries=places`,
])(wrapper.withRedux(WrappedApp));
