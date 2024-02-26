import React, { useEffect } from "react";
import useState from "react-usestateref";
import App, { AppContext } from "next/app";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { useRouter } from "next/router";

import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../styles/globals.scss";
import "../../styles/variables.less";
import "../assets/fonticons/style.css";
import "../assets/scss/global.scss";
import "../assets/editorcss/editor.css";

import ErrorBoundary from "../hoc/ErrorBoundary";
import HeadContentAndPermissionComponent from "../components/common/headContentAndPermisisonCheck";
import { store, wrapper } from "../store";
import { metaTagsApi } from "src/network/api/metaTagsAPI";
import { checkTopicCampExistAPICall } from "src/network/api/campDetailApi";
import { getCookies } from "src/utils/generalUtility";
import { createToken } from "src/network/api/userApi";

function WrappedApp({ Component, pageProps, meta, canonical_url }: any) {
  const router = useRouter(),
    // eslint-disable-next-line
    [_, setIsAuthenticated, isAuthenticatedRef] = useState(
      !!(getCookies() as any)?.loginToken
    );

  useEffect(() => {
    const fetchToken = async () => {
      if (!(getCookies() as any)?.loginToken) {
        setIsAuthenticated(false);
        try {
          await createToken();
        } catch (error) {
          // eslint-disable-next-line
          console.error("Error fetching data:", error);
        } finally {
          setIsAuthenticated(true);
        }
      }
    };

    fetchToken();
    // eslint-disable-next-line
  }, [
    router.pathname,
    +router.query?.camp?.at(1)?.split("-")[0],
    !!(getCookies() as any)?.loginToken,
  ]);

  return isAuthenticatedRef.current && !!(getCookies() as any)?.loginToken ? (
    <CookiesProvider>
      <Provider store={store}>
        <ErrorBoundary>
          <HeadContentAndPermissionComponent
            componentName={Component.displayName || Component.name}
            metaContent={meta}
            canonical={canonical_url}
            {...pageProps}
          />
          <Component {...pageProps} />
        </ErrorBoundary>
      </Provider>
    </CookiesProvider>
  ) : null;
}

let timeout;
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

  let canonical_url =
    process.env.NEXT_PUBLIC_BASE_URL + appContext?.router?.asPath;

  const req = {
    page_name:
      componentName === "SocialLoginCallbackPage" ? "Home" : componentName,
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

  let metaResults;
  if (timeout) timeout = clearTimeout(timeout);

  if (!timeout) {
    timeout = setTimeout(async () => {
      metaResults = await metaTagsApi(req);
    }, 1500);
  }
  const metaData =
    metaResults?.status_code == 200 ? metaResults.data : defaultTags;

  /**
   *
   * [OLD Routes]
   * /topic.asp/120/8
   * /support_list.asp?nick_name_id=1
   * /secure/support.asp?topic_num=97&camp_num=1
   * /thread.asp/23/13/4
   * /forum.asp/88/1
   * /topoc.asp/85
   * /manage.asp/2/2?class=camp
   * /statement.asp/2/2
   * /stmt.asp/2/2
   * /[anything].asp/dadsa
   * /secure/upload.asp
   * /secure/email_camp.asp/88/6/3
   *
   */

  const refererURL = appContext?.ctx?.req?.headers?.referer || "";

  const redirect = async (
    url: string,
    topic_num: number,
    camp_num: number,
    is_type: string,
    nick_id: any = "",
    thread_id: any = ""
  ) => {
    const reqBody = {
      topic_num,
      camp_num,
      url,
      nick_id,
      thread_id,
      is_type,
      refererURL,
    };
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
    } else if (aspath?.includes("support.asp")) {
      const nickname = appContext.ctx.query?.nick_name_id,
        topic_num = appContext.ctx.query?.topic_num,
        camp_num = appContext.ctx.query?.camp_num || "1",
        canon = appContext.ctx.query?.nick_name_id || 1;

      if (nickname) {
        returnData = await redirect(
          "/user/supports/" +
            nickname +
            "?topicnum=" +
            topic_num +
            "&campnum=" +
            camp_num +
            "&canon=" +
            canon,
          +topic_num,
          +camp_num,
          "nickname",
          +nickname
        );
      } else {
        returnData = await redirect(
          `/topic/${topic_num}/${camp_num}`,
          +topic_num,
          +camp_num,
          "topic"
        );
      }
    } else if (aspath?.includes("email_camp.asp")) {
      const replaced = aspath.replace(".asp", "");
      let spilitedPath = replaced?.split("/");
      const topic = +spilitedPath[spilitedPath?.length - 3]?.split("-")[0],
        camp = +spilitedPath[spilitedPath?.length - 2]?.split("-")[0] ?? 1,
        threadId = +spilitedPath[spilitedPath?.length - 1];
      if (threadId) {
        returnData = await redirect(
          `/forum/${topic}/${camp}/threads/${threadId}`,
          topic,
          camp,
          "topic"
        );
      } else {
        returnData = await redirect(
          `/forum/${topic}/${camp}/threads`,
          topic,
          camp,
          "topic"
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
    } else if (aspath?.includes("upload.asp")) {
      returnData = "/uploadFile";
    } else {
      returnData = await redirect(aspath, null, null, "");
    }
  }

  if (returnData) {
    appContext.ctx.res.writeHead(302, { Location: returnData });
    appContext.ctx.res.end();
  }

  return {
    ...appProps,
    meta: metaData,
    returnURL: returnData,
    canonical_url,
  };
};

export default wrapper.withRedux(WrappedApp);
