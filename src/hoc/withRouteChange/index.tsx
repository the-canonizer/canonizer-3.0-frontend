import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { setCurrentReturnUrl } from "src/store/slices/authSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const WithRouteChange = (pageProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setIsChanging(true);
      console.log("Started....");

      const currentUrl = router.asPath;

      const excludedPaths = [
        "/login",
        "/registration",
        "/login/otp",
        "/registration/otp",
        "/tags-preference",
        "/forgot-password",
        "/forgot-password/otp",
        "/reset-password",
      ];

      if (!excludedPaths.includes(currentUrl)) {
        if (url === "/registration" || url === "/login") {
          dispatch(setCurrentReturnUrl(currentUrl));
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", () => {
      setIsChanging(false);
    });

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", () => {});
    };
  }, [router.asPath, dispatch]);

  const load = isChanging ? (
    <div className="bg-[rgba(0,0,0,0.4)] flex justify-center items-center min-w-screen w-full h-full min-h-screen p-5 fixed top-0 left-0 right-0 z-[9000] bottom-0">
      <div className="rounded-md shadow-x">
        <div className="flex items-end gap-1">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48 }}
                spin
                className="[&_svg]:fill-canHoverBlue"
              />
            }
            wrapperClassName={`h-full [&_.ant-spin-container]:h-full`}
            className={`h-full`}
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <Fragment>
      {load}
      {pageProps.children}
    </Fragment>
  );
};

export default WithRouteChange;
