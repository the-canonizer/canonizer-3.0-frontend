import "antd/dist/antd.css";
import "../../styles/globals.scss";
import "../../styles/variables.less";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { store, persistor } from "../store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { createWrapper } from "next-redux-wrapper";
import HeadContentComponent from "../components/common/headContentAndPermisisonCheck";
import * as gtag from "../firebaseConfig/gtag";
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
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
